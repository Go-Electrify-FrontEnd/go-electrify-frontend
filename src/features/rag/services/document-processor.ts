import { RecursiveChunker, type Chunk } from "@chonkiejs/core";
import type { ChunkConfig } from "../types";

/**
 * Default chunking configuration
 * Based on best practices for RAG systems with Chonkie
 */
const DEFAULT_CHUNK_CONFIG: ChunkConfig = {
  chunkSize: 512, // tokens (optimal for embeddings)
  chunkOverlap: 100, // tokens (maintains context)
  separator: "\n\n", // Paragraph separator
};

// Singleton chunker instance to avoid recreating
let chunkerInstance: RecursiveChunker | null = null;

/**
 * Get or create the Chonkie chunker instance
 * Uses character-based tokenization (built-in, no dependencies)
 */
async function getChunker(chunkSize: number): Promise<RecursiveChunker> {
  if (!chunkerInstance || chunkerInstance.chunkSize !== chunkSize) {
    chunkerInstance = await RecursiveChunker.create({
      chunkSize,
      minCharactersPerChunk: 24, // Minimum chunk size to avoid tiny fragments
    });
  }
  return chunkerInstance;
}

/**
 * Split text into chunks using Chonkie's RecursiveChunker
 *
 * Chonkie provides superior chunking with:
 * - Hierarchical splitting (paragraphs → sentences → words → characters)
 * - Semantic boundary preservation
 * - Accurate token counting
 * - Better handling of edge cases
 *
 * @param text - Text to chunk
 * @param config - Chunking configuration
 * @returns Array of text chunks
 */
export async function chunkText(
  text: string,
  config: Partial<ChunkConfig> = {},
): Promise<string[]> {
  const fullConfig = { ...DEFAULT_CHUNK_CONFIG, ...config };
  const { chunkSize, chunkOverlap } = fullConfig;

  const normalizedText = text.trim().replace(/\r\n/g, "\n");
  if (!normalizedText) {
    return [];
  }

  try {
    // Get Chonkie chunker instance
    const chunker = await getChunker(chunkSize);

    // Chunk the text
    const chunks: Chunk[] = await chunker.chunk(normalizedText);

    // If overlap is requested, apply it manually
    // (Chonkie's core package doesn't have built-in overlap for RecursiveChunker)
    if (chunkOverlap > 0) {
      return applyOverlap(chunks, chunkOverlap);
    }

    // Return chunk texts
    return chunks.map((chunk) => chunk.text);
  } catch (error) {
    console.error("Chonkie chunking error:", error);
    // Fallback: return the whole text if chunking fails
    return [normalizedText];
  }
}

/**
 * Apply overlap to chunks manually
 * Takes trailing content from previous chunk and prepends to next chunk
 */
function applyOverlap(chunks: Chunk[], overlapTokens: number): string[] {
  if (chunks.length <= 1 || overlapTokens <= 0) {
    return chunks.map((c) => c.text);
  }

  const result: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    if (i === 0) {
      // First chunk - no overlap needed
      result.push(chunk.text);
    } else {
      // Get overlap from previous chunk
      const prevChunk = chunks[i - 1];
      const overlapText = getTrailingText(prevChunk.text, overlapTokens);

      // Prepend overlap to current chunk
      result.push(overlapText ? `${overlapText}\n\n${chunk.text}` : chunk.text);
    }
  }

  return result;
}

/**
 * Get trailing text from a chunk for overlap
 * Approximates token count as characters/4
 */
function getTrailingText(text: string, targetTokens: number): string {
  const approxChars = targetTokens * 4;
  if (text.length <= approxChars) {
    return text;
  }

  // Try to break at sentence boundary
  const trailing = text.slice(-approxChars);
  const sentenceMatch = trailing.match(/[.!?]\s+/);

  if (sentenceMatch && sentenceMatch.index !== undefined) {
    return trailing.slice(sentenceMatch.index + sentenceMatch[0].length);
  }

  return trailing;
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
 * Parse markdown file
 * Similar to text but preserves markdown structure
 *
 * @param content - File content buffer
 * @returns Parsed markdown text
 */
export async function parseMarkdownFile(content: Buffer): Promise<string> {
  return cleanText(content.toString("utf-8"));
}

/**
 * Parse PDF file
 * Extracts text content from PDF
 *
 * @param content - File content buffer
 * @returns Parsed text
 */
export async function parsePdfFile(content: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid bundling issues
    const pdfParse = (await import("pdf-parse")) as any;
    const parseFunc = pdfParse.default || pdfParse;
    const data = await parseFunc(content);
    return cleanText(data.text);
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF file");
  }
}

/**
 * Parse document based on file type
 *
 * @param content - File content buffer
 * @param mimeType - File MIME type
 * @returns Parsed text content
 */
export async function parseDocument(
  content: Buffer,
  mimeType: string,
): Promise<string> {
  switch (mimeType) {
    case "application/pdf":
      return parsePdfFile(content);

    case "text/plain":
      return parseTextFile(content);

    case "text/markdown":
    case "text/x-markdown":
      return parseMarkdownFile(content);

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
