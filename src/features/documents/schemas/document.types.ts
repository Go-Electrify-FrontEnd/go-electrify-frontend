import type { DocumentType, DocumentStatus } from "@/features/rag/types";

/**
 * Document data structure for admin table
 * Extends base DocumentMetadata with UI-specific fields
 */
export interface Document extends Record<string, unknown> {
  id: string; // Document UUID
  name: string; // Display name
  type: DocumentType; // Category
  description?: string; // Optional description
  chunkCount: number; // Number of chunks/vectors
  uploadDate: string; // ISO date string
  status: DocumentStatus; // Processing status
  source: string; // Original filename
}

/**
 * Document form data for create/update operations
 */
export interface DocumentFormData {
  name: string;
  type: DocumentType;
  description?: string;
  file?: File;
  reindex?: boolean; // For update only
}

/**
 * Document upload result
 */
export interface DocumentUploadResult {
  documentId: string;
  chunks: number;
  name: string;
}
