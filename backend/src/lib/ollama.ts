import { ChatOllama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";

// Initialize Ollama Chat Model
export const ollamaChat = new ChatOllama({
  model: "qwen3-vl:2b",
  temperature: 0.7, // Adjust as needed
});

// Initialize Ollama Embeddings Model
export const ollamaEmbeddings = new OllamaEmbeddings({
  model: "embeddinggemma:300m",
});
