import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "go-electrify-docs";

type VectorMetadata = {
  content: string;
  documentId: string;
  documentName: string;
  documentType: string;
  chunkIndex: number;
  uploadDate: number;
  description?: string;
  source: string;
  targetActors?: string;
};

let pineconeInstance: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  const apiKey = PINECONE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "PINECONE_API_KEY environment variable must be set. " +
        "Get your API key from: https://app.pinecone.io/",
    );
  }

  if (!pineconeInstance) {
    pineconeInstance = new Pinecone({ apiKey });
  }

  return pineconeInstance;
}

export function getIndex() {
  const pc = getPineconeClient();
  const indexName = PINECONE_INDEX_NAME?.trim();

  if (!indexName) {
    throw new Error(
      "PINECONE_INDEX_NAME environment variable must be set.",
    );
  }

  return pc.index(indexName);
}

export type { VectorMetadata };
