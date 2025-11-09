import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPinecone() {
    try {
        console.log('Testing Pinecone connection...');
        console.log('API Key length:', process.env.PINECONE_API_KEY?.length);
        console.log('Index Name:', process.env.PINECONE_INDEX_NAME);

        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY?.trim() });
        const index = pc.index(process.env.PINECONE_INDEX_NAME || 'swp391');

        console.log('\nFetching index stats...');
        const stats = await index.describeIndexStats();
        console.log('Index stats:', JSON.stringify(stats, null, 2));

        // Get namespaces
        const namespaces = Object.keys(stats.namespaces || {});
        console.log('\nNamespaces found:', namespaces);

        if (namespaces.length > 0) {
            const firstNs = namespaces[0];
            console.log(`\nTesting namespace: ${firstNs}`);

            try {
                const listResult = await index.namespace(firstNs).listPaginated({ limit: 5 });
                console.log(`Found ${listResult.vectors?.length || 0} vectors`);

                if (listResult.vectors && listResult.vectors.length > 0) {
                    const ids = listResult.vectors.map(v => v.id);
                    console.log('Sample IDs:', ids);

                    const fetchResult = await index.namespace(firstNs).fetch(ids);
                    console.log('\nFetch result structure:');
                    console.log(JSON.stringify(fetchResult, null, 2));

                    console.log('\nSample record:');
                    const firstRecord = Object.values(fetchResult.records || {})[0];
                    if (firstRecord) {
                        console.log('Full record:', JSON.stringify(firstRecord, null, 2));
                        console.log('Fields:', firstRecord.fields);
                        console.log('Metadata:', firstRecord.metadata);
                    }
                }
            } catch (nsError) {
                console.error(`Error accessing namespace ${firstNs}:`, nsError.message);
            }
        } else {
            console.log('\n⚠️  No namespaces found - index is empty!');
        }

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
}

testPinecone();
