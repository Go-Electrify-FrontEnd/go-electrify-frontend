# Document Management System - Setup Guide

This guide explains how to set up and use the RAG (Retrieval-Augmented Generation) document management system for the Go-Electrify AI chatbot.

## Overview

The document management system allows admins to upload, manage, and delete knowledge base documents that power the AI customer support chatbot. Documents are automatically:
- Parsed (PDF, TXT, MD formats supported)
- Chunked into optimal sizes
- Embedded using OpenAI embeddings
- Stored in Qdrant vector database
- Made available for RAG-powered chat responses

---

## Prerequisites

1. **OpenAI API Key** (already configured for chatbot)
2. **Qdrant Vector Database** (local or cloud)

---

## Quick Start

### 1. Set Up Qdrant

**Option A: Local Development (Docker)**

```bash
# Run Qdrant in Docker
docker run -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

**Option B: Qdrant Cloud (Production)**

1. Sign up at [cloud.qdrant.io](https://cloud.qdrant.io)
2. Create a new cluster
3. Copy your cluster URL and API key

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
# OpenAI API Key (already configured)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Qdrant Configuration
QDRANT_URL=http://localhost:6333              # or your cloud URL
QDRANT_API_KEY=your-qdrant-api-key-here       # only for cloud
QDRANT_COLLECTION_NAME=go-electrify-docs      # optional, defaults to this
```

**For local development:** Omit `QDRANT_API_KEY`
**For production (cloud):** Include both `QDRANT_URL` and `QDRANT_API_KEY`

### 3. Install Dependencies

Dependencies are already installed:
- `@qdrant/js-client-rest` - Qdrant client
- `pdf-parse` - PDF parsing
- `uuid` - Document ID generation

### 4. Start Development Server

```bash
pnpm run dev
```

### 5. Access Document Management

Navigate to: **`/dashboard/admin/documents`**

---

## Features

### Upload Documents
- **Supported Formats:** PDF, TXT, MD
- **Max File Size:** 10MB
- **Document Types:** FAQ, Guide, Policy, Troubleshooting, Other
- **Auto-processing:** Uploads are automatically chunked, embedded, and indexed

### View Documents
- View all uploaded documents in a sortable table
- See chunk count, upload date, status, and source file
- Search by document name
- Filter and sort by any column

### Edit Documents
- Update document name, type, and description
- Metadata changes are instant
- Re-indexing requires re-uploading (file not stored)

### Delete Documents
- Type-to-confirm deletion for safety
- Removes all chunks and vectors from Qdrant
- Irreversible action

---

## Architecture

### File Structure

```
src/
├── features/
│   ├── rag/
│   │   ├── services/
│   │   │   ├── qdrant-client.ts          # Qdrant singleton
│   │   │   ├── embeddings.ts             # OpenAI embeddings via AI SDK
│   │   │   ├── document-processor.ts     # Chunking & parsing
│   │   │   └── vector-operations.ts      # Upsert, delete, search
│   │   └── types/
│   │       └── index.ts                  # Type definitions
│   │
│   └── documents/
│       ├── components/
│       │   ├── documents-table.tsx
│       │   ├── documents-table-columns.tsx
│       │   ├── document-upload-dialog.tsx
│       │   ├── document-edit-dialog.tsx
│       │   ├── document-delete-dialog.tsx
│       │   └── document-actions-cell.tsx
│       ├── services/
│       │   ├── documents-api.ts          # List documents
│       │   └── documents-actions.ts      # Upload, update, delete
│       └── schemas/
│           ├── document.types.ts
│           ├── document.schema.ts
│           └── document.request.ts
│
└── app/(app-layout)/dashboard/admin/
    └── documents/
        └── page.tsx                      # Admin page
```

### Data Flow

```
Upload Flow:
User selects file → Validate (size, type) → Parse (PDF/TXT/MD) →
Chunk text (500-800 tokens) → Generate embeddings (OpenAI) →
Upsert to Qdrant → Success

Query Flow (in chatbot):
User query → Generate query embedding → Search Qdrant (top 3 chunks) →
Build enhanced prompt → Stream AI response
```

### Qdrant Schema

**Collection:** `go-electrify-docs`
**Vector Size:** 1536 (text-embedding-3-small)
**Distance Metric:** Cosine

