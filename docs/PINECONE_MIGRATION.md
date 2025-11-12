# Pinecone Migration Guide

## Overview

This project has been migrated from Qdrant to Pinecone for vector database operations. The migration follows best practices from the official Pinecone documentation and patterns outlined in CLAUDE.MD.

## What Changed

### 1. **Removed Qdrant Dependencies**

- `qdrant-client.ts` is now deprecated (can be removed)
- All imports updated to use `pinecone-client.ts`
- `initializeCollection()` replaced with `initializeIndex()`

### 2. **Updated Vector Operations** (`vector-operations.ts`)

- ✅ Using new Pinecone API patterns
- ✅ Proper type casting for `hit.fields` (per CLAUDE.MD best practices)
- ✅ Exponential backoff retry pattern for 5xx and 429 errors
- ✅ Flat metadata structure (no nested objects)
- ✅ Proper namespace usage for all operations
- ✅ Enhanced logging for debugging

### 3. **Modernized Client** (`pinecone-client.ts`)

- ✅ Better error messages and diagnostics
- ✅ Helpful CLI commands provided when index doesn't exist
- ✅ Convenience `getIndex()` method
- ✅ Proper TypeScript typing

## Environment Variables

Update your `.env` or `.env.local` file:

```bash
# Remove old Qdrant variables (no longer needed)
# QDRANT_URL=...
# QDRANT_API_KEY=...
# QDRANT_COLLECTION_NAME=...

# Add Pinecone variables
PINECONE_API_KEY=pcsk_xxxxxx  # Your Pinecone API key
PINECONE_INDEX_NAME=go-electrify-docs  # Your index name (default: go-electrify-docs)
```

## Setup Instructions

### Step 1: Install Pinecone CLI (One-time setup)

**macOS (Homebrew):**

```bash
brew tap pinecone-io/tap
brew install pinecone-io/tap/pinecone
```

**Other platforms:**
Download from [GitHub Releases](https://github.com/pinecone-io/cli/releases)

### Step 2: Authenticate with Pinecone

```bash
# Option 1: User login (recommended for development)
pc login
pc target -o "my-org" -p "my-project"

# Option 2: API key
export PINECONE_API_KEY="your-api-key"
# Or: pc auth configure --global-api-key <api-key>
```

### Step 3: Create Pinecone Index

⚠️ **CRITICAL**: Index creation MUST be done via CLI, NOT in application code!

```bash
# Create index with integrated embeddings (recommended)
pc index create \
  -n go-electrify-docs \
  -m cosine \
  -c aws \
  -r us-east-1 \
  --model llama-text-embed-v2 \
  --field_map text=content

# Verify index was created
pc index list
pc index describe -n go-electrify-docs
```

**OR use the convenience script:**

```bash
pnpm run pinecone:setup
```

### Step 4: Run the Application

```bash
pnpm run dev
```

## Key Differences from Qdrant

| Feature            | Qdrant (Old)           | Pinecone (New)                  |
| ------------------ | ---------------------- | ------------------------------- |
| **Index Creation** | Could be done in code  | ✅ CLI only (best practice)     |
| **Metadata**       | Nested objects allowed | ⚠️ Flat only (no nesting)       |
| **Batch Size**     | Variable               | 1000 vectors OR 2MB max         |
| **Namespaces**     | Optional               | ✅ Always used                  |
| **Retry Logic**    | Manual                 | ✅ Built-in exponential backoff |
| **Type Safety**    | Basic                  | ✅ Proper type casting required |
| **Error Handling** | Generic                | ✅ Specific error messages      |

## Important Constraints

### 1. Flat Metadata Only

```typescript
// ❌ WRONG - nested objects not allowed
const badRecord = {
  _id: "doc1",
  user: { name: "John", id: 123 }, // Nested
  tags: [{ type: "urgent" }], // Nested in list
};

// ✅ CORRECT - flat structure only
const goodRecord = {
  _id: "doc1",
  user_name: "John",
  user_id: 123,
  tags: ["urgent", "important"], // String lists OK
};
```

### 2. Batch Limits

- **Vectors**: Max 1000 per batch OR 2MB total
- We use 100 per batch (conservative) with exponential backoff

### 3. Eventual Consistency

- Records take 5-10 seconds to become searchable
- Stats update in 10-20 seconds
- Use polling for production (see `exponentialBackoffRetry`)

## CLI Commands Cheat Sheet

```bash
# List indexes
pc index list

# Describe index
pc index describe -n go-electrify-docs

# Delete index (DESTRUCTIVE!)
pc index delete -n go-electrify-docs

# Get stats
pc index stats -n go-electrify-docs

# Create API key
pc api-key create --name "my-app-key"
```

## Migration Checklist

- [x] Update environment variables (`.env.local`)
- [x] Install Pinecone CLI
- [x] Authenticate with Pinecone
- [x] Create Pinecone index via CLI
- [x] Update imports in `documents-actions.ts`
- [x] Test document upload
- [x] Test document search
- [x] Test document deletion
- [x] Verify metadata updates work
- [ ] Remove old Qdrant dependencies (optional cleanup)
- [ ] Update team documentation

## Troubleshooting

### Problem: "Index does not exist"

**Solution:** Create the index using the CLI command above or run `pnpm run pinecone:setup`

### Problem: "PINECONE_API_KEY not set"

**Solution:** Add the API key to your `.env.local` file and restart the dev server

### Problem: Search returns no results

**Causes:**

1. Field name mismatch in `--field_map`
2. Records not indexed yet (wait 10+ seconds)
3. Wrong namespace
4. Filtering too aggressively

**Solution:**

- Check index was created with `--field_map text=content`
- Wait 10-20 seconds after upload
- Check namespace matches document type

### Problem: TypeScript errors on `hit.fields`

**Solution:** All fields are properly type-cast with `as Record<string, any>` per CLAUDE.MD patterns

## Testing

Test the migration with these commands:

```bash
# Upload a test document (requires admin login)
# Visit: http://localhost:3000/dashboard/admin/documents

# Test search via chatbot
# Visit: http://localhost:3000/dashboard

# Check Pinecone stats
pc index stats -n go-electrify-docs
```

## Performance Notes

- **Faster searches**: Pinecone's hosted infrastructure is optimized
- **Better scaling**: Serverless architecture scales automatically
- **Cost**: Check Pinecone pricing - free tier available for development

## Resources

- **Official Pinecone Docs**: https://docs.pinecone.io/
- **CLI Reference**: https://docs.pinecone.io/reference/cli/command-reference
- **TypeScript SDK**: https://sdk.pinecone.io/typescript/
- **Best Practices Guide**: See CLAUDE.MD in this repository

## Questions?

Refer to:

1. **CLAUDE.MD** - Comprehensive Pinecone patterns and best practices
2. **Official docs** - https://docs.pinecone.io/
3. **Project docs** - `/docs/RAG_INTEGRATION.md`
