import fs from 'fs';
import path from 'path';
import { MarkdownTextSplitter } from '@langchain/textsplitters';

// Helper to infer type from file name
function inferTypeFromFileName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('faq')) return 'faq';
  if (lower.includes('case')) return 'case_study';
  if (lower.includes('script')) return 'sales_script';
  if (lower.includes('guide')) return 'guide';
  return 'unknown';
}

const knowledgeDir = path.join(process.cwd(), 'knowledge');
const outputDir = path.join(process.cwd(), 'chunks');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const splitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

async function chunkAllMarkdownFiles() {
  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
  for (const filename of files) {
    const filePath = path.join(knowledgeDir, filename);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    console.log(`Chunking ${filename}`);
    const docType = inferTypeFromFileName(filename);
    const chunks = await splitter.splitText(rawContent);
    const totalChunks = chunks.length;
    for (let i = 0; i < totalChunks; ++i) {
      const chunkContent = chunks[i];
      const chunkFileName = `${path.parse(filename).name}_chunk${i + 1}.md`;
      const chunkFilePath = path.join(outputDir, chunkFileName);
      const yamlFrontmatter =
        `---\n` +
        `source: ${filename}\n` +
        `type: ${docType}\n` +
        `chunk: ${i + 1}\n` +
        `total_chunks: ${totalChunks}\n` +
        `---\n\n`;
      fs.writeFileSync(chunkFilePath, yamlFrontmatter + chunkContent, 'utf8');
      console.log(`Wrote ${chunkFileName}`);
    }
  }
}

chunkAllMarkdownFiles().catch(err => {
  console.error('Error chunking knowledge files:', err);
  process.exit(1);
}); 