**Payload Structure:**
```typescript
{
  documentId: string       // UUID
  documentName: string     // Display name
  documentType: string     // FAQ | Guide | Policy | Troubleshooting | Other
  chunkIndex: number       // Chunk position (0, 1, 2...)
  chunkText: string        // Actual content
  uploadDate: number       // Unix timestamp
  description?: string     // Optional metadata
  source: string           // Original filename
}
```

---

## Usage Examples

### 1. Upload a Guide

1. Navigate to `/dashboard/admin/documents`
2. Click "Upload Document"
3. Select a PDF file (e.g., `ev-charging-guide.pdf`)
4. Fill in:
   - **Name:** "EV Charging Best Practices"
   - **Type:** Guide
   - **Description:** "Tips for optimal EV charging"
5. Click "Upload"
6. Document is processed (takes 5-30 seconds depending on size)
7. Success toast appears, table refreshes

### 2. Edit Document Metadata

1. Click ⋯ (actions) → Edit on any document
2. Update name, type, or description
3. Click "Save Changes"
4. Changes reflect immediately in table

### 3. Delete a Document

1. Click ⋯ (actions) → Delete on any document
2. Alert dialog shows chunk count
3. Type exact document name to confirm
4. Click "Delete"
5. All vectors removed from Qdrant

---

## Chunking Strategy

Documents are intelligently chunked for optimal RAG performance:

- **Chunk Size:** 600 tokens (~400-500 words)
- **Overlap:** 100 tokens (~70-80 words)
- **Method:**
  - Split by paragraphs first
  - If paragraph > chunk size, split by sentences
  - Add overlap between adjacent chunks
  - Preserve context across boundaries

**Why overlap?** Ensures queries matching chunk boundaries still retrieve relevant context.

---

## Embedding Model

**Model:** `text-embedding-3-small` (via Vercel AI SDK)
**Dimensions:** 1536
**Cost:** ~$0.02 per 1M tokens
**Speed:** ~1-2 seconds for 10 chunks

**Usage via gateway:**
```typescript
import { embedMany } from "ai";

const { embeddings } = await embedMany({
  model: "openai/text-embedding-3-small",
  values: chunks,
});
```

---

## Troubleshooting

### Problem: "Failed to connect to Qdrant"

**Solutions:**
1. Verify Qdrant is running: `docker ps` (should see qdrant/qdrant)
2. Check `QDRANT_URL` is correct in `.env.local`
3. For cloud: verify API key is valid
4. Test connection: `curl http://localhost:6333/collections`

### Problem: "Collection already exists"

**Not an error!** The system auto-creates the collection on first use. This message means it's already set up.

### Problem: Upload fails with "File too large"

**Solution:**
- Max size is 10MB
- Compress PDF or split into multiple documents
- For large docs, consider splitting into logical sections

### Problem: "Failed to parse PDF"

**Solutions:**
1. Ensure PDF is text-based (not scanned images)
2. Try converting to TXT format first
3. Check for password protection
4. Verify file is not corrupted

### Problem: No search results in chatbot

**Solutions:**
1. Verify documents are uploaded (check admin table)
2. Check collection name matches in `.env.local`
3. Ensure chatbot is configured to use RAG (see next section)

---

## Integrating with Chatbot

To enable RAG in the chatbot, update [src/app/api/chat/route.ts](src/app/api/chat/route.ts):

```typescript
import { searchSimilarChunks } from "@/features/rag/services/vector-operations";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userQuery = messages[messages.length - 1].content;

  // Retrieve relevant chunks
  const relevantChunks = await searchSimilarChunks(userQuery, 3);

  // Build enhanced system prompt
  const contextText = relevantChunks
    .map((chunk, i) => `[${i + 1}] ${chunk.content}\nSource: ${chunk.source}`)
    .join("\n\n");

  const systemPrompt = `You are a helpful AI assistant for Go-Electrify, an EV charging platform.

${relevantChunks.length > 0 ? `RELEVANT DOCUMENTATION:\n${contextText}\n\n` : ""}Use the above documentation to answer the user's question. If the documentation doesn't contain the answer, politely say so and suggest contacting support.

