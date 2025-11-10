import {
  RecursiveChunker,
  RecursiveRules,
  Chunk,
  type RecursiveChunkerOptions,
} from "@chonkiejs/core";
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

/**
 * Create custom Chonkie rules for different document types
 */
const CHUNKING_RULES = {
  // Default rules for general text
  default: new RecursiveRules({
    levels: [
      { delimiters: ["\n\n", "\r\n\r\n"], includeDelim: "none" }, // Paragraphs
      { delimiters: [".", "!", "?"], includeDelim: "prev" }, // Sentences
      { delimiters: [",", ";", ":"], includeDelim: "prev" }, // Clauses
      { whitespace: true, includeDelim: "none" }, // Words
    ],
  }),

  // Optimized for markdown documents
  markdown: new RecursiveRules({
    levels: [
      { delimiters: ["\n## ", "\n### "], includeDelim: "next" }, // Headers
      { delimiters: ["\n\n"], includeDelim: "none" }, // Paragraphs
      { delimiters: [".", "!", "?"], includeDelim: "prev" }, // Sentences
      { whitespace: true, includeDelim: "none" }, // Words
    ],
  }),

  // Optimized for code-heavy documents
  code: new RecursiveRules({
    levels: [
      { delimiters: ["\n\n"], includeDelim: "none" }, // Code blocks
      { delimiters: ["\n"], includeDelim: "prev" }, // Lines
      { delimiters: [";", "{", "}"], includeDelim: "prev" }, // Statements
      { whitespace: true, includeDelim: "none" }, // Tokens
    ],
  }),
};

// Cache for chunker instances (keyed by chunkSize)
const chunkerCache = new Map<number, RecursiveChunker>();

/**
 * Get or create a Chonkie chunker instance
 * Uses caching to avoid recreating chunkers with the same configuration
 *
 * @param chunkSize - Maximum tokens per chunk
 * @param rules - Optional custom rules for chunking
 * @returns RecursiveChunker instance
 */
async function getChunker(
  chunkSize: number,
  rules?: RecursiveRules,
): Promise<RecursiveChunker> {
  // Create a cache key based on configuration
  const cacheKey = chunkSize;

  if (!chunkerCache.has(cacheKey)) {
    const options: RecursiveChunkerOptions = {
      chunkSize,
      minCharactersPerChunk: 24, // Avoid tiny fragments
      tokenizer: "character", // Built-in, no dependencies
    };

    if (rules) {
      options.rules = rules;
    }

    const chunker = await RecursiveChunker.create(options);
    chunkerCache.set(cacheKey, chunker);
  }

  return chunkerCache.get(cacheKey)!;
}

/**
 * Document type for specialized chunking rules
 */
export type DocumentType = "default" | "markdown" | "code";

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
 * @param documentType - Type of document for specialized rules
 * @returns Array of text chunks with metadata
 */
