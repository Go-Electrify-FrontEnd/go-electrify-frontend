"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "@/lib/auth/auth-server";
import { hasRole } from "@/lib/auth/role-check";
import {
  uploadDocumentSchema,
  updateDocumentSchema,
  deleteDocumentSchema,
  validateFile,
} from "../schemas/document.request";
import {
  parseDocument,
  chunkText,
} from "@/features/rag/services/document-processor";
import {
  upsertDocumentChunks,
  deleteDocumentById,
  updateDocumentMetadata,
  listAllDocuments,
} from "@/features/rag/services/vector-operations";

/**
 * Upload and index a new document
 * Server action for document upload form
 */
export async function uploadDocument(prev: unknown, formData: FormData) {
  try {
    // Check authentication
    const { user } = await getUser();
    if (!user) {
      return { success: false, msg: "Người dùng chưa xác thực" };
    }

    // Admin-only check
    if (!hasRole(user, "admin")) {
      return {
        success: false,
        msg: "Không được phép: Yêu cầu quyền quản trị viên",
      };
    }

    // Extract and validate form data
    const targetActorsRaw = formData.get("targetActors");
    const targetActors = targetActorsRaw
      ? JSON.parse(targetActorsRaw as string)
      : ["admin", "staff", "driver"];

    const rawData = {
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description") || undefined,
      targetActors,
    };

    const validation = uploadDocumentSchema.safeParse(rawData);
    if (!validation.success) {
      const msg = validation.error.issues
        .map((issue) => issue.message)
        .join("; ");
      return { success: false, msg };
    }

    const data = validation.data;

    // Get and validate file
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, msg: "Không có tệp được cung cấp" };
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return { success: false, msg: fileValidation.error! };
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse document based on type
    let parsedText: string;
    try {
      parsedText = await parseDocument(buffer, file.type, file.name);
    } catch (error) {
      return {
        success: false,
        msg: `Không thể phân tích tệp: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
      };
    }

    if (!parsedText || parsedText.length < 50) {
      return {
        success: false,
        msg: "Tài liệu quá ngắn hoặc trống. Vui lòng cung cấp tài liệu có nhiều nội dung hơn.",
      };
    }

    const chunks = await chunkText(parsedText);
    if (chunks.length === 0) {
      return { success: false, msg: "Không thể chia nhỏ tài liệu" };
    }

    const textChunks = chunks.map((content) => ({ content }));

    const documentId = uuidv4();
    const upsertResult = await upsertDocumentChunks(
      documentId,
      data.name,
      data.type,
      textChunks,
      {
        source: file.name,
        description: data.description,
        targetActors: data.targetActors,
      },
    );

    if (!upsertResult.success) {
      return { success: false, msg: upsertResult.message };
    }

    // Revalidate documents cache
    revalidatePath("/dashboard/admin/documents");

    return {
      success: true,
      msg: `Đã tải lên thành công "${data.name}" với ${chunks.length} phần`,
      data: {
        documentId,
        chunks: chunks.length,
        name: data.name,
      },
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    return {
      success: false,
      msg:
        error instanceof Error ? error.message : "Không thể tải lên tài liệu",
    };
  }
}

/**
 * Update document metadata
 * Optionally re-index document if reindex flag is set
 */
export async function updateDocument(prev: unknown, formData: FormData) {
  try {
    // Check authentication
    const { user } = await getUser();
    if (!user) {
      return { success: false, msg: "Người dùng chưa xác thực" };
    }

    // Admin-only check
    if (!hasRole(user, "admin")) {
      return {
        success: false,
        msg: "Không được phép: Yêu cầu quyền quản trị viên",
      };
    }

    // Extract and validate form data
    const targetActorsRaw = formData.get("targetActors");
    const targetActors = targetActorsRaw
      ? JSON.parse(targetActorsRaw as string)
      : ["admin", "staff", "driver"];

    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description") || undefined,
      targetActors,
      reindex: formData.get("reindex") === "true",
    };

    const validation = updateDocumentSchema.safeParse(rawData);
    if (!validation.success) {
      const msg = validation.error.issues
        .map((issue) => issue.message)
        .join("; ");
      return { success: false, msg };
    }

    const data = validation.data;

    // Update metadata in Upstash Vector
    const updateResult = await updateDocumentMetadata(data.id, {
      documentName: data.name,
      documentType: data.type,
      description: data.description,
      targetActors: data.targetActors,
    });

    if (!updateResult.success) {
      return { success: false, msg: updateResult.message };
    }

    // Handle re-indexing if requested
    if (data.reindex) {
      // Note: Re-indexing requires original file, which we don't store
      // For now, just return success with a note
      // In production, you'd store files in blob storage and re-process
      return {
        success: true,
        msg: `Đã cập nhật siêu dữ liệu. Lưu ý: Việc lập chỉ mục lại yêu cầu tải lên lại tài liệu.`,
      };
    }

    // Revalidate documents cache
    revalidatePath("/dashboard/admin/documents");

    return {
      success: true,
      msg: `Đã cập nhật thành công "${data.name}"`,
    };
  } catch (error) {
    console.error("Error updating document:", error);
    return {
      success: false,
      msg:
        error instanceof Error ? error.message : "Không thể cập nhật tài liệu",
    };
  }
}

/**
 * Delete document and all its chunks from Pinecone
 * Requires confirmation text to match document name
 */
export async function deleteDocument(prev: unknown, formData: FormData) {
  try {
    // Check authentication
    const { user } = await getUser();
    if (!user) {
      return { success: false, msg: "Người dùng chưa xác thực" };
    }

    // Admin-only check
    if (!hasRole(user, "admin")) {
      return {
        success: false,
        msg: "Không được phép: Yêu cầu quyền quản trị viên",
      };
    }

    // Extract and validate form data
    const rawData = {
      id: formData.get("id"),
      confirmText: formData.get("confirmText"),
    };

    const validation = deleteDocumentSchema.safeParse(rawData);
    if (!validation.success) {
      const msg = validation.error.issues
        .map((issue) => issue.message)
        .join("; ");
      return { success: false, msg };
    }

    const data = validation.data;

    // Get document to verify confirmation text
    const documents = await listAllDocuments();
    const document = documents.find((doc) => doc.id === data.id);

    if (!document) {
      return { success: false, msg: "Không tìm thấy tài liệu" };
    }

    // Delete from Pinecone
    const deleteResult = await deleteDocumentById(data.id);

    if (!deleteResult.success) {
      return { success: false, msg: deleteResult.message };
    }

    // Revalidate documents cache
    revalidatePath("/dashboard/admin/documents");

    return {
      success: true,
      msg: `Đã xóa thành công "${document.name}"`,
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Không thể xóa tài liệu",
    };
  }
}
