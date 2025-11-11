import { chunkTextWithLLM, type ChunkingOptions } from "./llm-chunker";
import type { ChunkConfig } from "../types";

const DEFAULT_CHUNK_CONFIG: ChunkConfig = {
  chunkSize: 512, // tokens (optimal for embeddings)
  chunkOverlap: 100, // tokens (maintains context)
  separator: "\n\n", // Paragraph separator
};

/**
 * Document type for specialized chunking rules
 */
export type DocumentType = "default" | "markdown" | "code";

/**
 * Split text into chunks using LLM-based intelligent chunking
 *
 * Uses Grok-4-fast-reasoning for superior semantic chunking:
 * - Understands document context and structure
 * - Preserves semantic boundaries
 * - Adapts to different document types
 * - Maintains coherence across chunks
 *
 * @param text - Text to chunk
 * @param config - Chunking configuration
 * @param documentType - Type of document for specialized rules
 * @returns Array of text chunks
 */
export async function chunkText(
  text: string,
  config: Partial<ChunkConfig> = {},
  documentType: DocumentType = "default",
): Promise<string[]> {
  const fullConfig = { ...DEFAULT_CHUNK_CONFIG, ...config };
  const { chunkSize } = fullConfig;

  const normalizedText = text.trim().replace(/\r\n/g, "\n");
  if (!normalizedText) {
    return [];
  }

  try {
    // Convert token-based config to character-based (roughly 4 chars per token)
    const options: Partial<ChunkingOptions> = {
      maxChunkSize: chunkSize * 4,
      minChunkSize: Math.floor(chunkSize * 4 * 0.2), // 20% of max
      preserveContext: true,
      documentType,
    };

    const result = await chunkTextWithLLM(normalizedText, options);
    return result.chunks;
  } catch (error) {
    console.error("LLM chunking error:", error);
    return [normalizedText];
  }
}

/**
 * Advanced chunking with full metadata
 * Returns chunking result with metadata
 *
 * @param text - Text to chunk
 * @param config - Chunking configuration
 * @param documentType - Type of document for specialized rules
 * @returns Chunking result with chunks and metadata
 */
export async function chunkTextWithMetadata(
  text: string,
  config: Partial<ChunkConfig> = {},
  documentType: DocumentType = "default",
) {
  const fullConfig = { ...DEFAULT_CHUNK_CONFIG, ...config };
  const { chunkSize } = fullConfig;

  const normalizedText = text.trim().replace(/\r\n/g, "\n");
  if (!normalizedText) {
    return {
      chunks: [],
      metadata: {
        totalChunks: 0,
        averageChunkSize: 0,
        processingTime: 0,
      },
    };
  }

  try {
    // Convert token-based config to character-based (roughly 4 chars per token)
    const options: Partial<ChunkingOptions> = {
      maxChunkSize: chunkSize * 4,
      minChunkSize: Math.floor(chunkSize * 4 * 0.2),
      preserveContext: true,
      documentType,
    };

    return await chunkTextWithLLM(normalizedText, options);
  } catch (error) {
    console.error("LLM chunking error:", error);
    // Fallback: return whole text as single chunk
    return {
      chunks: [normalizedText],
      metadata: {
        totalChunks: 1,
        averageChunkSize: normalizedText.length,
        processingTime: 0,
      },
    };
  }
}

/**
 * Clean and normalize text for processing
 * Removes extra whitespace, fixes encoding issues
 *
 * @param text - Raw text
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  return (
    text
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      // Remove excessive whitespace
      .replace(/[ \t]+/g, " ")
      // Remove excessive newlines (keep max 2)
      .replace(/\n{3,}/g, "\n\n")
      // Fix common encoding issues
      .replace(/â€™/g, "'")
      .replace(/â€œ/g, '"')
      .replace(/â€/g, '"')
      .replace(/â€"/g, "—")
      // Trim
      .trim()
  );
}

/**
 * Parse plain text file
 *
 * @param content - File content buffer
 * @returns Parsed text
 */
export async function parseTextFile(content: Buffer): Promise<string> {
  return cleanText(content.toString("utf-8"));
}

/**
 * Parse document based on file type
 *
 * @param content - File content buffer
 * @param mimeType - File MIME type
 * @param filename - Optional filename for fallback extension detection
 * @returns Parsed text content
 */
export async function parseDocument(
  content: Buffer,
  mimeType: string,
  filename?: string,
): Promise<string> {
  // Derive actual type from filename extension if MIME is generic/unreliable
  let actualType = mimeType;

  if ((mimeType === "application/octet-stream" || !mimeType) && filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "txt") {
      actualType = "text/plain";
    }
  }

  switch (actualType) {
    case "text/plain":
      return parseTextFile(content);
    default:
      throw new Error(
        `Unsupported file type: ${actualType}. Only .txt files are currently supported`,
      );
  }
}
