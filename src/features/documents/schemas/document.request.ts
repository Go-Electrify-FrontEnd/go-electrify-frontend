import { z } from "zod";

/**
 * Allowed MIME types for document upload
 */
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/x-markdown",
] as const;

/**
 * Maximum file size (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Upload document form schema
 * Used for initial document upload with file
 */
export const uploadDocumentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Document name is required")
    .max(200, "Name must be less than 200 characters"),

  type: z.enum(["FAQ", "Guide", "Policy", "Troubleshooting", "Other"]),

  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .default("")
    .transform((value) => (value === "" ? undefined : value)),

  // File will be validated separately in the component/action
  // FormData doesn't work well with z.instanceof(File)
});

/**
 * Update document form schema
 * Used for updating document metadata (with optional re-indexing)
 */
export const updateDocumentSchema = z.object({
  id: z.uuid("Invalid document ID"),

  name: z
    .string()
    .trim()
    .min(1, "Document name is required")
    .max(200, "Name must be less than 200 characters"),

  type: z.enum(["FAQ", "Guide", "Policy", "Troubleshooting", "Other"]),

  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .default("")
    .transform((value) => (value === "" ? undefined : value)),

  reindex: z
    .boolean()
    .default(false)
    .describe("Re-generate embeddings for this document"),
});

/**
 * Delete document form schema
 * Requires typing document name to confirm
 */
export const deleteDocumentSchema = z.object({
  id: z.string().uuid("Invalid document ID"),
  confirmText: z.string().min(1, "Please enter the document name to confirm"),
});

/**
 * Type exports for forms
 */
export type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;
export type UpdateDocumentFormData = z.infer<typeof updateDocumentSchema>;
export type DeleteDocumentFormData = z.infer<typeof deleteDocumentSchema>;

/**
 * File validation helper
 * Used in upload components/actions
 */
export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: PDF, TXT, MD`,
    };
  }

  return { valid: true };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Generate document name from filename
 * Removes extension and cleans up
 */
export function generateDocumentName(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[_-]/g, " ") // Replace underscores/hyphens with spaces
    .trim();
}
