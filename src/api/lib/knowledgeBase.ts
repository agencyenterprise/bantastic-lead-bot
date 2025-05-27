import fs from 'fs';
import path from 'path';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from 'langchain/document';

// Load all docs from /knowledge/
function loadDocs() {
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  const files = fs.readdirSync(knowledgeDir);
  return files.map(filename => {
    const content = fs.readFileSync(path.join(knowledgeDir, filename), 'utf8');
    return new Document({ pageContent: content, metadata: { source: filename } });
  });
}

// This should be in llmClient.ts?
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const chromaUrl = process.env.CHROMA_PRIVATE_URL || "http://localhost:8000";
const vectorStore = new Chroma(embeddings, {
  collectionName: "bantastic-knowledge-base",
  url: chromaUrl,
  collectionMetadata: {
    "hnsw:space": "cosine",
  },
});

let firstLoad = true;

export async function getVectorStore() {
  if (firstLoad) {
    const docs = loadDocs();
    await vectorStore.addDocuments(docs);
    firstLoad = false;
  }
  return vectorStore;
}

// Retrieve relevant docs for a query
export async function getRelevantDocs(query: string) {
  const store = await getVectorStore();
  // Use similarity search to get top 4 relevant docs
  const results = await store.similaritySearch(query, 4);
  return results;
} 