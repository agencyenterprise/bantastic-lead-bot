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

const vectorStore = new Chroma(embeddings, {
  collectionName: "bantastic-knowledge-base",
  url: "http://localhost:8000", // Optional, will default to this value
  collectionMetadata: {
    "hnsw:space": "cosine",
  }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
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
export async function getRelevantDocs(query: string, k = 3) {
  const store = await getVectorStore();
  return store.similaritySearch(query, k);
} 