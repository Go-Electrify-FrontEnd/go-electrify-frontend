import type { DocumentMetadata } from "../types";
import { getIndex } from "./upstash-client";
import { generateEmbedding, generateEmbeddings } from "./embeddings";

/**
 * Upsert document chunks to Upstash Vector
 *
 * @param documentId - Unique document identifier
 * @param documentName - Display name of document
 * @param documentType - Category of document
 * @param chunks - Array of text chunks
 * @param metadata - Additional metadata (source, description)
 * @returns Success result with message
 */
export async function upsertDocumentChunks(
  documentId: string,
  documentName: string,
  documentType: string,
  chunks: Array<{ content: string }>,
  metadata: { source: string; description?: string },
): Promise<{ success: boolean; message: string }> {
  try {
    const index = getIndex();
    const uploadDate = Date.now();

    console.log(`Starting upload for document: ${documentName}`);
    console.log(`   Document ID: ${documentId}`);
    console.log(`   Total chunks: ${chunks.length}`);

    // Extract text content from chunks
    const chunkTexts = chunks.map((chunk) => chunk.content);

    // Generate embeddings for all chunks in one batch
    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    const startEmbed = Date.now();
    const chunkEmbeddings = await generateEmbeddings(chunkTexts);
    console.log(`Embeddings generated in ${Date.now() - startEmbed}ms`);

    // Convert to Upstash upsert format
    const toUpsert = chunkEmbeddings.map((chunk, i) => ({
      id: `${documentId}-${i}`,
      vector: chunk.embedding,
      metadata: {
        content: chunk.content,
        documentId,
        documentName,
        documentType,
        chunkIndex: i,
        uploadDate,
        description: metadata.description || "",
        source: metadata.source,
      },
    }));

    // Upsert all vectors in a single batch (Upstash supports up to 1000 vectors per request)
    console.log(
      `Upserting ${toUpsert.length} vectors to Upstash in 1 request...`,
    );
    const startUpsert = Date.now();
    await index.upsert(toUpsert);
    console.log(`Upsert completed in ${Date.now() - startUpsert}ms`);

    console.log(
      `Successfully indexed ${chunks.length} chunks for document ${documentId}`,
    );

    return {
      success: true,
      message: `Successfully indexed ${chunks.length} chunks`,
    };
  } catch (error) {
    console.error("Error upserting document chunks:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upsert chunks",
    };
  }
}

/**
 * Delete all chunks belonging to a document
 *
 * @param documentId - Document to delete
 * @returns Success result with message
 */
export async function deleteDocumentById(
  documentId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const index = getIndex();

    console.log(`Deleting document: ${documentId}`);

    // Generate potential IDs (up to 1000 chunks per document)
    const vectorIds: string[] = [];
    for (let i = 0; i < 1000; i++) {
      vectorIds.push(`${documentId}-${i}`);
    }

    // Delete all in a single request (Upstash supports up to 1000 IDs)
    const startDelete = Date.now();
    await index.delete(vectorIds);
    console.log(`Delete completed in ${Date.now() - startDelete}ms`);

    console.log(`Deleted chunks for document ${documentId}`);

    return {
      success: true,
      message: "Document deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete",
    };
  }
}

/**
 * List all documents by fetching vectors and aggregating by metadata
 *
 * @returns Array of document metadata
 */
export async function listAllDocuments(): Promise<DocumentMetadata[]> {
  try {
    const index = getIndex();

    const result = await index.range({
      cursor: "",
      limit: 1000,
      includeMetadata: true,
    });

    if (!result.vectors?.length) {
      return [];
    }

    const documentsMap = new Map<string, DocumentMetadata>();

    for (const vector of result.vectors) {
      const metadata = vector.metadata;
      if (!metadata?.documentId) continue;

      const docId = metadata.documentId;
      const existing = documentsMap.get(docId);

      if (existing) {
        existing.chunkCount++;
      } else {
        documentsMap.set(docId, {
          id: docId,
          name: metadata.documentName || "Unknown",
          type: (metadata.documentType as any) || "Other",
          description: metadata.description || "",
          chunkCount: 1,
          uploadDate: new Date(metadata.uploadDate || Date.now()).toISOString(),
          status: "indexed",
          source: metadata.source || "Unknown",
        });
      }
    }

    const documents = Array.from(documentsMap.values()).sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );

    console.log(`Found ${documents.length} unique documents`);

    return documents;
  } catch (error) {
    console.error("Error listing documents:", error);
    return [];
  }
}

