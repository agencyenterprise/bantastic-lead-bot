import { NextRequest } from 'next/server';
import { prisma } from '@/api/lib/prisma';
import { callOpenAI } from '@/api/lib/llmClient';

export async function POST(req: NextRequest) {
  const { conversationId } = await req.json();
  if (!conversationId) {
    return Response.json({ error: 'Missing conversationId' }, { status: 400 });
  }

  // Mark conversation as ended
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      endedAt: new Date(),
      status: 'ended',
    },
  });

  // Fetch all messages for the conversation
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { timestamp: 'asc' },
  });

  // Prepare transcript
  const transcript = messages
    .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  // Generate summary using LLM (MVP: simple prompt)
  const summaryPrompt = `Summarize the following conversation for a human agent. Highlight any scheduled meetings, next steps, and unresolved questions.\n\n${transcript}`;
  let summary = '';
  try {
    const summaryMsg = await callOpenAI([
      { role: 'system', content: 'You are a helpful assistant that summarizes conversations for handoff.' },
      { role: 'user', content: summaryPrompt },
    ]);
    summary = summaryMsg.content || '';
  } catch (e) {
    summary = 'Summary generation failed.';
  }

  // Store the report
  await prisma.report.create({
    data: {
      conversationId,
      summary,
      transcript,
    },
  });

  return Response.json({ success: true, summary });
} 