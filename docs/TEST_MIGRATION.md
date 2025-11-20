# Testing the Migration

## Quick Test (5 minutes)

This guide will help you verify that the Upstash Vector migration works correctly.

### Prerequisites

Ensure you have:

- ✅ Upstash Vector index created (dimension 1536)
- ✅ Environment variables set in `.env`:
  ```bash
  UPSTASH_VECTOR_URL=https://your-index.upstash.io
  UPSTASH_VECTOR_TOKEN=your_token_here
  OPENAI_API_KEY=sk_your_key_here
  ```
- ✅ Development server running (`pnpm run dev`)

### Test 1: Upload Document

1. Navigate to http://localhost:3000/dashboard/admin/documents

2. Click "Tải Lên Tài Liệu" (Upload Document)

3. Select `rag-examples/example-faq.md`

4. Fill in:
   - Name: "Example FAQ" (auto-filled)
   - Type: "FAQ"
   - Description: "Test document for Upstash migration"

5. Click "Tải Lên" (Upload)

**Expected Result**:

- Upload progress shown
- Success message after 30-60 seconds
- Document appears in table with:
  - Name: "Example FAQ"
  - Type: "FAQ"
  - Chunk count: ~40-60
  - Status: "indexed"

### Test 2: Verify Storage

#### Check Upstash Console

1. Go to https://console.upstash.com/vector
2. Select your index
3. Click "Vectors" tab
4. Search for vectors with your document ID

**Expected Result**:

- Vectors with IDs like `{uuid}-0`, `{uuid}-1`, etc.
- Each vector has metadata:
  - `content`: chunk text
  - `documentName`: "Example FAQ"
  - `documentType`: "FAQ"

#### Check Registry

```bash
cat data/document-registry.json
```

**Expected Result**:

```json
[
  {
    "id": "some-uuid-here",
    "name": "Example FAQ",
    "type": "FAQ",
    "description": "Test document for Upstash migration",
    "chunkCount": 45,
    "uploadDate": "2025-11-11T...",
    "status": "indexed",
    "source": "example-faq.md"
  }
]
```

### Test 3: Search (Chatbot)

1. Navigate to the chatbot (location depends on your app)

2. Try these Vietnamese queries:
   - "Tôi quên mật khẩu" (I forgot password)
   - "Cách nạp tiền vào ví" (How to add money to wallet)
   - "Làm thế nào để đăng ký gói tháng?" (How to subscribe monthly?)

**Expected Result**:

- AI responds with relevant information from the FAQ
- Responses mention specific details from the uploaded document
- Context is accurate and helpful

### Test 4: Update Document

1. Go back to /dashboard/admin/documents

2. Click edit icon on "Example FAQ"

3. Change:
   - Name: "Updated FAQ"
   - Description: "Updated description"

4. Save changes

**Expected Result**:

- Success message
- Document name updated in table
- Registry reflects changes:
  ```bash
  cat data/document-registry.json
  # Should show updated name and description
  ```

### Test 5: Delete Document

1. Click delete icon on document

2. Confirm deletion

**Expected Result**:

- Success message
- Document removed from table
- Registry empty:
  ```bash
  cat data/document-registry.json
  # Should show []
  ```
- Upstash Console shows vectors deleted (may take a few seconds)

## Advanced Tests

### Test Multiple Documents

Upload all three examples:

- `example-guide.txt` (Type: Guide)
- `example-faq.md` (Type: FAQ)
- `example-policy.md` (Type: Policy)

Test cross-document queries:

- "Chính sách hoàn tiền và cách sạc xe" (Refund policy and how to charge)

**Expected**: AI synthesizes information from multiple documents.

### Test Vietnamese Language

The examples are in Vietnamese. Test that:

- Embeddings work with Vietnamese text
- Search finds semantically similar Vietnamese queries
- Chatbot responds in Vietnamese

### Test Edge Cases

1. **Empty File**: Upload a nearly empty TXT file
   - Expected: Graceful error or minimal chunks

2. **Large File**: Upload a 5MB PDF (if you have one)
   - Expected: Progress indication, ~500-1000 chunks

3. **Duplicate Upload**: Upload same file twice
   - Expected: Creates separate document entries

4. **Network Error**: Disconnect internet during upload
   - Expected: Error message, rollback if possible

## Troubleshooting

### Upload Fails

**Check**:

```bash
# Terminal where dev server is running
# Look for error messages

# Common errors:
# - "UPSTASH_VECTOR_URL not set" → Check .env
# - "Rate limit exceeded" → Wait 1 minute
# - "Embedding failed" → Check OpenAI API key
```

### No Search Results

**Try**:

1. Lower score threshold in code (0.5 instead of 0.7)
2. Use exact phrases from documents
3. Verify documents actually uploaded (check registry)

### Registry Out of Sync

**Fix**:

```bash
# Backup current registry
cp data/document-registry.json data/document-registry.backup.json

# Clear and restart
echo "[]" > data/document-registry.json

# Re-upload documents
```

## Success Criteria

- ✅ Document uploads successfully
- ✅ Chunks visible in Upstash Console
- ✅ Registry updated correctly
- ✅ Search returns relevant results
- ✅ Update works
- ✅ Delete removes all traces

## Performance Benchmarks

**Upload** (example-faq.md, ~45 chunks):

- Parsing: < 1 second
- Embedding: 5-10 seconds
- Upserting: 5-10 seconds
- Total: 15-30 seconds

**Search** (single query):

- Embedding: ~500ms
- Vector search: ~100ms
- Total: < 1 second

**Delete**:

- Vector deletion: 2-5 seconds
- Registry update: < 1 second
- Total: < 10 seconds

## Next Steps After Testing

1. ✅ Upload your production documents
2. ✅ Fine-tune score thresholds based on results
3. ✅ Monitor costs in Upstash dashboard
4. ✅ Set up error alerting
5. ✅ Deploy to production

---

**Test Time**: ~5 minutes
**Status**: Ready to test!
