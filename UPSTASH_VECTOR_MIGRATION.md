# Upstash Vector Migration Documentation

## 📋 Overview

This document describes the migration from **Pinecone** to **Upstash Vector** for the Go-Electrify RAG (Retrieval-Augmented Generation) system.

## 🎯 Migration Summary

### What Changed

- **Vector Database**: Pinecone → Upstash Vector
- **Embeddings**: Pinecone built-in (llama-text-embed-v2) → OpenAI (text-embedding-3-small via Vercel AI SDK)
- **Document Registry**: Vector database listing → File-based registry (`data/document-registry.json`)
- **Environment Variables**: New Upstash credentials required

### Why Upstash Vector?

1. **Cost-effective**: Pay-as-you-go pricing, no minimum fees
2. **Serverless**: No infrastructure management required
3. **Fast**: Global edge network for low latency
4. **Simple**: Easy setup and maintenance
5. **Integration**: Works seamlessly with Vercel AI SDK

## 🔧 Technical Changes

### 1. New Files Created

#### `src/features/rag/services/upstash-client.ts`

Replaces `pinecone-client.ts` with Upstash Vector client initialization.

```typescript
import { Index } from "@upstash/vector";

export function getUpstashClient(): Index<VectorMetadata> {
  return new Index({
    url: process.env.UPSTASH_VECTOR_URL,
    token: process.env.UPSTASH_VECTOR_TOKEN,
  });
}
```

#### `src/features/rag/services/embeddings.ts`

Handles embedding generation using OpenAI via Vercel AI SDK.

```typescript
import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateEmbedding(value: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: input,
  });
  return embedding;
}
```

#### `src/features/rag/services/document-registry.ts`

File-based document metadata registry to replace Pinecone's listing capabilities.

Maintains document metadata in `data/document-registry.json`:

- Document ID, name, type
- Chunk count
- Upload date
- Status

#### `rag-examples/`

Example documents demonstrating proper format for the RAG system:

- `example-guide.txt` - Plain text guide
- `example-faq.md` - Markdown FAQ
- `example-policy.md` - Markdown policy document
- `README.md` - Documentation for examples

### 2. Modified Files

#### `src/features/rag/services/vector-operations.ts`

Complete rewrite to use Upstash Vector API:

**Before (Pinecone)**:

- Used namespaces for document categorization
- Built-in search and reranking
- `describeIndexStats()`, `listPaginated()`, `searchRecords()`
- Automatic pagination

**After (Upstash Vector)**:

- Flat structure with ID-based organization (`{documentId}-{chunkIndex}`)
- Custom embedding generation
- `query()`, `upsert()`, `delete()`, `fetch()`
- Document registry for metadata

Key function changes:

- `upsertDocumentChunks()` - Now generates embeddings and updates registry
- `deleteDocumentById()` - Deletes vectors and updates registry
- `listAllDocuments()` - Reads from registry instead of querying database
- `searchSimilarChunks()` - Uses custom embeddings and Upstash query
- `getDocumentStats()` - Reads from registry
- `updateDocumentMetadata()` - Updates both vectors and registry

### 3. Environment Variables

#### Old (.env)

```bash
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=go-electrify-docs
OPENAI_API_KEY=sk_...  # Chat only
```

#### New (.env)

```bash
UPSTASH_VECTOR_URL=https://your-index.upstash.io
UPSTASH_VECTOR_TOKEN=your_token_here
OPENAI_API_KEY=sk_...  # Chat + Embeddings
```

### 4. Package Changes

No package changes required! Both `@upstash/vector` and `ai` were already installed.

```json
{
  "dependencies": {
    "@upstash/vector": "^1.2.2", // Already present
    "ai": "^5.0.89" // Already present
  }
}
```

Removed from `package.json`:

- `@pinecone-database/pinecone` dependency (can be removed manually if desired)
- Pinecone CLI scripts (`pinecone:list`, `pinecone:stats`, `pinecone:describe`)

## 🚀 Setup Instructions

### 1. Create Upstash Vector Index

