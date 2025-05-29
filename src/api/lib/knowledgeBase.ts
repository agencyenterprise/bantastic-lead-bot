import fs from 'fs';
import path from 'path';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from 'langchain/document';

// Load all docs from /chunks/
function loadDocs() {
  const knowledgeDir = path.join(process.cwd(), 'chunks');
  const files = fs.readdirSync(knowledgeDir);
  return files.map(filename => 
    new Document({ pageContent: fs.readFileSync(path.join(knowledgeDir, filename), 'utf8'), metadata: { source: filename } })
  );
}

// Set up embeddings
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// Utility to upsert documents into a Chroma collection
export async function upsertKnowledgeBase() {
  const docs = loadDocs();
  await Chroma.fromDocuments(
    docs,
    embeddings,
    {
      collectionName: "bantastic-knowledge-base",
      url: process.env.CHROMA_URL,
      clientParams: process.env.CHROMA_TOKEN ? {
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${process.env.CHROMA_TOKEN}`,
          },
        },
      } : undefined,
    }
  );
}

// Retrieve relevant docs for a query (using similarity search)
export async function getRelevantDocs(query: string, nResults = 4) {
  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    {
      collectionName: "bantastic-knowledge-base",
      url: process.env.CHROMA_URL,
      clientParams: process.env.CHROMA_TOKEN ? {
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${process.env.CHROMA_TOKEN}`,
          },
        },
      } : undefined,
    }
  );
  return await vectorStore.similaritySearch(query, nResults);
} 