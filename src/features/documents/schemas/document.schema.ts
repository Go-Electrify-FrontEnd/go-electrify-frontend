import { z } from "zod";

/**
 * Document type enum for validation
 */
export const documentTypeSchema = z.enum([
  "FAQ",
  "Guide",
  "Policy",
  "Troubleshooting",
  "Other",
]);

/**
 * Document status enum for validation
 */
export const documentStatusSchema = z.enum(["processing", "indexed", "failed"]);

/**
 * Document metadata schema (for API responses)
 */
export const documentSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  type: documentTypeSchema,
  description: z.string().optional(),
  chunkCount: z.number().int().min(0),
  uploadDate: z.string().datetime(),
  status: documentStatusSchema,
  source: z.string().min(1),
});

/**
 * Array of documents schema
 */
export const documentsArraySchema = z.array(documentSchema);
