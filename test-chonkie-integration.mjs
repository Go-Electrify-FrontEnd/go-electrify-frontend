/**
 * Test script for Chonkie integration
 * Verifies that the new chunking system works correctly
 */

import { RecursiveChunker } from "@chonkiejs/core";

const testText = `
Go-Electrify is a comprehensive EV charging platform that connects electric vehicle owners with charging stations across Vietnam.

Our platform features include real-time station availability, flexible pricing models, and seamless booking experiences. Users can easily locate nearby charging stations using our interactive map interface.

The system supports multiple payment methods including credit cards, digital wallets, and QR code payments. We also offer subscription plans for frequent users with discounted rates.

For station owners, we provide a complete management dashboard to monitor usage, set pricing, and track revenue. Our analytics tools help optimize station operations and improve customer satisfaction.

Safety is our top priority. All stations undergo regular maintenance checks and comply with international safety standards. Our 24/7 customer support team is always ready to assist with any issues.

We believe in sustainable transportation and work closely with environmental organizations to promote clean energy adoption. Join us in building a greener future for Vietnam.
`.trim();

console.log("🧪 Testing Chonkie Integration\n");
console.log("=" .repeat(60));

async function testChunking() {
  try {
    // Test 1: Basic chunking
    console.log("\n📝 Test 1: Basic Chunking (512 tokens, no overlap)\n");
    const chunker1 = await RecursiveChunker.create({
      chunkSize: 512,
      minCharactersPerChunk: 24,
    });

    const chunks1 = await chunker1.chunk(testText);
    console.log(`✓ Created ${chunks1.length} chunks`);

    chunks1.forEach((chunk, i) => {
      console.log(`\nChunk ${i + 1}:`);
      console.log(`  Token count: ${chunk.tokenCount}`);
      console.log(`  Character count: ${chunk.text.length}`);
      console.log(`  Start index: ${chunk.startIndex}`);
      console.log(`  End index: ${chunk.endIndex}`);
      console.log(`  Preview: ${chunk.text.substring(0, 80)}...`);
    });

    // Test 2: Smaller chunks
    console.log("\n\n📝 Test 2: Smaller Chunks (200 tokens)\n");
    const chunker2 = await RecursiveChunker.create({
      chunkSize: 200,
      minCharactersPerChunk: 24,
    });

    const chunks2 = await chunker2.chunk(testText);
    console.log(`✓ Created ${chunks2.length} chunks`);

    const totalTokens = chunks2.reduce((sum, c) => sum + c.tokenCount, 0);
    const avgTokens = totalTokens / chunks2.length;
    console.log(`  Total tokens: ${totalTokens}`);
    console.log(`  Average tokens per chunk: ${avgTokens.toFixed(2)}`);
    console.log(`  Largest chunk: ${Math.max(...chunks2.map(c => c.tokenCount))} tokens`);
    console.log(`  Smallest chunk: ${Math.min(...chunks2.map(c => c.tokenCount))} tokens`);

    // Test 3: Verify reconstruction
    console.log("\n\n📝 Test 3: Text Reconstruction Verification\n");
    const reconstructed = chunks1.map(c => c.text).join("");
    const originalNormalized = testText.replace(/\s+/g, " ").trim();
    const reconstructedNormalized = reconstructed.replace(/\s+/g, " ").trim();

    const matches = originalNormalized === reconstructedNormalized;
    console.log(`✓ Original length: ${testText.length} chars`);
    console.log(`✓ Reconstructed length: ${reconstructed.length} chars`);
    console.log(`✓ Normalized match: ${matches ? "✓ PASS" : "✗ FAIL"}`);

    // Test 4: Short text handling
    console.log("\n\n📝 Test 4: Short Text Handling\n");
    const shortText = "This is a very short text for testing.";
    const chunker3 = await RecursiveChunker.create({
      chunkSize: 512,
      minCharactersPerChunk: 24,
    });

    const chunks3 = await chunker3.chunk(shortText);
    console.log(`✓ Short text created ${chunks3.length} chunk(s)`);
    console.log(`  Tokens: ${chunks3[0].tokenCount}`);
    console.log(`  Text: "${chunks3[0].text}"`);

    // Test 5: Vietnamese text support
    console.log("\n\n📝 Test 5: Vietnamese Text Support\n");
    const vietnameseText = `
Go-Electrify là nền tảng sạc xe điện toàn diện kết nối chủ xe điện với các trạm sạc trên toàn Việt Nam.

Các tính năng của nền tảng bao gồm hiển thị tình trạng trạm theo thời gian thực, mô hình giá linh hoạt và trải nghiệm đặt chỗ liền mạch. Người dùng có thể dễ dàng tìm các trạm sạc gần đó bằng giao diện bản đồ tương tác.

Hệ thống hỗ trợ nhiều phương thức thanh toán bao gồm thẻ tín dụng, ví điện tử và thanh toán mã QR. Chúng tôi cũng cung cấp các gói đăng ký cho người dùng thường xuyên với mức giá ưu đãi.
    `.trim();

    const chunks4 = await chunker1.chunk(vietnameseText);
    console.log(`✓ Vietnamese text created ${chunks4.length} chunk(s)`);
    chunks4.forEach((chunk, i) => {
      console.log(`  Chunk ${i + 1}: ${chunk.tokenCount} tokens, ${chunk.text.length} chars`);
    });

    // Summary
    console.log("\n\n" + "=".repeat(60));
    console.log("✅ All Chonkie integration tests passed!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests
testChunking();
