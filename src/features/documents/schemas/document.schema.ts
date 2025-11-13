import { z } from "zod";
import type { TargetActor } from "@/features/rag/types";

const TARGET_ACTORS = [
  "admin",
  "staff",
  "driver",
] as const satisfies readonly TargetActor[];

function normalizeTargetActors(value: unknown): TargetActor[] {
  const fallback = [...TARGET_ACTORS] as TargetActor[];

  if (Array.isArray(value)) {
    const normalized = value
      .filter((actor): actor is string => typeof actor === "string")
      .map((actor) => actor.trim().toLowerCase())
      .filter((actor): actor is TargetActor =>
        (TARGET_ACTORS as readonly string[]).includes(actor),
      );

    if (normalized.length === 0) {
      return fallback;
    }

    return Array.from(new Set(normalized)) as TargetActor[];
  }

  if (typeof value === "string") {
    const normalized = value
      .split(",")
      .map((actor) => actor.trim().toLowerCase())
      .filter((actor): actor is TargetActor =>
        (TARGET_ACTORS as readonly string[]).includes(actor),
      );

    if (normalized.length === 0) {
      return fallback;
    }

    return Array.from(new Set(normalized)) as TargetActor[];
  }

  return fallback;
}

const targetActorsSchema = z
  .union([z.string(), z.array(z.string()), z.null(), z.undefined()])
  .transform(normalizeTargetActors);

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
  targetActors: targetActorsSchema,
});

/**
 * Array of documents schema
 */
export const documentsArraySchema = z.array(documentSchema);
