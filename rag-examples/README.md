# RAG Examples for Go-Electrify

This folder contains example documents that work perfectly with the current document processor and chunking strategies.

## Document Types

### 1. **example-guide.txt** - Text Guide

- Format: Plain text (.txt)
- Type: Guide
- Content: Comprehensive charging guide in Vietnamese
- Chunking Strategy: `default` (paragraphs → sentences → clauses → words)
- Best for: Long-form instructional content

### 2. **example-faq.md** - Markdown FAQ

- Format: Markdown (.md)
- Type: FAQ
- Content: Frequently asked questions with answers
- Chunking Strategy: `markdown` (headers → paragraphs → sentences → words)
- Best for: Structured Q&A content with sections

### 3. **example-policy.md** - Markdown Policy

- Format: Markdown (.md)
- Type: Policy
- Content: Terms of service and usage policies
- Chunking Strategy: `markdown` (headers → paragraphs → sentences → words)
- Best for: Legal and policy documents with hierarchical structure

## Chunking Configuration

All examples are optimized for the following configuration:

```typescript
{
  chunkSize: 512,      // tokens (optimal for embeddings)
  chunkOverlap: 100,   // tokens (maintains context)
  separator: "\n\n"    // paragraph separator
}
```

## Document Processing Flow

1. **Upload** → Document uploaded via admin panel
2. **Parse** → Content extracted based on file type
3. **Clean** → Text normalized and cleaned
4. **Chunk** → Split using Chonkie with appropriate strategy
5. **Embed** → Converted to vectors using OpenAI embeddings
6. **Store** → Saved to Upstash Vector database
7. **Query** → Retrieved for RAG during chat

## Testing Examples

### Upload via Admin Panel

1. Navigate to `/dashboard/admin/documents`
2. Click "Tải Lên Tài Liệu" (Upload Document)
3. Select a file from this folder
4. Choose appropriate document type:
   - `example-guide.txt` → Guide
   - `example-faq.md` → FAQ
   - `example-policy.md` → Policy
5. Add optional description
6. Click "Tải Lên" (Upload)

### Test Queries

After uploading, test these queries in the chatbot:

**For Guide:**

- "Làm thế nào để sạc xe?"
- "Tìm trạm sạc gần tôi"
- "Loại đầu sạc nào phù hợp với xe tôi?"
- "Giá sạc xe là bao nhiêu?"

**For FAQ:**

- "Tôi quên mật khẩu"
- "Cách nạp tiền vào ví"
- "Đăng ký gói tháng như thế nào?"
- "Hoàn tiền khi nào?"

**For Policy:**

- "Chính sách hoàn tiền"
- "Quyền riêng tư của tôi"
- "Điều khoản sử dụng"
- "Trách nhiệm người dùng"

## Content Guidelines

When creating new documents for the RAG system:

### ✅ Good Practices

- Use clear section headers (especially in Markdown)
- Break content into logical paragraphs
- Include relevant keywords naturally
- Use consistent terminology
- Keep sentences concise and clear
- Add context for technical terms

### ❌ Avoid

- Very long paragraphs (>500 words)
- Dense, unstructured text walls
- Excessive formatting or special characters
- Redundant information
- Incomplete sentences
- Ambiguous references

## File Format Support

| Format     | Extension | Parser                | Chunking Strategy       |
| ---------- | --------- | --------------------- | ----------------------- |
| Plain Text | `.txt`    | UTF-8 text parser     | `default`               |
| Markdown   | `.md`     | Markdown-aware parser | `markdown`              |
| PDF        | `.pdf`    | pdf-parse library     | `default` or `markdown` |

## Size Limits

- Max file size: 10MB
- Recommended: 1-3MB per document
- Optimal chunk count: 20-200 chunks per document

## Metadata

Each document includes:

```typescript
{
  id: string           // UUID
  name: string         // Display name
  type: DocumentType   // FAQ | Guide | Policy | Troubleshooting | Other
  description?: string // Optional description
  source: string       // Original filename
  uploadDate: string   // ISO timestamp
  chunkCount: number   // Number of chunks created
}
```

## Semantic Search

Documents are indexed with:

- **Vector embeddings** for semantic similarity
- **Metadata filtering** by document type
- **Reranking** for improved relevance
- **Score threshold** (default: 0.7) for quality

## Vietnamese Language Support

All examples are in Vietnamese to match the target audience. The system supports:

- Unicode (UTF-8) encoding
- Vietnamese diacritics
- Mixed English-Vietnamese content
- Technical terms in both languages
