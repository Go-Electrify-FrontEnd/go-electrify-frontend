import { v4 as uuidv4 } from "uuid";
import type { DocumentMetadata, RetrievedChunk } from "../types";
import { getIndex } from "./pinecone-client";

const DEFAULT_NAMESPACES = [
  "faq",
  "guide",
  "policy",
  "troubleshooting",
  "other",
  "default",
] as const;

const DEFAULT_SEARCH_FIELDS = [
  "text",
  "source",
  "documentId",
  "documentName",
  "documentType",
  "chunkIndex",
  "uploadDate",
  "description",
] as const;

const toRecordPayload = (record: unknown): Record<string, any> => {
  if (!record || typeof record !== "object") {
    return {};
  }

  const { fields, metadata } = record as {
    fields?: Record<string, any>;
    metadata?: Record<string, any>;
  };

  return fields ?? metadata ?? {};
};

const buildNamespaceList = (override?: string): string[] =>
  override ? [override] : [...DEFAULT_NAMESPACES];

async function exponentialBackoffRetry<T>(
  func: () => Promise<T>,
  maxRetries = 5,
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await func();
    } catch (error: any) {
      const statusCode = error.status || error.statusCode;

      if (statusCode && (statusCode >= 500 || statusCode === 429)) {
        if (attempt < maxRetries - 1) {
          const delay = Math.min(2 ** attempt * 1000, 60000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          console.log(
            `Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`,
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

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
    const namespace = documentType.toLowerCase() || "default";

    const records = chunks.map((chunk, chunkIndex) => ({
      _id: uuidv4(),
      text: chunk.content,
      documentId,
      documentName,
      documentType,
      chunkIndex,
      uploadDate,
      description: metadata.description || "",
      source: metadata.source,
    }));

    const batchSize = 96;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      await exponentialBackoffRetry(async () => {
        await index.namespace(namespace).upsertRecords(batch);
      });

      if (i + batchSize < records.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(
      `✓ Successfully indexed ${chunks.length} chunks for document ${documentId}`,
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

export async function deleteDocumentById(
  documentId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const index = getIndex();

    const namespaces = buildNamespaceList();

    for (const namespace of namespaces) {
      try {
        await exponentialBackoffRetry(async () => {
          await index.namespace(namespace).deleteMany({
            documentId: documentId,
          });
        });
      } catch (nsError) {
        console.log(`Skipping namespace ${namespace}:`, nsError);
      }
    }

    console.log(`✓ Successfully deleted document ${documentId}`);

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

export async function listAllDocuments(): Promise<DocumentMetadata[]> {
  try {
    const index = getIndex();

    const stats = await index.describeIndexStats();
    const namespaces = Object.keys(stats.namespaces || {});

    if (namespaces.length === 0) {
      console.log("No namespaces found in index");
      return [];
    }

    const documentsById = new Map<string, DocumentMetadata>();

    for (const namespace of namespaces) {
      try {
        let paginationToken: string | undefined = undefined;

        do {
          const page = await index.namespace(namespace).listPaginated({
            limit: 100,
            paginationToken,
          });

          if (page.vectors && page.vectors.length > 0) {
            const ids = page.vectors.map((vector: any) => vector.id);
            const recordsResponse = await index.namespace(namespace).fetch(ids);

            for (const record of Object.values(recordsResponse.records || {})) {
              const data = toRecordPayload(record);
              const docId = String(data?.documentId ?? "");

              if (!docId) continue;

              if (!documentsById.has(docId)) {
                documentsById.set(docId, {
                  id: docId,
                  name: String(data?.documentName ?? "Unknown"),
                  type: String(data?.documentType ?? "Other") as any,
                  description: String(data?.description ?? ""),
                  chunkCount: 1,
                  uploadDate: new Date(
                    Number(data?.uploadDate ?? Date.now()),
                  ).toISOString(),
                  status: "indexed",
                  source: String(data?.source ?? "Unknown"),
                });
              } else {
                const summary = documentsById.get(docId)!;
                summary.chunkCount++;
              }
            }
          }

          paginationToken = page.pagination?.next;
        } while (paginationToken);
      } catch (nsError) {
        console.log(`Error processing namespace ${namespace}:`, nsError);
      }
    }

    const documents = Array.from(documentsById.values()).sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );

    console.log(
      `✓ Found ${documents.length} documents across ${namespaces.length} namespaces`,
    );

    return documents;
  } catch (error) {
    console.error("Error listing documents:", error);
    return [];
  }
}

type SearchChunkOptions = {
  vector?: number[];
  recordId?: string;
  namespaceOverride?: string;
  rerankTopN?: number;
  fields?: string[];
};

export async function searchSimilarChunks(
  query: string,
  topK: number = 3,
  scoreThreshold: number = 0.7,
  options: SearchChunkOptions = {},
): Promise<RetrievedChunk[]> {
  try {
    const index = getIndex();
    const sanitizedQuery = query.trim();
    const namespaces = buildNamespaceList(options.namespaceOverride);
    const collectedChunks: RetrievedChunk[] = [];

    // Search across all namespaces
    for (const namespace of namespaces) {
      try {
        const searchResults = await exponentialBackoffRetry(async () => {
          // Build search query based on available inputs
          const searchQuery: any = { topK: topK * 2 };

          if (sanitizedQuery) {
            searchQuery.inputs = { text: sanitizedQuery };
          }
          if (options.vector?.length) {
            searchQuery.vector = { values: options.vector };
          }
          if (options.recordId) {
            searchQuery.id = options.recordId;
          }

          // Build rerank configuration
          const rerankConfig: any = {
            model: "bge-reranker-v2-m3",
            rankFields: ["text"],
            topN: options.rerankTopN ?? topK,
          };

          if (sanitizedQuery) {
            rerankConfig.query = sanitizedQuery;
          }

          // Execute search with reranking
          return await index.namespace(namespace).searchRecords({
            query: searchQuery,
            fields: options.fields ?? [...DEFAULT_SEARCH_FIELDS],
            rerank: rerankConfig,
          });
        });

        // Process and filter results
        const hits = searchResults.result?.hits || [];
        const formattedResults = hits
          .filter((hit: any) => hit._score >= scoreThreshold)
          .map((hit: any) => {
            const data = toRecordPayload(hit);
            return {
              content: String(data?.text ?? data?.content ?? ""),
              source: String(data?.source ?? ""),
              score: Number(hit._score ?? 0),
              metadata: {
                documentName: String(data?.documentName ?? ""),
                documentType: String(data?.documentType ?? "Other") as any,
                chunkIndex: Number(data?.chunkIndex ?? 0),
              },
            };
          });

        collectedChunks.push(...formattedResults);
      } catch (nsError) {
        console.log(`Namespace ${namespace} not found or error:`, nsError);
      }
    }

    // Sort by score and return top results
    const results = collectedChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    console.log(
      `✓ Found ${results.length} chunks matching query (threshold: ${scoreThreshold})`,
    );

    return results;
  } catch (error) {
    console.error("Error searching chunks:", error);
    return [];
  }
}

export async function getDocumentStats(
  documentId: string,
): Promise<{ chunks: number; vectors: number }> {
  try {
    const index = getIndex();

    const namespaces = buildNamespaceList();
    let totalCount = 0;

    for (const namespace of namespaces) {
      try {
        let paginationToken: string | undefined;

        do {
          const page = await index.namespace(namespace).listPaginated({
            limit: 100,
            paginationToken,
          });

          if (page.vectors && page.vectors.length > 0) {
            const ids = page.vectors.map((vector: any) => vector.id);
            const recordsResponse = await index.namespace(namespace).fetch(ids);

            for (const record of Object.values(recordsResponse.records || {})) {
              const data = toRecordPayload(record);

              if (data?.documentId === documentId) {
                totalCount++;
              }
            }
          }

          paginationToken = page.pagination?.next;
        } while (paginationToken);
      } catch (nsError) {
        console.log(`Namespace ${namespace} not found:`, nsError);
      }
    }

    console.log(`✓ Document ${documentId} has ${totalCount} chunks`);

    return {
      chunks: totalCount,
      vectors: totalCount,
    };
  } catch (error) {
    console.error("Error getting document stats:", error);
    return { chunks: 0, vectors: 0 };
  }
}

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

    const namespaces = buildNamespaceList();
    let updatedCount = 0;

    for (const namespace of namespaces) {
      try {
        let paginationToken: string | undefined;

        do {
          const page = await index.namespace(namespace).listPaginated({
            limit: 100,
            paginationToken,
          });

          if (page.vectors && page.vectors.length > 0) {
            const ids = page.vectors.map((vector: any) => vector.id);
            const recordsResponse = await index.namespace(namespace).fetch(ids);

            // Find vectors matching documentId and update them
            const recordsToUpdate: Array<any> = [];

            for (const [recordId, record] of Object.entries(
              recordsResponse.records || {},
            )) {
              const data = toRecordPayload(record);

              if (data?.documentId === documentId) {
                // Update using upsertRecords with same structure as original insert
                recordsToUpdate.push({
                  _id: recordId,
                  text: data.text || data.content || "", // Try both field names
                  documentId: data.documentId,
                  documentName: updates.documentName || data.documentName,
                  documentType: updates.documentType || data.documentType,
                  chunkIndex: data.chunkIndex || 0,
                  uploadDate: data.uploadDate || Date.now(),
                  description: updates.description || data.description || "",
                  source: data.source || "",
                });
              }
            }

            // Update records using upsertRecords (not upsert)
            if (recordsToUpdate.length > 0) {
              await exponentialBackoffRetry(async () => {
                await index.namespace(namespace).upsertRecords(recordsToUpdate);
              });
              updatedCount += recordsToUpdate.length;
            }
          }

          paginationToken = page.pagination?.next;
        } while (paginationToken);
      } catch (nsError) {
        console.log(`Namespace ${namespace} not found:`, nsError);
      }
    }

    console.log(`✓ Updated ${updatedCount} vectors for document ${documentId}`);

    return {
      success: true,
      message: `Document metadata updated successfully (${updatedCount} chunks)`,
    };
  } catch (error) {
    console.error("Error updating document metadata:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update",
    };
  }
}
