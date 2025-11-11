/**
 * RAG (Retrieval-Augmented Generation) Type Definitions
 */

/**
 * Document chunk stored in Pinecone vector database
 */
export interface DocumentChunk {
  id: string; // Unique chunk ID (UUID)
  documentId: string; // Parent document ID
  documentName: string; // Display name
  documentType: DocumentType; // Category
  chunkIndex: number; // Chunk number (0, 1, 2...)
  chunkText: string; // Actual text content
  uploadDate: number; // Unix timestamp
  description?: string; // Optional metadata
  source: string; // Original filename
}

/**
 * Vector payload structure in Pinecone
 * Note: Pinecone requires flat metadata (no nested objects)
 */
export interface VectorPayload extends Record<string, unknown> {
  content: string; // Text content for embedding
  documentId: string;
  documentName: string;
  documentType: DocumentType;
  chunkIndex: number;
  uploadDate: number;
  description?: string;
  source: string;
  targetActors: string; // Comma-separated list of actors (admin, staff, driver)
}

/**
 * Document metadata (aggregated from chunks)
 */
export interface DocumentMetadata {
  id: string; // Document ID
  name: string; // Display name
  type: DocumentType; // Category
  description?: string; // Optional metadata
  chunkCount: number; // Number of chunks/vectors
  uploadDate: string; // ISO date string
  status: DocumentStatus; // Processing status
  source: string; // Original filename
  targetActors: string; // Comma-separated list of actors (admin, staff, driver)
}

/**
 * Document types for categorization
 */
export type DocumentType =
  | "FAQ"
  | "Guide"
  | "Policy"
  | "Troubleshooting"
  | "Other";

/**
 * Document processing status
 */
export type DocumentStatus = "processing" | "indexed" | "failed";

/**
 * Target actors who can access the document
 */
export type TargetActor = "admin" | "staff" | "driver";

/**
 * Array of target actors
 */
export type TargetActors = TargetActor[];

/**
 * Retrieved chunk from vector search
 */
export interface RetrievedChunk {
  content: string; // Chunk text
  source: string; // Document source
  score: number; // Similarity score (0-1)
  metadata?: {
    documentName: string;
    documentType: DocumentType;
    chunkIndex: number;
  };
}

/**
 * Chunking configuration
 *
 * Uses LLM-based chunking with Grok-4-fast-reasoning for superior text chunking:
 * - Intelligent semantic boundary detection
 * - Context-aware splitting based on document type
 * - Adaptive chunk sizing while maintaining coherence
 * - Better preservation of meaning and structure
 */
export interface ChunkConfig {
  chunkSize: number; // Max tokens per chunk (512 recommended for optimal embedding quality)
  chunkOverlap: number; // Overlap tokens (100 recommended for context continuity)
  separator?: string; // Text separator (default: "\n\n", used for fallback chunking)
}

/**
 * Embedding configuration
 */
export interface EmbeddingConfig {
  model: string; // OpenAI model (e.g., "text-embedding-3-small")
  dimensions: number; // Vector dimensions (1536 for text-embedding-3-small)
}
