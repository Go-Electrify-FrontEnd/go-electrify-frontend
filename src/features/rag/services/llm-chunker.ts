/**
 * LLM-based Text Chunking Service
 *
 * Uses Grok-4-fast-reasoning to intelligently chunk documents while:
 * - Preserving semantic boundaries
 * - Respecting natural document structure
 * - Maintaining context across chunks
 * - Optimizing for embedding quality
 */

import { gateway } from "@ai-sdk/gateway";
import { generateObject } from "ai";
import { z } from "zod";

export interface ChunkingResult {
  chunks: string[];
  metadata?: {
    totalChunks: number;
    averageChunkSize: number;
    processingTime: number;
  };
}

export interface ChunkingOptions {
  maxChunkSize: number; // Target max characters per chunk
  minChunkSize: number; // Minimum characters per chunk
}

const DEFAULT_OPTIONS: ChunkingOptions = {
  maxChunkSize: 2000, // ~512 tokens (4 chars per token)
  minChunkSize: 400, // ~100 tokens
};

/**
 * Normalize chunk text for optimal vector database storage.
 *
 * Converts markdown-heavy content into stable plain text by:
 * - Stripping markdown markers (headings, lists, emphasis, links)
 * - Replacing all newlines with single spaces
 * - Collapsing repeated whitespace
 * - Preserving punctuation, diacritics, and sentence flow
 */
function normalizeChunkText(text: string): string {
  if (!text) {
    return "";
  }

  const withoutMarkdownStructure = text
    .replace(/\r?\n/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(/^\s*#{1,6}\s+/g, "") // Headings
        .replace(/^\s*[-*+]\s+/g, "") // Bullet lists
        .replace(/^\s*>+\s*/g, "") // Block quotes
        .trim(),
    )
    .filter((line) => line.length > 0)
    .join(" ");

  const withoutStyling = withoutMarkdownStructure
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/__(.*?)__/g, "$1") // Bold (underscore)
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/_(.*?)_/g, "$1") // Italic (underscore)
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // Inline code
    .replace(/!\[(.*?)\]\((.*?)\)/g, "$1") // Images -> alt text
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1"); // Links -> label

  return withoutStyling
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s([,.;:!?])/g, "$1")
    .trim();
}

/**
 * Chunk text using Grok-4-fast-reasoning LLM
 *
 * This approach provides superior semantic chunking compared to rule-based methods:
 * - Understands document context and structure
 * - Preserves meaningful boundaries
 * - Adapts to different document types
 * - Maintains coherence across chunks
 * - Formats text optimally for vector database storage and semantic search
 */
export async function chunkTextWithLLM(
  text: string,
  options: Partial<ChunkingOptions> = {},
): Promise<ChunkingResult> {
  const startTime = Date.now();
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate input
  if (!text || text.trim().length === 0) {
    return {
      chunks: [],
      metadata: {
        totalChunks: 0,
        averageChunkSize: 0,
        processingTime: Date.now() - startTime,
      },
    };
  }

  try {
    const { object, usage } = await generateObject({
      model: gateway("xai/grok-4-fast-reasoning"),
      system: `You are a document chunking specialist. Split documents into semantic chunks optimized for vector search retrieval.

        CHUNKING RULES:
        - Target ${opts.minChunkSize}-${opts.maxChunkSize} characters per chunk
        - Keep complete ideas and concepts together (context overlap)
        - Each chunk must be self-contained and understandable independently
        - Format as continuous prose (replace all newlines with spaces)
        - Remove markdown formatting (#, **, *, etc.) but keep the text content
        - Normalize whitespace (collapse multiple spaces into one)

        OUTPUT: Return clean, normalized text chunks as a JSON array.`,
      schema: z.object({
        chunks: z
          .array(z.string())
          .describe(
            "Array of semantic chunks formatted as continuous prose, without special markdown characters",
          ),
      }),
      prompt: `Split this text into semantic chunks for vector database storage:\n\n${text}`,
      temperature: 0,
      maxRetries: 3,
    });

    // Validate and process chunks
    let chunks = object.chunks;

    console.log(`\n[LLM CHUNKING] Received ${chunks.length} chunks from LLM`);
    console.log(
      `[TOKEN USAGE] Prompt: ${usage.inputTokens} | Completion: ${usage.outputTokens} | Total: ${usage.totalTokens}`,
    );

    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("LLM returned empty chunks array");
    }

    // Filter out empty chunks and normalize text
    chunks = chunks
      .filter((chunk) => chunk && chunk.trim().length > 0)
      .map((chunk) => normalizeChunkText(chunk));

    if (chunks.length === 0) {
      throw new Error("All chunks were empty after filtering");
    }

    const processingTime = Date.now() - startTime;
    const averageChunkSize =
      chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length;

    console.log(
      `\n✅ [LLM CHUNKING SUCCESS] Total chunks: ${chunks.length} | Avg size: ${Math.round(averageChunkSize)} chars | Time: ${processingTime}ms\n`,
    );

    return {
      chunks,
      metadata: {
        totalChunks: chunks.length,
        averageChunkSize: Math.round(averageChunkSize),
        processingTime,
      },
    };
  } catch (error) {
    console.error("❌ [LLM CHUNKING] Fatal error:", error);
    throw new Error(
      `LLM chunking failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