export async function chunkText(
  text: string,
  config: Partial<ChunkConfig> = {},
  documentType: DocumentType = "default",
): Promise<string[]> {
  const fullConfig = { ...DEFAULT_CHUNK_CONFIG, ...config };
  const { chunkSize, chunkOverlap } = fullConfig;

  const normalizedText = text.trim().replace(/\r\n/g, "\n");
  if (!normalizedText) {
    return [];
  }

  try {
    // Select appropriate rules based on document type
    const rules = CHUNKING_RULES[documentType];

    // Get Chonkie chunker instance with custom rules
    const chunker = await getChunker(chunkSize, rules);

    // Chunk the text using Chonkie's intelligent hierarchical splitting
    const chunks: Chunk[] = await chunker.chunk(normalizedText);

    // Apply overlap if requested
    // Chonkie preserves semantic boundaries, so overlap helps maintain context
    if (chunkOverlap > 0 && chunks.length > 1) {
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
 * Advanced chunking with full metadata
 * Returns Chunk objects with startIndex, endIndex, and tokenCount
 *
 * @param text - Text to chunk
 * @param config - Chunking configuration
 * @param documentType - Type of document for specialized rules
 * @returns Array of Chunk objects with metadata
 */
export async function chunkTextWithMetadata(
  text: string,
  config: Partial<ChunkConfig> = {},
  documentType: DocumentType = "default",
): Promise<Chunk[]> {
  const fullConfig = { ...DEFAULT_CHUNK_CONFIG, ...config };
  const { chunkSize } = fullConfig;

  const normalizedText = text.trim().replace(/\r\n/g, "\n");
  if (!normalizedText) {
    return [];
  }

  try {
    const rules = CHUNKING_RULES[documentType];
    const chunker = await getChunker(chunkSize, rules);
    return await chunker.chunk(normalizedText);
  } catch (error) {
    console.error("Chonkie chunking error:", error);
    // Fallback: return whole text as single chunk
    return [
      new Chunk({
        text: normalizedText,
        startIndex: 0,
        endIndex: normalizedText.length,
        tokenCount: Math.ceil(normalizedText.length / 4), // Rough estimate
      }),
    ];
  }
}

/**
 * Apply overlap to chunks using Chonkie's metadata
 * Creates sliding window effect while preserving semantic boundaries
 *
 * @param chunks - Array of Chunk objects from Chonkie
 * @param overlapTokens - Target number of tokens to overlap
 * @returns Array of text chunks with overlap applied
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
      // Get overlap from previous chunk using Chonkie's token count
      const prevChunk = chunks[i - 1];
      const overlapText = getTrailingText(
        prevChunk.text,
        prevChunk.tokenCount,
        overlapTokens,
      );

      // Prepend overlap to current chunk with separator
      if (overlapText && overlapText.length > 0) {
        // Preserve semantic context with smart joining
        const separator = shouldAddSeparator(overlapText, chunk.text)
          ? "\n\n"
          : " ";
        result.push(`${overlapText}${separator}${chunk.text}`);
      } else {
        result.push(chunk.text);
      }
    }
  }

  return result;
}

/**
 * Determine if a separator is needed between overlap and chunk
 */
function shouldAddSeparator(overlapText: string, chunkText: string): boolean {
  // Add separator if overlap ends with sentence boundary
  if (/[.!?]\s*$/.test(overlapText.trim())) {
    return true;
  }
  // Add separator if chunk starts with capital letter or number
  if (/^[A-Z0-9]/.test(chunkText.trim())) {
    return true;
  }
  return false;
}

/**
 * Get trailing text from a chunk for overlap
 * Uses actual token count from Chonkie for accurate overlap
 *
 * @param text - The chunk text
 * @param actualTokens - Actual token count from Chonkie
 * @param targetTokens - Desired overlap in tokens
 * @returns Trailing portion of text
 */
function getTrailingText(
  text: string,
  actualTokens: number,
  targetTokens: number,
): string {
  if (actualTokens <= targetTokens) {
    return text;
  }

  // Calculate approximate character position based on token ratio
  const tokenRatio = targetTokens / actualTokens;
  const approxCharPos = Math.floor(text.length * (1 - tokenRatio));

  // Try to find a good semantic boundary (sentence, paragraph, or word)
  const trailing = text.slice(approxCharPos);

  // First, try to break at sentence boundary
  const sentenceMatch = trailing.match(/([.!?])\s+/);
  if (sentenceMatch && sentenceMatch.index !== undefined) {
    return trailing.slice(sentenceMatch.index + sentenceMatch[0].length);
  }

  // Second, try to break at paragraph boundary
  const paragraphMatch = trailing.match(/\n\n+/);
  if (paragraphMatch && paragraphMatch.index !== undefined) {
    return trailing.slice(paragraphMatch.index + paragraphMatch[0].length);
  }

  // Third, try to break at word boundary
  const wordMatch = trailing.match(/\s+/);
  if (wordMatch && wordMatch.index !== undefined) {
    return trailing.slice(wordMatch.index + wordMatch[0].length);
  }

  // Fallback: return from character position
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
 * Preserves markdown structure for better chunking
 *
 * @param content - File content buffer
 * @returns Parsed markdown text
 */
export async function parseMarkdownFile(content: Buffer): Promise<string> {
  const text = content.toString("utf-8");
  // Clean text but preserve markdown structure (headers, code blocks, lists)
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n") // Keep max 3 newlines for markdown spacing
    .trim();
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
