import { listAllDocuments } from "@/features/rag/services/vector-operations";
import { documentsArraySchema } from "../schemas/document.schema";
import type { Document } from "../schemas/document.types";

/**
 * Fetch all documents from Pinecone
 * Server-side only function
 *
 * @returns Array of documents with metadata
 */
export async function getDocuments(): Promise<Document[]> {
  try {
    const documents = await listAllDocuments();

    // Validate with Zod schema
    const parsed = documentsArraySchema.safeParse(documents);

    if (!parsed.success) {
      console.error("Invalid documents data format:", parsed.error);
      return [];
    }

    return parsed.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

/**
 * Get document count
 * Useful for admin dashboard statistics
 *
 * @returns Total number of documents
 */
export async function getDocumentCount(): Promise<number> {
  try {
    const documents = await getDocuments();
    return documents.length;
  } catch (error) {
    console.error("Error getting document count:", error);
    return 0;
  }
}

/**
 * Get total chunk count across all documents
 * Useful for admin dashboard statistics
 *
 * @returns Total number of chunks/vectors
 */
export async function getTotalChunkCount(): Promise<number> {
  try {
    const documents = await getDocuments();
    return documents.reduce((total, doc) => total + doc.chunkCount, 0);
  } catch (error) {
    console.error("Error getting chunk count:", error);
    return 0;
  }
}
