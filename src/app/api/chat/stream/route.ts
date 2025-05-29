import { NextRequest } from 'next/server';
import { callOpenAIStream } from '@/api/lib/llmClient';
import { AE_SYSTEM_PROMPT, NEGATIVE_ALIGNMENT_PROMPT, SUGGESTED_PROMPTS_SYSTEM_PROMPT } from '@/api/lib/promptTemplates';
import { getRelevantDocs } from '@/api/lib/knowledgeBase';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages, userMessage } = await req.json();

  // Get relevant docs from the knowledge base
  const docs = await getRelevantDocs(userMessage);
  const contextString = Array.isArray(docs)
    ? docs.map(doc => doc.pageContent).join('\n---\n')
    : '';

  const fullPrompt = [
    { role: 'system', content: `${AE_SYSTEM_PROMPT}\n${NEGATIVE_ALIGNMENT_PROMPT}\nKnowledge Context:\n${contextString}` },
    ...messages,
    { role: 'user', content: userMessage },
  ];

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        await callOpenAIStream(fullPrompt, (token: string) => {
          controller.enqueue(encoder.encode(`data: ${token}\n\n`));
        });
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    }
  );
} 