/**
 * Find relevant content using semantic similarity search
 *
 * @param query - Search query text
 * @param k - Number of results to return (default: 4)
 * @returns Raw Upstash query results with metadata
 */
export async function findRelevantContent(query: string, k = 6) {
  const index = getIndex();
  const userEmbedding = await generateEmbedding(query);

  const result = await index.query({
    vector: userEmbedding,
    topK: k,
    includeMetadata: true,
  });

  return result;
}

/**
 * Get statistics for a specific document
 *
 * @param documentId - Document to get stats for
 * @returns Chunk and vector counts
 */
export async function getDocumentStats(
  documentId: string,
): Promise<{ chunks: number; vectors: number }> {
  try {
    const index = getIndex();

    console.log(`Getting stats for document: ${documentId}`);

    // Generate IDs to fetch (up to 1000 chunks)
    const sampleIds: string[] = [];
    for (let i = 0; i < 1000; i++) {
      sampleIds.push(`${documentId}-${i}`);
    }

    // Fetch all in one request
    const results = await index.fetch(sampleIds);

    // Count non-null results
    const count = results.filter((result) => result !== null).length;

    console.log(`Document ${documentId} has ${count} chunks`);

    return {
      chunks: count,
      vectors: count,
    };
  } catch (error) {
    console.error("Error getting document stats:", error);
    return { chunks: 0, vectors: 0 };
  }
}

/**
 * Update metadata for a document's chunks
 *
 * @param documentId - Document to update
 * @param updates - Metadata fields to update
 * @returns Success result with message
 */
export async function updateDocumentMetadata(
  documentId: string,
  updates: Partial<{
    documentName: string;
    documentType: string;
    description: string;
  }>,
): Promise<{ success: boolean; message: string }> {
  try {
    const index = getIndex();

    console.log(`Updating metadata for document: ${documentId}`);

    // Generate IDs to fetch (up to 1000 chunks)
    const vectorIds: string[] = [];
    for (let i = 0; i < 1000; i++) {
      vectorIds.push(`${documentId}-${i}`);
    }

    // Fetch all vectors in one request
    const startFetch = Date.now();
    const vectors = await index.fetch(vectorIds, {
      includeMetadata: true,
      includeVectors: true,
    });
    console.log(`Fetched vectors in ${Date.now() - startFetch}ms`);

    // Prepare updated vectors
    const vectorsToUpdate: Array<{
      id: string;
      vector: number[];
      metadata: any;
    }> = [];

    for (const vector of vectors) {
      if (vector && vector.metadata) {
        const updatedMetadata = {
          ...vector.metadata,
          ...(updates.documentName && { documentName: updates.documentName }),
          ...(updates.documentType && { documentType: updates.documentType }),
          ...(updates.description && { description: updates.description }),
        };

        vectorsToUpdate.push({
          id: vector.id,
          vector: vector.vector || [],
          metadata: updatedMetadata,
        });
      }
    }

    if (vectorsToUpdate.length === 0) {
      return {
        success: false,
        message: "No vectors found for this document",
      };
    }

    // Re-upsert all vectors in one request
    const startUpsert = Date.now();
    await index.upsert(vectorsToUpdate);
    console.log(`Upsert completed in ${Date.now() - startUpsert}ms`);

    console.log(
      `Updated metadata for ${vectorsToUpdate.length} chunks of document ${documentId}`,
    );

    return {
      success: true,
      message: `Updated ${vectorsToUpdate.length} chunks`,
    };
  } catch (error) {
    console.error("Error updating document metadata:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update",
    };
  }
}