1. Visit [Upstash Console](https://console.upstash.com/vector)
2. Click "Create Index"
3. Configure:
   - **Name**: `go-electrify-docs` (or your preferred name)
   - **Dimension**: `1536` (for OpenAI text-embedding-3-small)
   - **Metric**: `COSINE`
   - **Region**: Choose closest to your users
4. Copy the **REST URL** and **REST Token**

### 2. Update Environment Variables

Update your `.env` file:

```bash
# Remove old Pinecone variables
# PINECONE_API_KEY=...
# PINECONE_INDEX_NAME=...

# Add new Upstash variables
UPSTASH_VECTOR_URL=https://your-index-xxxxx.upstash.io
UPSTASH_VECTOR_TOKEN=your_upstash_token_here

# Keep OpenAI (now used for embeddings too)
OPENAI_API_KEY=sk_your_openai_api_key_here
```

### 3. Initialize Document Registry

The registry file is created automatically on first use, but you can initialize it manually:

```bash
mkdir -p data
echo "[]" > data/document-registry.json
```

### 4. Test the Integration

Run the development server:

```bash
pnpm run dev
```

Navigate to `/dashboard/admin/documents` and try uploading an example document from `rag-examples/`.

## 📝 Usage Guide

### Uploading Documents

1. Navigate to `/dashboard/admin/documents`
2. Click "Tải Lên Tài Liệu" (Upload Document)
3. Select file (PDF, TXT, or MD)
4. Fill in metadata:
   - Name (auto-filled from filename)
   - Type (FAQ, Guide, Policy, Troubleshooting, Other)
   - Description (optional)
5. Click "Tải Lên"

**What happens**:

1. File is parsed based on type
2. Text is chunked using Chonkie (512 tokens/chunk, 100 token overlap)
3. Each chunk is embedded using OpenAI text-embedding-3-small (1536 dimensions)
4. Vectors are upserted to Upstash Vector with metadata
5. Document is added to registry in `data/document-registry.json`

### Testing the Chatbot

After uploading documents, test queries:

**Example Queries** (Vietnamese):

- "Làm thế nào để sạc xe?" (How to charge vehicle?)
- "Tìm trạm sạc gần tôi" (Find charging station near me)
- "Tôi quên mật khẩu" (I forgot password)
- "Chính sách hoàn tiền" (Refund policy)

**What happens**:

1. User query is embedded using OpenAI
2. Upstash Vector performs semantic search
3. Top K chunks (default: 3-6) are retrieved
4. Chunks are filtered by score threshold (default: 0.7)
5. Context is injected into chat prompt
6. AI generates response using retrieved knowledge

### Viewing Documents

The admin page displays all documents from the registry:

- Document name and type
- Chunk count
- Upload date
- Status (indexed/processing/failed)
- Actions (view, edit, delete)

### Deleting Documents

1. Click delete icon on document row
2. Confirm deletion
3. All vectors are deleted from Upstash
4. Document is removed from registry

## 🏗️ Architecture

### Document Flow

```
Upload → Parse → Clean → Chunk → Embed → Store → Index
  ↓        ↓       ↓       ↓       ↓       ↓       ↓
File    Text   Cleaned  Chunks  Vectors Upstash Registry
```

### Query Flow

```
User Query → Embed → Search Upstash → Filter → Rerank → Context
    ↓          ↓          ↓            ↓        ↓         ↓
Vietnamese  Vector    Similarity    Score   Best      Prompt
             (1536)   Comparison   >= 0.7   Chunks   Injection
```

### Data Storage

```
Upstash Vector Index
├── Vector ID: {documentId}-0
│   ├── Vector: [0.123, -0.456, ...] (1536 dimensions)
│   └── Metadata:
│       ├── content: "chunk text..."
│       ├── documentId: "uuid"
│       ├── documentName: "Guide Name"
│       ├── documentType: "Guide"
│       ├── chunkIndex: 0
│       ├── uploadDate: 1699123456789
│       ├── description: "..."
│       └── source: "filename.pdf"
└── Vector ID: {documentId}-1
    └── ...

data/document-registry.json
[
  {
    "id": "uuid",
    "name": "Guide Name",
    "type": "Guide",
    "description": "...",
    "chunkCount": 42,
    "uploadDate": "2025-11-11T...",
    "status": "indexed",
    "source": "filename.pdf"
  }
]
```

## 🔍 API Reference

### Vector Operations

#### `upsertDocumentChunks(documentId, documentName, documentType, chunks, metadata)`

Embeds and stores document chunks in Upstash Vector.

**Parameters**:

- `documentId` (string) - Unique document identifier (UUID)
- `documentName` (string) - Display name
- `documentType` (string) - Document category
- `chunks` (Array<{content: string}>) - Text chunks
- `metadata` ({source, description?}) - Additional metadata

**Returns**: `Promise<{success: boolean, message: string}>`

#### `searchSimilarChunks(query, topK, scoreThreshold, options?)`

Performs semantic search for relevant chunks.

**Parameters**:

- `query` (string) - Search query
- `topK` (number) - Max results (default: 3)
- `scoreThreshold` (number) - Min similarity (default: 0.7)
- `options` (object) - Additional search options

**Returns**: `Promise<RetrievedChunk[]>`

#### `deleteDocumentById(documentId)`

Deletes all chunks for a document.

**Parameters**:

- `documentId` (string) - Document to delete

**Returns**: `Promise<{success: boolean, message: string}>`

#### `listAllDocuments()`

Lists all documents from registry.

**Returns**: `Promise<DocumentMetadata[]>`

#### `getDocumentStats(documentId)`

Gets chunk count for a document.

**Parameters**:

- `documentId` (string) - Document ID

**Returns**: `Promise<{chunks: number, vectors: number}>`

#### `updateDocumentMetadata(documentId, updates)`

Updates document metadata in both vectors and registry.

**Parameters**:

- `documentId` (string) - Document to update
- `updates` (object) - Fields to update

**Returns**: `Promise<{success: boolean, message: string}>`

### Embedding Functions

#### `generateEmbedding(value)`

Generates embedding for a single text.

**Parameters**:

- `value` (string) - Text to embed

**Returns**: `Promise<number[]>` - 1536-dimensional vector

#### `generateEmbeddings(chunks)`

Generates embeddings for multiple texts.

**Parameters**:

- `chunks` (string[]) - Array of texts

**Returns**: `Promise<Array<{content: string, embedding: number[]}>>

### Document Registry

#### `readRegistry()`

Reads all documents from registry.

**Returns**: `Promise<DocumentMetadata[]>`

#### `addDocument(document)`

Adds/updates document in registry.

**Parameters**:

- `document` (DocumentMetadata) - Document to add

**Returns**: `Promise<void>`

#### `removeDocument(documentId)`

Removes document from registry.

**Parameters**:

- `documentId` (string) - Document to remove

**Returns**: `Promise<void>`

#### `updateDocument(documentId, updates)`

Updates document in registry.

**Parameters**:

- `documentId` (string) - Document to update
- `updates` (Partial<DocumentMetadata>) - Fields to update

**Returns**: `Promise<void>`

## 🐛 Troubleshooting

### Issue: "UPSTASH_VECTOR_URL not set"

**Solution**: Add environment variables to `.env`:

```bash
UPSTASH_VECTOR_URL=https://your-index.upstash.io
UPSTASH_VECTOR_TOKEN=your_token_here
```

### Issue: "Embedding dimension mismatch"

**Cause**: Upstash index created with wrong dimension.

**Solution**: Create new index with dimension 1536 (OpenAI text-embedding-3-small).

### Issue: "Document not appearing in list"

**Cause**: Registry out of sync.

**Solution**: Check `data/document-registry.json` and verify document was added.

### Issue: "Search returns no results"

**Possible causes**:

1. Score threshold too high (try lowering from 0.7 to 0.5)
2. No documents uploaded
3. Query not semantically similar to content

**Solution**: Upload test documents from `rag-examples/` and try example queries.

### Issue: "Rate limit exceeded"

**Cause**: Too many API calls to OpenAI or Upstash.

**Solution**: The code includes batching and delays. Check your rate limits:

- OpenAI: https://platform.openai.com/account/limits
- Upstash: https://console.upstash.com/

## 📊 Performance Comparison

### Pinecone vs Upstash Vector

| Feature        | Pinecone          | Upstash Vector    |
| -------------- | ----------------- | ----------------- |
| **Pricing**    | $70/month minimum | Pay-as-you-go     |
| **Embeddings** | Built-in (free)   | External (OpenAI) |
| **Listing**    | Native            | Manual registry   |
| **Namespaces** | Yes               | No (ID-based)     |
| **Reranking**  | Built-in          | Manual            |
| **Setup**      | Complex           | Simple            |
| **Latency**    | Low               | Very low (edge)   |

### Cost Estimate (1000 documents, 50k chunks)

**Pinecone**:

- Index: $70/month
- Total: **$70/month**

**Upstash Vector**:

- Storage (50k vectors): ~$2/month
- Queries (10k/month): ~$1/month
- OpenAI Embeddings (1k docs): ~$0.50 one-time
- Total: **~$3-4/month**

**Savings**: ~$66/month (~95% reduction)

## 🎓 Best Practices

### Document Preparation

1. **Use clear section headers** (especially in Markdown)
2. **Break content into logical paragraphs**
3. **Include relevant keywords naturally**
4. **Keep sentences concise and clear**
5. **Add context for technical terms**

### Chunking Strategy

Current configuration (optimal for most use cases):

```typescript
{
  chunkSize: 512,      // tokens
  chunkOverlap: 100,   // tokens
  separator: "\n\n"    // paragraphs
}
```

### Search Optimization

1. **Adjust score threshold** based on content:
   - FAQ: 0.7-0.8 (high precision)
   - Guides: 0.6-0.7 (balanced)
   - Policies: 0.5-0.6 (high recall)

2. **Tune topK** based on use case:
   - Quick answers: 3-5 chunks
   - Comprehensive responses: 6-10 chunks

3. **Monitor search quality**:
   - Log queries and retrieved chunks
   - Gather user feedback
   - Adjust thresholds accordingly

## 📚 Additional Resources

- [Upstash Vector Documentation](https://upstash.com/docs/vector)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Chonkie Chunking Library](https://github.com/chonkie-inc/chonkiejs)

## 🤝 Support

For issues or questions:

- Check this documentation first
- Review example documents in `rag-examples/`
- Contact the development team
- Open an issue in the repository

---

**Migration completed**: November 11, 2025
**Version**: 2.0.0
**Status**: ✅ Production Ready