Be friendly, concise, and helpful.`;

  const result = streamText({
    model: gateway("anthropic/claude-haiku-4.5"),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

---

## Best Practices

### Document Organization

1. **Use descriptive names:** "EV Charging Safety Guidelines" not "doc1.pdf"
2. **Choose correct types:** Helps with filtering and context
3. **Add descriptions:** Useful for admins to understand document purpose
4. **Keep docs focused:** One topic per document (e.g., separate "Pricing" from "Reservations")

### Upload Tips

1. **Text-based PDFs only:** Scanned images require OCR (not supported)
2. **Well-formatted documents:** Use headings, paragraphs, clear structure
3. **Remove headers/footers:** Can pollute chunks with irrelevant text
4. **Test after upload:** Ask chatbot a question to verify retrieval

### Maintenance

1. **Regular audits:** Review documents quarterly for accuracy
2. **Update outdated info:** Edit or re-upload when policies change
3. **Monitor chatbot responses:** Check if relevant docs are retrieved
4. **Delete obsolete docs:** Remove outdated policies/guides

---

## Performance Metrics

### Upload Performance
- **Small doc (1-5 pages):** 5-10 seconds
- **Medium doc (10-20 pages):** 15-30 seconds
- **Large doc (50+ pages):** 1-2 minutes

### Query Performance
- **Embedding generation:** ~500ms
- **Vector search (Qdrant):** ~50-100ms
- **Total overhead:** ~600-800ms (before LLM streaming)

### Storage
- **Qdrant free tier:** 1GB (~1M vectors)
- **Typical document:** 10-50 chunks (vectors)
- **Capacity:** ~20,000-100,000 documents (depending on size)

---

## Security Considerations

### Access Control
- ✅ Admin-only access enforced via layout guard
- ✅ Server actions verify admin role
- ✅ No client-side Qdrant access (server-only)

### API Keys
- ✅ Never expose `QDRANT_API_KEY` or `OPENAI_API_KEY` in client code
- ✅ All operations server-side
- ✅ Keys stored in environment variables only

### File Validation
- ✅ File size limit (10MB)
- ✅ MIME type validation
- ✅ Malicious file rejection

---

## Cost Estimates

### OpenAI Embeddings
- **text-embedding-3-small:** $0.02 per 1M tokens
- **Average document:** 5,000 tokens → $0.0001
- **100 documents:** ~$0.01
- **Very affordable for most use cases**

### Qdrant Hosting
- **Free tier:** 1GB storage, sufficient for most projects
- **Paid tiers:** Start at $25/month for 4GB
- **Local Docker:** Free (uses your hardware)

---

## Monitoring & Debugging

### Check Collection Status

```typescript
// In a server action or API route
import { getQdrantClient, getCollectionName } from "@/features/rag/services/qdrant-client";

const client = getQdrantClient();
const collectionName = getCollectionName();

// Get collection info
const info = await client.getCollection(collectionName);
console.log("Vectors:", info.vectors_count);
console.log("Points:", info.points_count);
```

### Test Search

```typescript
import { searchSimilarChunks } from "@/features/rag/services/vector-operations";

const results = await searchSimilarChunks("How do I charge my EV?", 3);
console.log("Found chunks:", results.length);
results.forEach(r => console.log(`Score: ${r.score}, Source: ${r.source}`));
```

---

## Next Steps

1. **Upload initial documents:**
   - Start with 3-5 key guides (FAQ, pricing, troubleshooting)
   - Test chatbot responses
   - Iterate based on results

2. **Integrate with chatbot:**
   - Update [src/app/api/chat/route.ts](src/app/api/chat/route.ts) per instructions above
   - Test with real user queries
   - Monitor retrieval quality

3. **Monitor and improve:**
   - Track which documents are most retrieved
   - Update/expand based on common queries
   - Add new documents as platform evolves

---

## Support

For issues or questions:
1. Check [CLAUDE.md](CLAUDE.md) for project conventions
2. Review [CHATBOT_SETUP.md](CHATBOT_SETUP.md) for chatbot configuration
3. Consult Qdrant docs: [qdrant.tech/documentation](https://qdrant.tech/documentation)
4. Check Vercel AI SDK docs: [sdk.vercel.ai](https://sdk.vercel.ai)

---

**Happy documenting! 📚🤖**
