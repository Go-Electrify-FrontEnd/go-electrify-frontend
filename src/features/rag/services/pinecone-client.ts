import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_INDEX_NAME =
  process.env.PINECONE_INDEX_NAME || "go-electrify-docs";

export function getPineconeClient(): Pinecone {
  const apiKey = process.env.PINECONE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "PINECONE_API_KEY environment variable not set. Please configure your Pinecone API key.",
    );
  }

  return new Pinecone({ apiKey });
}

export function getIndexName(): string {
  return PINECONE_INDEX_NAME;
}

export function getIndex() {
  const client = getPineconeClient();
  const indexName = getIndexName();
  return client.index(indexName);
}
