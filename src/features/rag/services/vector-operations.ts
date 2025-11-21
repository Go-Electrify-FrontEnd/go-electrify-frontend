import type { DocumentMetadata } from "../types";
import { getIndex } from "./pinecone-client";
import { generateEmbedding, generateEmbeddings } from "./embeddings";
import { z } from "zod";

const DEFAULT_NAMESPACE = "go-electrify";

const PineconeMetadataSchema = z.object({
  documentId: z.union([z.string(), z.number()]).transform(String),
  documentName: z.string().default("Unknown"),
  documentType: z
    .enum(["FAQ", "Guide", "Policy", "Troubleshooting", "Other"])
    .default("Other"),
  description: z.string().default(""),
  uploadDate: z
    .union([z.string(), z.number()])
    .transform((val) =>
      typeof val === "number" ? val : Date.parse(val) || Date.now(),
    ),
  source: z.string().default("Unknown"),
  targetActors: z.string().default("admin,staff,driver"),
});

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

    const chunkTexts = chunks.map((chunk) => chunk.content);

    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    const startEmbed = Date.now();
    const chunkEmbeddings = await generateEmbeddings(chunkTexts);
    console.log(`Embeddings generated in ${Date.now() - startEmbed}ms`);

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

export async function deleteDocumentById(
  documentId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const index = getIndex();

    console.log(`Deleting document: ${documentId}`);

    const vectorIds: string[] = [];
    for (let i = 0; i < 1000; i++) {
      vectorIds.push(`${documentId}-${i}`);
    }

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

export async function listAllDocuments(): Promise<DocumentMetadata[]> {
  try {
    const index = getIndex();

    const allVectors: Array<{ id: string }> = [];
    let paginationToken: string | undefined = undefined;

    console.log("Fetching all document IDs from Pinecone...");

    do {
      const result = await index.namespace(DEFAULT_NAMESPACE).listPaginated({
        limit: 100,
        paginationToken,
      });

      if (result.vectors && result.vectors.length > 0) {
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

    const vectorIds = allVectors.map((v) => v.id);
    const metadataBatchSize = 1000;
    const documentsMap = new Map<string, DocumentMetadata>();

    for (let i = 0; i < vectorIds.length; i += metadataBatchSize) {
      const batch = vectorIds.slice(i, i + metadataBatchSize);
      const fetchResult = await index.namespace(DEFAULT_NAMESPACE).fetch(batch);

      if (fetchResult.records) {
        for (const [, record] of Object.entries(fetchResult.records)) {
          const parseResult = PineconeMetadataSchema.safeParse(record.metadata);
          if (!parseResult.success) continue;

          const metadata = parseResult.data;
          const docId = metadata.documentId;
          const existing = documentsMap.get(docId);

          if (existing) {
            existing.chunkCount++;
          } else {
            documentsMap.set(docId, {
              id: docId,
              name: metadata.documentName,
              type: metadata.documentType,
              description: metadata.description,
              chunkCount: 1,
              uploadDate: new Date(metadata.uploadDate).toISOString(),
              status: "indexed",
              source: metadata.source,
              targetActors: metadata.targetActors,
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

export async function findRelevantContent(query: string, k = 3) {
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

export async function getDocumentStats(
  documentId: string,
): Promise<{ chunks: number; vectors: number }> {
  try {
    const index = getIndex();

    console.log(`Getting stats for document: ${documentId}`);

    const sampleIds: string[] = [];
    for (let i = 0; i < 1000; i++) {
      sampleIds.push(`${documentId}-${i}`);
    }

    const results = await index.namespace(DEFAULT_NAMESPACE).fetch(sampleIds);

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

    const vectorIds = Array.from(
      { length: 1000 },
      (_, i) => `${documentId}-${i}`,
    );
    const allRecords: Record<string, Record<string, unknown>> = {};

    for (let i = 0; i < vectorIds.length; i += 100) {
      const batch = await namespace.fetch(vectorIds.slice(i, i + 100));
      if (batch.records) Object.assign(allRecords, batch.records);
    }

    if (Object.keys(allRecords).length === 0) {
      return { success: false, message: "No vectors found" };
    }

    const metadataUpdates: Record<string, any> = {};
    if (updates.documentName)
      metadataUpdates.documentName = updates.documentName;
    if (updates.documentType)
      metadataUpdates.documentType = updates.documentType;
    if (updates.description) metadataUpdates.description = updates.description;
    if (updates.targetActors)
      metadataUpdates.targetActors = updates.targetActors.join(",");

    const updatePromises = Object.entries(allRecords).map(
      async ([id, record]) => {
        const parseResult = PineconeMetadataSchema.safeParse(record?.metadata);
        if (!parseResult.success) return;

        await namespace.update({
          id,
          metadata: { ...parseResult.data, ...metadataUpdates },
        });
      },
    );

    await Promise.all(updatePromises);

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
