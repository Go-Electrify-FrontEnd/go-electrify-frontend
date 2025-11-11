import { Index } from "@upstash/vector";

const UPSTASH_VECTOR_REST_URL = process.env.UPSTASH_VECTOR_REST_URL;
const UPSTASH_VECTOR_REST_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN;

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

export function getUpstashClient(): Index<VectorMetadata> {
  const url = UPSTASH_VECTOR_REST_URL?.trim();
  const token = UPSTASH_VECTOR_REST_TOKEN?.trim();

  if (!url || !token) {
    throw new Error(
      "UPSTASH_VECTOR_URL and UPSTASH_VECTOR_TOKEN environment variables must be set. " +
        "Get your credentials from: https://console.upstash.com/vector",
    );
  }

  return new Index<VectorMetadata>({
    url,
    token,
  });
}

export function getIndex() {
  return getUpstashClient();
}
