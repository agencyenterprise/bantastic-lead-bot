import fs from 'fs';
import path from 'path';
import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from 'langchain/document';

// Load all docs from /knowledge/
function loadDocs() {
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  const files = fs.readdirSync(knowledgeDir);
  return files.map(filename => 
    new Document({ pageContent: fs.readFileSync(path.join(knowledgeDir, filename), 'utf8'), metadata: { source: filename } })
  );
}

// Set up Qdrant client
const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
const qdrantClient = new QdrantClient({ url: qdrantUrl, checkCompatibility: false });
// Set up embeddings
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// Utility to upsert documents into a Qdrant collection
export async function upsertKnowledgeBase() {
  const docs = loadDocs();
  await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      client: qdrantClient,
      collectionName: "bantastic-knowledge-base",
    }
  );
}

// Retrieve relevant docs for a query (using similarity search)
export async function getRelevantDocs(query: string, nResults = 4) {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      client: qdrantClient,
      collectionName: "bantastic-knowledge-base",
    }
  );
  return await vectorStore.similaritySearch(query, nResults);
} 