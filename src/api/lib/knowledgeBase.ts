import fs from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';

// Load all docs from /knowledge/
function loadDocs() {
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  const files = fs.readdirSync(knowledgeDir);
  return files.map(filename => ({
    content: fs.readFileSync(path.join(knowledgeDir, filename), 'utf8'),
    source: filename,
  }));
}

console.log("CHROMA_URL:", process.env.CHROMA_URL);
console.log("CHROMA_TOKEN:", process.env.CHROMA_TOKEN ? "set" : "not set");

// Set up ChromaDB client with authentication
const chroma = new ChromaClient({
  path: process.env.CHROMA_URL,
  auth: {
    provider: "token",
    credentials: process.env.CHROMA_TOKEN,
    tokenHeaderType: "AUTHORIZATION"
  }
});

// Utility to upsert documents into a collection
export async function upsertKnowledgeBase() {
  const docs = loadDocs();
  const collection = await chroma.getOrCreateCollection({ name: "bantastic-knowledge-base" });
  await collection.upsert({
    ids: docs.map((_, i) => `doc-${i}`),
    documents: docs.map(doc => doc.content),
    metadatas: docs.map(doc => ({ source: doc.source })),
  });
}

// Retrieve relevant docs for a query (using similarity search)
export async function getRelevantDocs(query: string, nResults = 4) {
  const collection = await chroma.getOrCreateCollection({ name: "bantastic-knowledge-base" });
  const results = await collection.query({
    queryTexts: [query],
    nResults,
  });
  const docs = (results.documents?.[0]) ? results.documents[0] : [];
  const metadatas = (results.metadatas?.[0]) ? results.metadatas[0] : [];
  return docs.map((content: string | null, i: number) => ({
    pageContent: content || '',
    metadata: metadatas[i] || null
  }));
} 