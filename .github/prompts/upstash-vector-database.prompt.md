---
mode: agent
model: Claude Sonnet 4.5 (copilot)
---
## 📚 Task
First of all, analyzing the current RAG implementation, then generate a txt and markdown template and examples (put them in rag-examples folder) which work perfectly with the document processor (current chunking strategies).

Then, replacing the current pinecone setup with Upstash Vector following these examples from Vercel AI SDK integration tutorial provided by Upstash.

We have to bring our own embedding model as Upstash does not provide one. So we use vercel ai gateway embed function for that.

```typescript
// Embedding examples
import { embed } from 'ai';

const result = await embed({
  model: 'openai/text-embedding-3-mini',
  value: 'Sunny day at the beach',
})


// Function to generate a single embedding using our custom model
async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}

// Function to generate embeddings for multiple chunks
async function generateEmbeddings(
  value: string,
): Promise<Array<{ content: string; embedding: number[] }>> {
  const chunks = generateChunks(value)
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  })
  return embeddings.map((vector, i) => ({
    content: chunks[i],
    embedding: vector,
  }))
}


// Upsert
export async function upsertEmbeddings(resourceId: string, content: string) {
  // Generate embeddings for each chunk
  const chunkEmbeddings = await generateEmbeddings(content)
  // Convert each chunk into an Upstash upsert object
  const toUpsert = chunkEmbeddings.map((chunk, i) => ({
    id: `${resourceId}-${i}`, // e.g. "abc123-0"
    vector: chunk.embedding,
    metadata: {
      resourceId,
      content: chunk.content,
    },
  }))

  await index.upsert(toUpsert)
}

// Query
export async function findRelevantContent(query: string, k = 4) {
  const userEmbedding = await generateEmbedding(query)
  const result = await index.query({
    vector: userEmbedding,
    topK: k,
    includeMetadata: true,
  })

  return result
}

// Typesafety fetch example
type Metadata = {
  title: string;
  genre: 'sci-fi' | 'fantasy' | 'horror' | 'action';
  category: 'classic' | 'modern';
};

const index = new Index<Metadata>({ url, token });

const fetchResult = await index.fetch(["id-1", "id-2"]);
```
## Output
Provide the updated document-processor.ts file with Upstash Vector integration and the txt and markdown templates and examples in the rag-examples folder.

Rewrite the vector-operations.ts file to use Upstash Vector as shown in the examples above.

Update the /admin/document page to reflect any necessary changes for the new vector database integration.

Remember to check for build errors and mitigate them, after everything is well integrated, provide the documentation of the changes made and instructions on how to use the new RAG system with Upstash Vector.

