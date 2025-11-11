# Upstash Vector Setup Guide

## Quick Start

This guide will help you set up Upstash Vector for the Go-Electrify RAG system in 5 minutes.

## Prerequisites

- OpenAI API Key (for embeddings)
- Upstash Account (free tier available)

## Step 1: Create Upstash Vector Index

### Option A: Via Console (Recommended)

1. Go to [Upstash Console](https://console.upstash.com/vector)
2. Click **"Create Index"**
3. Fill in the form:
   - **Name**: `go-electrify-docs`
   - **Region**: Select closest to your users (e.g., `us-east-1`)
   - **Dimension**: `1536`
   - **Similarity Metric**: `COSINE`
   - **Embedding Model**: Choose `OpenAI text-embedding-3-small` (dimension 1536)
4. Click **"Create"**
5. Copy the **REST URL** and **REST TOKEN** from the index details page

### Option B: Via Upstash CLI

```bash
# Install Upstash CLI
npm install -g @upstash/cli

# Login
upstash auth login

# Create index
upstash vector create \
  --name go-electrify-docs \
  --region us-east-1 \
  --dimension 1536 \
  --metric cosine
```

## Step 2: Configure Environment Variables

Create or update your `.env` file:

```bash
# Upstash Vector
UPSTASH_VECTOR_URL=https://your-index-xxxxx.upstash.io
UPSTASH_VECTOR_TOKEN=your_upstash_token_here

# OpenAI (for embeddings and chat)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Backend API (existing)
BACKEND_URL=https://api.go-electrify.com/api/v1
```

**Important**: Remove old Pinecone variables:

```bash
# Remove these lines:
# PINECONE_API_KEY=...
# PINECONE_INDEX_NAME=...
```

## Step 3: Verify Setup

1. Start the development server:

```bash
pnpm run dev
```

2. Navigate to `/dashboard/admin/documents`

3. Upload a test document from `rag-examples/`:
   - Select `rag-examples/example-guide.txt`
   - Type: "Guide"
   - Click "Upload"

4. Wait for processing (30-60 seconds for a 50-chunk document)

5. Test the chatbot with a query:
   - "Làm thế nào để sạc xe?" (How to charge vehicle?)

## Step 4: Verify Data

Check that data was stored correctly:

1. **Upstash Console**:
   - Go to your index in [Upstash Console](https://console.upstash.com/vector)
   - Check "Vectors" tab - should show vectors with your document ID prefix
   - Example: `abc123-0`, `abc123-1`, etc.

2. **Document Registry**:

```bash
cat data/document-registry.json
```

Should show:

```json
[
  {
    "id": "abc123-...",
    "name": "Example Guide",
    "type": "Guide",
    "chunkCount": 52,
    "uploadDate": "2025-11-11T...",
    "status": "indexed",
    "source": "example-guide.txt"
  }
]
```

## Troubleshooting

### Error: "UPSTASH_VECTOR_URL not set"

**Solution**: Add environment variables to `.env` file and restart dev server.

### Error: "Dimension mismatch"

**Solution**: Ensure Upstash index was created with dimension `1536` (not 384 or 768).

### Error: "Rate limit exceeded"

**Solutions**:

- Check OpenAI rate limits: https://platform.openai.com/account/limits
- Check Upstash rate limits: https://console.upstash.com/
- Wait a few minutes and try again

### Documents not appearing

**Solutions**:

1. Check browser console for errors
2. Verify `data/document-registry.json` exists
3. Check file permissions on `data/` directory
4. Review server logs for upload errors

### Search returns no results

**Solutions**:

1. Lower score threshold: Try 0.5 instead of 0.7
2. Upload more varied content
3. Verify documents were actually indexed (check Upstash console)
4. Try queries in Vietnamese (content is in Vietnamese)

## Production Deployment

### Vercel

Add environment variables in Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   - `UPSTASH_VECTOR_URL`
   - `UPSTASH_VECTOR_TOKEN`
   - `OPENAI_API_KEY`

### Docker

Update your `docker-compose.yml` or Dockerfile:

```yaml
environment:
  - UPSTASH_VECTOR_URL=${UPSTASH_VECTOR_URL}
  - UPSTASH_VECTOR_TOKEN=${UPSTASH_VECTOR_TOKEN}
  - OPENAI_API_KEY=${OPENAI_API_KEY}
```

### Manual Deployment

Ensure environment variables are set in your production environment before deployment.

## Cost Estimation

### Free Tier (Upstash)

- 10,000 vectors
- 10,000 queries/day
- Perfect for testing

### Paid Tier

- $0.40 per 100k vectors/month
- $0.10 per 100k queries

### Example Costs

- **1,000 documents** (50k vectors): ~$20/month
  - Upstash: ~$2
  - OpenAI embeddings: ~$0.50 (one-time)
  - OpenAI chat: ~$17 (10k queries)

Compare to Pinecone: $70/month minimum

## Next Steps

1. Upload your actual documents to `/dashboard/admin/documents`
2. Test chatbot thoroughly with various queries
3. Adjust score thresholds based on results
4. Monitor costs in Upstash and OpenAI dashboards
5. Set up alerts for unusual usage

## Support

- [Upstash Documentation](https://upstash.com/docs/vector)
- [Upstash Discord](https://discord.gg/w9SenAtbme)
- [OpenAI Support](https://help.openai.com)

---

**Setup time**: ~5 minutes
**First document indexed**: ~1 minute
**Status**: ✅ Ready for production
