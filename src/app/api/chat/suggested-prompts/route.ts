import { callOpenAI } from "@/api/lib/llmClient";
import { SUGGESTED_PROMPTS_SYSTEM_PROMPT } from "@/api/lib/promptTemplates";

/**
 * POST endpoint that generates suggested follow-up prompts based on conversation history
 * @param req - HTTP Request object containing:
 *   - messages: Previous conversation messages
 *   - userMessage: Latest message from the user
 *   - aiResponseContent: Latest response from the AI
 * @returns JSON response containing an array of suggested follow-up prompts
 * @throws Will return a JSON error response if OpenAI call fails
 */
export async function POST(req: Request) {
  const { messages, userMessage, aiResponseContent } = await req.json();

  const suggestionPrompt = [
    { role: "system", content: SUGGESTED_PROMPTS_SYSTEM_PROMPT },
    ...messages,
    { role: "user", content: userMessage },
    { role: "assistant", content: aiResponseContent },
    {
      role: "user",
      content: "What are some good follow-up questions or topics?",
    },
  ];
  const suggestionsResult = await callOpenAI(suggestionPrompt);

  let samplePrompts: string[] = [];
  const suggestionsContent = suggestionsResult.content ?? "";
  try {
    samplePrompts = JSON.parse(suggestionsContent);
  } catch {
    samplePrompts = [suggestionsContent];
  }

  return Response.json({ samplePrompts });
}
