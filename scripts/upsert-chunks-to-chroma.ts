import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Document } from 'langchain/document';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import 'dotenv/config';

const chunksDir = path.join(process.cwd(), 'chunks');
const batchSize = 50;

function parseChunkFile(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]+?)\n---\n\n([\s\S]*)$/);
  if (!match) {
    console.log(`No match for ${filePath}`);
    return null;
  }
  const metadata = yaml.load(match[1]) as Record<string, any>;
  const content = match[2];
  if (!content.trim()) {
    console.log(`No content for ${filePath}`);
    return null;
  }
  return new Document({
    pageContent: content,
    metadata,
  });
}

async function main() {
  const files = fs.readdirSync(chunksDir).filter(f => f.endsWith('.md'));
  const docs: Document[] = [];
  for (const filename of files) {
    const filePath = path.join(chunksDir, filename);
    const doc = parseChunkFile(filePath);
    if (doc) docs.push(doc);
  }
  console.log(`Parsed ${docs.length} chunk documents.`);

  const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    {
      collectionName: 'bantastic-knowledge-base',
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

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    await vectorStore.addDocuments(batch);
    console.log(`Upserted batch ${i / batchSize + 1} (${batch.length} docs)`);
  }
  console.log('All chunks upserted to Chroma.');
}

main().catch(err => {
  console.error('Error upserting chunks:', err);
  process.exit(1);
}); 