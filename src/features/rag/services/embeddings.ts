import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Embedding model configuration
 * Using 1024 dimensions to match Pinecone index configuration
 */
const EMBEDDING_MODEL = openai.embedding("text-embedding-3-small");
const DIMENSIONS = 1024;

/**
 * Generate embedding for a single text string
 * Used for query embedding in vector search
 *
 * @param text - Text to embed
 * @returns Vector embedding (1024 dimensions for text-embedding-3-small with reduced dimensions)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const input = text.replaceAll("\n", " ").trim();

    if (!input) {
      throw new Error("Cannot generate embedding for empty text");
    }

    const { embedding } = await embed({
      model: EMBEDDING_MODEL,
      value: input,
    });

    // Truncate to 1024 dimensions to match Pinecone index
    return embedding.slice(0, DIMENSIONS);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Generate embeddings for multiple text chunks
 * Used for document indexing
 *
 * @param chunks - Array of text chunks to embed
 * @returns Array of embeddings with corresponding content
 */
export async function generateEmbeddings(
  chunks: string[],
): Promise<Array<{ embedding: number[]; content: string }>> {
  try {
    if (chunks.length === 0) {
      return [];
    }

    // Filter out empty chunks
    const validChunks = chunks
      .map((chunk) => chunk.replaceAll("\n", " ").trim())
      .filter((chunk) => chunk.length > 0);

    if (validChunks.length === 0) {
      return [];
    }

    const { embeddings } = await embedMany({
      model: EMBEDDING_MODEL,
      values: validChunks,
    });

    // Truncate each embedding to 1024 dimensions to match Pinecone index
    return embeddings.map((embedding, index) => ({
      content: validChunks[index],
      embedding: embedding.slice(0, DIMENSIONS),
    }));
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(
      `Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Get embedding model info
 * Useful for configuration and debugging
 */
export function getEmbeddingModelInfo() {
  return {
    model: "text-embedding-3-small",
    dimensions: DIMENSIONS, // Reduced to 1024 to match Pinecone index
    maxTokens: 8191,
  };
}
