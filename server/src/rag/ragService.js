import { readSpec } from "../utils/specLoader.js";

const inMemoryDocuments = [];

export async function storeDocument({ type, id, text, metadata }) {
  const ragSpec = readSpec("system/rag.json");
  const chunkSize = ragSpec.chunking[type] || ragSpec.chunking.policy;
  const chunks = [];

  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    inMemoryDocuments.push({ type, id, chunk, metadata, index });
  });

  return { stored: chunks.length };
}

export async function semanticSearch(query) {
  const ragSpec = readSpec("system/rag.json");
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  return inMemoryDocuments
    .map((document) => {
      const text = document.chunk.toLowerCase();
      const matches = terms.filter((term) => text.includes(term)).length;
      return { ...document, score: terms.length ? matches / terms.length : 0 };
    })
    .filter((document) => document.score >= ragSpec.similarity_search.minimum_similarity)
    .sort((a, b) => b.score - a.score)
    .slice(0, ragSpec.similarity_search.top_k);
}
