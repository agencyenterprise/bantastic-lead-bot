import { NextRequest } from "next/server";
import { callOpenAIStream } from "@/api/lib/llmClient";
import {
  AE_SYSTEM_PROMPT,
  NEGATIVE_ALIGNMENT_PROMPT,
} from "@/api/lib/promptTemplates";
import { getRelevantDocs } from "@/api/lib/knowledgeBase";
import { createConversationId, logMessage } from "@/api/lib/prisma";

/**
 * POST endpoint that streams a response from the AI assistant
 * @param req - HTTP Request object containing:
 *   - messages: Previous conversation messages
 *   - userMessage: Latest message from the user
 *   - conversationId: (optional) Conversation ID for logging
 * @returns SSE response containing the AI's response token by token
 */
export async function POST(req: NextRequest) {
  const { messages, userMessage, conversationId } = await req.json();

  // If no conversationId, create a new one
  const convId = conversationId || (await createConversationId()).id;

  await logMessage({
    conversationId: convId,
    sender: "user",
    content: userMessage,
  });

  // Get relevant docs from the knowledge base
  const docs = await getRelevantDocs(userMessage);
  const contextString = Array.isArray(docs)
    ? docs.map((doc) => doc.pageContent).join("\n---\n")
    : "";

  const fullPrompt = [
    {
      role: "system",
      content: `${AE_SYSTEM_PROMPT}\n${NEGATIVE_ALIGNMENT_PROMPT}\nKnowledge Context:\n${contextString}`,
    },
    ...messages,
    { role: "user", content: userMessage },
  ];

  const encoder = new TextEncoder();
  let assistantMsg = "";

  return new Response(
    new ReadableStream({
      async start(controller) {
        await callOpenAIStream(fullPrompt, async (token: string) => {
          assistantMsg += token;
          controller.enqueue(encoder.encode(`data: ${token}\n\n`));
        });
        // Log the assistant message after streaming is done
        await logMessage({
          conversationId: convId,
          sender: "assistant",
          content: assistantMsg,
        });
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        // Return conversationId in a custom header for the frontend
        "X-Conversation-Id": convId,
      },
    }
  );
}
