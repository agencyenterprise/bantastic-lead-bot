import { callOpenAI } from "@/api/lib/llmClient";
import {
  AE_SYSTEM_PROMPT,
  NEGATIVE_ALIGNMENT_PROMPT,
} from "@/api/lib/promptTemplates";
import { getRelevantDocs } from "@/api/lib/knowledgeBase";
import { createConversationId, logMessage } from "@/api/lib/prisma";

/**
 * POST endpoint that generates a response from the AI assistant
 * @param req - HTTP Request object containing:
 *   - messages: Previous conversation messages
 *   - userMessage: Latest message from the user
 * @returns JSON response containing the AI's response
 * @throws Will return a JSON error response if OpenAI call fails
 */
export async function POST(req: Request) {
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

  try {
    // This is the main assistant response
    const aiResponse = await callOpenAI(fullPrompt);

    return Response.json({ response: aiResponse });
  } catch (error) {
    return Response.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
