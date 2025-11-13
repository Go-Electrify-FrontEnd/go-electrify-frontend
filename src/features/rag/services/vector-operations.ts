import type { DocumentMetadata } from "../types";
import { getIndex } from "./pinecone-client";
import { generateEmbedding, generateEmbeddings } from "./embeddings";

const DEFAULT_NAMESPACE = "go-electrify";

/**
 * Upsert document chunks to Pinecone Vector Database
 *
 * @param documentId - Unique document identifier
 * @param documentName - Display name of document
 * @param documentType - Category of document
 * @param chunks - Array of text chunks
 * @param metadata - Additional metadata (source, description, targetActors)
 * @returns Success result with message
 */
export async function upsertDocumentChunks(
  documentId: string,
  documentName: string,
  documentType: string,
  chunks: Array<{ content: string }>,
  metadata: { source: string; description?: string; targetActors: string[] },
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

    // Convert to Pinecone upsert format (flat metadata structure)
    const records = chunkEmbeddings.map((chunk, i) => ({
      id: `${documentId}-${i}`,
      values: chunk.embedding,
      metadata: {
        content: chunk.content,
        documentId,
        documentName,
        documentType,
        chunkIndex: i,
        uploadDate,
        description: metadata.description || "",
        source: metadata.source,
        targetActors: metadata.targetActors.join(","),
      },
    }));

    // Upsert all vectors in a single request
    console.log(`Upserting ${records.length} vectors to Pinecone...`);
    const startUpsert = Date.now();
    await index.namespace(DEFAULT_NAMESPACE).upsert(records);
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

    // Delete all in batches (Pinecone supports deleteMany)
    const startDelete = Date.now();
    await index.namespace(DEFAULT_NAMESPACE).deleteMany(vectorIds);
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

    // Use listPaginated to get all vector IDs
    const allVectors: Array<{ id: string }> = [];
    let paginationToken: string | undefined = undefined;

    console.log("Fetching all document IDs from Pinecone...");

    do {
      const result = await index.namespace(DEFAULT_NAMESPACE).listPaginated({
        limit: 100,
        paginationToken,
      });

      if (result.vectors && result.vectors.length > 0) {
        // Filter out vectors without IDs
        const validVectors = result.vectors
          .filter((v) => v.id !== undefined)
          .map((v) => ({ id: v.id! }));
        allVectors.push(...validVectors);
      }

      paginationToken = result.pagination?.next;
    } while (paginationToken);

    if (!allVectors.length) {
      console.log("No vectors found in index");
      return [];
    }

    console.log(
      `Found ${allVectors.length} total vectors, fetching metadata...`,
    );

    // Fetch metadata for all vectors in batches
    const vectorIds = allVectors.map((v) => v.id);
    const metadataBatchSize = 1000;
    const documentsMap = new Map<string, DocumentMetadata>();

    for (let i = 0; i < vectorIds.length; i += metadataBatchSize) {
      const batch = vectorIds.slice(i, i + metadataBatchSize);
      const fetchResult = await index.namespace(DEFAULT_NAMESPACE).fetch(batch);

      if (fetchResult.records) {
        for (const [_id, record] of Object.entries(fetchResult.records)) {
          const metadata = record.metadata as Record<string, any>;
          if (!metadata?.documentId) continue;

          const docId = String(metadata.documentId);
          const existing = documentsMap.get(docId);

          if (existing) {
            existing.chunkCount++;
          } else {
            documentsMap.set(docId, {
              id: docId,
              name: String(metadata.documentName || "Unknown"),
              type: (metadata.documentType as any) || "Other",
              description: String(metadata.description || ""),
              chunkCount: 1,
              uploadDate: new Date(
                metadata.uploadDate || Date.now(),
              ).toISOString(),
              status: "indexed",
              source: String(metadata.source || "Unknown"),
              targetActors: String(
                metadata.targetActors || "admin,staff,driver",
              ),
            });
          }
        }
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
 * @param k - Number of results to return (default: 1)
 * @returns Pinecone query results with metadata
 */
export async function findRelevantContent(query: string, k = 1) {
  const index = getIndex();
  const userEmbedding = await generateEmbedding(query);

  try {
    const result = await index.namespace(DEFAULT_NAMESPACE).query({
      vector: userEmbedding,
      topK: k,
      includeMetadata: true,
    });

    return result.matches || [];
  } catch (error) {
    console.error("Error during semantic search:", error);
    return [];
  }
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
    const results = await index.namespace(DEFAULT_NAMESPACE).fetch(sampleIds);

    // Count existing records
    const count = Object.keys(results.records || {}).length;

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
    targetActors: string[];
  }>,
): Promise<{ success: boolean; message: string }> {
  try {
    const namespace = getIndex().namespace(DEFAULT_NAMESPACE);

    // Fetch all chunks for this document
    const vectorIds = Array.from(
      { length: 1000 },
      (_, i) => `${documentId}-${i}`,
    );
    const allRecords: Record<string, any> = {};

    for (let i = 0; i < vectorIds.length; i += 100) {
      const batch = await namespace.fetch(vectorIds.slice(i, i + 100));
      if (batch.records) Object.assign(allRecords, batch.records);
    }

    if (Object.keys(allRecords).length === 0) {
      return { success: false, message: "No vectors found" };
    }

    // Build new metadata
    const newMetadata = {
      ...(updates.documentName && { documentName: updates.documentName }),
      ...(updates.documentType && { documentType: updates.documentType }),
      ...(updates.description && { description: updates.description }),
      ...(updates.targetActors && {
        targetActors: updates.targetActors.join(","),
      }),
    };

    // Update each chunk
    for (const [id, record] of Object.entries(allRecords)) {
      if (!record?.metadata) continue;
      await namespace.update({
        id,
        metadata: { ...record.metadata, ...newMetadata },
      });
    }

    return {
      success: true,
      message: `Updated ${Object.keys(allRecords).length} chunks`,
    };
  } catch (error) {
    console.error("Error updating document metadata:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update",
    };
  }
}
