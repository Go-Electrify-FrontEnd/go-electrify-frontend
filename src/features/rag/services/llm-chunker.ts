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
  preserveContext: boolean; // Add overlap between chunks
  documentType?: "default" | "markdown" | "code";
}

const DEFAULT_OPTIONS: ChunkingOptions = {
  maxChunkSize: 2000, // ~512 tokens (4 chars per token)
  minChunkSize: 400, // ~100 tokens
  preserveContext: true,
  documentType: "default",
};

/**
 * Get chunking instructions based on document type
 */
function getChunkingInstructions(
  documentType: string,
  textLength: number,
): string {
  const shouldChunk = textLength > DEFAULT_OPTIONS.maxChunkSize;

  const baseInstructions = shouldChunk
    ? `You are a document chunking expert. Your task is to intelligently split the following text into semantic chunks.

CRITICAL RULES:
1. Each chunk MUST be between ${DEFAULT_OPTIONS.minChunkSize}-${DEFAULT_OPTIONS.maxChunkSize} characters
2. PRESERVE semantic boundaries (complete thoughts, paragraphs, sections)
3. DO NOT split mid-sentence unless absolutely necessary
4. Each chunk should be self-contained and meaningful
5. Return ONLY the chunks as a JSON array of strings
6. NO additional commentary, explanation, or markdown formatting`
    : `You are a document formatting expert. The following text is small enough to fit in one chunk.

CRITICAL RULES:
1. Format and clean the text while preserving all original content
2. Return the text as a single-element JSON array
3. Preserve semantic structure and formatting
4. Remove any unnecessary whitespace or formatting issues
5. Keep the text self-contained and meaningful
6. NO additional commentary, explanation, or markdown formatting`;

  const typeSpecificInstructions = {
    default: `
7. Split at paragraph boundaries when possible
8. Keep related sentences together
9. Preserve natural flow of ideas`,

    markdown: `
7. Respect markdown structure (headers, lists, code blocks)
8. Keep headers with their content
9. Don't split code blocks or tables
10. Preserve formatting markers`,

    code: `
7. Keep functions/classes together when possible
8. Preserve logical code blocks
9. Don't split related statements (if-else, try-catch)
10. Maintain comment-code associations`,
  };

  return (
    baseInstructions +
    typeSpecificInstructions[
      documentType as keyof typeof typeSpecificInstructions
    ]
  );
}

/**
 * Chunk text using Grok-4-fast-reasoning LLM
 *
 * This approach provides superior semantic chunking compared to rule-based methods:
 * - Understands document context and structure
 * - Preserves meaningful boundaries
 * - Adapts to different document types
 * - Maintains coherence across chunks
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

  // If text is already small enough, still let LLM format it as a single chunk
  // This ensures consistent formatting and cleaning even for small documents

  try {
    const instructions = getChunkingInstructions(
      opts.documentType || "default",
      text.length,
    );

    const { object } = await generateObject({
      model: gateway("xai/grok-4-fast-reasoning"),
      system: instructions,
      schema: z.object({
        chunks: z
          .array(z.string())
          .describe(
            `Array of semantic chunks. Each chunk should be ${opts.minChunkSize}-${opts.maxChunkSize} characters, preserve complete thoughts, and be self-contained.`,
          ),
      }),
      prompt: `Split this text into semantic chunks:\n\n${text}`,
      temperature: 0.1, // Low temperature for consistent chunking
      maxRetries: 3, // Retry on failure
    });

    // Validate and process chunks
    let chunks = object.chunks;

    console.log(`[LLM CHUNKING] Received ${chunks.length} chunks from LLM`);

    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("LLM returned empty chunks array");
    }

    // Filter out empty chunks and trim
    chunks = chunks
      .filter((chunk) => chunk && chunk.trim().length > 0)
      .map((chunk) => chunk.trim());

    if (chunks.length === 0) {
      throw new Error("All chunks were empty after filtering");
    }

    // Add context overlap if requested
    if (opts.preserveContext && chunks.length > 1) {
      chunks = addContextOverlap(chunks, 200); // ~50 tokens overlap
    }

    const processingTime = Date.now() - startTime;
    const averageChunkSize =
      chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length;

    console.log(
      `✅ [LLM CHUNKING SUCCESS] Chunks: ${chunks.length} | Avg size: ${Math.round(averageChunkSize)} chars | Time: ${processingTime}ms`,
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

/**
 * Add context overlap between chunks
 * Takes last N characters from previous chunk and prepends to next chunk
 */
function addContextOverlap(chunks: string[], overlapChars: number): string[] {
  if (chunks.length <= 1 || overlapChars <= 0) {
    return chunks;
  }

  const result: string[] = [chunks[0]];

  for (let i = 1; i < chunks.length; i++) {
    const prevChunk = chunks[i - 1];
    const currentChunk = chunks[i];

    // Get trailing context from previous chunk
    const overlapText = getTrailingContext(prevChunk, overlapChars);

    if (overlapText) {
      // Add overlap with smart separator
      const separator = needsSeparator(overlapText, currentChunk)
        ? "\n\n"
        : " ";
      result.push(`${overlapText}${separator}${currentChunk}`);
    } else {
      result.push(currentChunk);
    }
  }

  return result;
}

/**
 * Get trailing context from a chunk for overlap
 * Tries to break at sentence boundary
 */
function getTrailingContext(text: string, targetChars: number): string {
  if (text.length <= targetChars) {
    return text;
  }

  const trailing = text.slice(-targetChars);

  // Try to find sentence boundary
  const sentenceMatch = trailing.match(/([.!?])\s+/);
  if (sentenceMatch && sentenceMatch.index !== undefined) {
    return trailing.slice(sentenceMatch.index + sentenceMatch[0].length);
  }

  // Try to find word boundary
  const wordMatch = trailing.match(/\s+/);
  if (wordMatch && wordMatch.index !== undefined) {
    return trailing.slice(wordMatch.index + wordMatch[0].length);
  }

  return trailing;
}

/**
 * Check if separator is needed between overlap and chunk
 */
function needsSeparator(overlapText: string, chunkText: string): boolean {
  const overlapTrimmed = overlapText.trim();
  const chunkTrimmed = chunkText.trim();

  // Add separator if overlap ends with sentence boundary
  if (/[.!?]\s*$/.test(overlapTrimmed)) {
    return true;
  }

  // Add separator if chunk starts with capital letter or number
  if (/^[A-Z0-9]/.test(chunkTrimmed)) {
    return true;
  }

  return false;
}
