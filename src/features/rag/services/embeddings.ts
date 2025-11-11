import { embed, embedMany } from "ai";

/**
 * Generate a single embedding for a given text
 *
 * @param value - Text to embed
 * @returns Embedding vector
 */
export async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll("\n", " ");

  const { embedding } = await embed({
    model: "openai/text-embedding-3-small",
    value: input,
  });

  return embedding;
}

/**
 * Generate embeddings for multiple text chunks
 *
 * @param chunks - Array of text chunks to embed
 * @returns Array of embeddings with corresponding content
 */
export async function generateEmbeddings(
  chunks: string[],
): Promise<Array<{ content: string; embedding: number[] }>> {
  const { embeddings } = await embedMany({
    model: "openai/text-embedding-3-small",
    values: chunks,
  });

  return embeddings.map((embedding, i) => ({
    content: chunks[i],
    embedding,
  }));
}
