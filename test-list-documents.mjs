import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

async function testListDocuments() {
    try {
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY?.trim() });
        const index = pc.index(process.env.PINECONE_INDEX_NAME || 'swp391');

        console.log('Fetching index stats...');
        const stats = await index.describeIndexStats();
        const namespaces = Object.keys(stats.namespaces || {});
        console.log('Namespaces:', namespaces);

        const documentMap = new Map();

        for (const namespace of namespaces) {
            console.log(`\nProcessing namespace: ${namespace}`);

            const listResult = await index.namespace(namespace).listPaginated({ limit: 100 });
            console.log(`  Found ${listResult.vectors?.length || 0} vectors`);

            if (listResult.vectors && listResult.vectors.length > 0) {
                const ids = listResult.vectors.map(v => v.id);
                const fetchResult = await index.namespace(namespace).fetch(ids);

                for (const [id, vector] of Object.entries(fetchResult.records || {})) {
                    const record = vector;
                    // Support BOTH old (metadata) and new (fields) formats
                    const fields = record.fields;
                    const metadata = record.metadata;
                    const data = fields || metadata || {};

                    const docId = String(data?.documentId ?? '');

                    if (!docId) {
                        console.log(`  ⚠️  Vector ${id} has no documentId`);
                        continue;
                    }

                    if (!documentMap.has(docId)) {
                        documentMap.set(docId, {
                            id: docId,
                            name: String(data?.documentName ?? 'Unknown'),
                            type: String(data?.documentType ?? 'Other'),
                            description: String(data?.description ?? ''),
                            chunkCount: 1,
                            uploadDate: new Date(Number(data?.uploadDate ?? Date.now())).toISOString(),
                            status: 'indexed',
                            source: String(data?.source ?? 'Unknown'),
                        });
                        console.log(`  ✓ Found document: ${data.documentName}`);
                    } else {
                        const doc = documentMap.get(docId);
                        doc.chunkCount++;
                    }
                }
            }
        }

        const documents = Array.from(documentMap.values());
        console.log('\n=== FINAL RESULTS ===');
        console.log(`Total documents found: ${documents.length}`);
        console.log(JSON.stringify(documents, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        console.error(error);
    }
}

testListDocuments();
