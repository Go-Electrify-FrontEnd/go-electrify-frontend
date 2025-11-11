"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "@/lib/auth/auth-server";
import {
  uploadDocumentSchema,
  updateDocumentSchema,
  deleteDocumentSchema,
  validateFile,
  generateDocumentName,
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
      return { success: false, msg: "User not authenticated" };
    }

    // Admin-only check
    if (user.role.toLowerCase() !== "admin") {
      return { success: false, msg: "Unauthorized: Admin access required" };
    }

    // Extract and validate form data
    const rawData = {
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description") || undefined,
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
      return { success: false, msg: "No file provided" };
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
        msg: `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }

    if (!parsedText || parsedText.length < 50) {
      return {
        success: false,
        msg: "Document is too short or empty. Please provide a document with more content.",
      };
    }

    const chunks = await chunkText(parsedText);
    if (chunks.length === 0) {
      return { success: false, msg: "Failed to chunk document" };
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
      },
    );

    if (!upsertResult.success) {
      return { success: false, msg: upsertResult.message };
    }

    // Revalidate documents cache
    revalidatePath("/dashboard/admin/documents");

    return {
      success: true,
      msg: `Successfully uploaded "${data.name}" with ${chunks.length} chunks`,
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
      msg: error instanceof Error ? error.message : "Failed to upload document",
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
      return { success: false, msg: "User not authenticated" };
    }

    // Admin-only check
    if (user.role.toLowerCase() !== "admin") {
      return { success: false, msg: "Unauthorized: Admin access required" };
    }

    // Extract and validate form data
    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description") || undefined,
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

    // Update metadata in Pinecone
    const updateResult = await updateDocumentMetadata(data.id, {
      documentName: data.name,
      documentType: data.type,
      description: data.description,
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
        msg: `Metadata updated. Note: Re-indexing requires re-uploading the document.`,
      };
    }

    // Revalidate documents cache
    revalidatePath("/dashboard/admin/documents");

    return {
      success: true,
      msg: `Successfully updated "${data.name}"`,
    };
  } catch (error) {
    console.error("Error updating document:", error);
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Failed to update document",
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
      return { success: false, msg: "User not authenticated" };
    }

    // Admin-only check
    if (user.role.toLowerCase() !== "admin") {
      return { success: false, msg: "Unauthorized: Admin access required" };
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
      return { success: false, msg: "Document not found" };
    }

    // Verify confirmation text matches document name
    if (data.confirmText !== document.name) {
      return {
        success: false,
        msg: "Confirmation text does not match document name",
      };
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
      msg: `Successfully deleted "${document.name}"`,
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Failed to delete document",
    };
  }
}
