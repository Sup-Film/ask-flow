import { ollamaChat, ollamaEmbeddings } from "../src/lib/ollama";
import { HumanMessage } from "@langchain/core/messages";

async function testOllama() {
  console.log("🚀 Starting Ollama Verification...");

  try {
    // 1. Test Chat Model
    console.log("\n1️⃣ Testing Chat Model (qwen3-vl:2b)...");
    const chatResponse = await ollamaChat.invoke([
      new HumanMessage("Hello, are you working?"),
    ]);
    console.log("✅ Chat Response:", chatResponse.content);

    // 2. Test Embeddings Model
    console.log("\n2️⃣ Testing Embeddings Model (embeddinggemma:300m)...");
    const textToEmbed = "This is a test sentence for embedding.";
    const embedding = await ollamaEmbeddings.embedQuery(textToEmbed);

    if (embedding && embedding.length > 0) {
      console.log(
        `✅ Embedding generated successfully! Vector length: ${embedding.length}`
      );
      console.log("Sample (first 5 dims):", embedding.slice(0, 5));
    } else {
      console.error("❌ Failed to generate embedding: Empty result");
    }

    console.log("\n🎉 Verification Completed Successfully!");
  } catch (error) {
    console.error("\n❌ Verification Failed:", error);
  }
}

testOllama();
