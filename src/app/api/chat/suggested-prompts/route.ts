import { callOpenAI } from '@/api/lib/llmClient';
import { SUGGESTED_PROMPTS_SYSTEM_PROMPT } from '@/api/lib/promptTemplates';

interface SuggestedPromptReq {
  messages: any[];
  userMessage: string;
  aiResponseContent: string;
}

export async function POST(req: Request) {
  const { messages, userMessage, aiResponseContent } = await req.json();

  // This is the prompt for the suggested prompts
  const suggestionPrompt = [
    { role: 'system', content: SUGGESTED_PROMPTS_SYSTEM_PROMPT },
    ...messages,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: aiResponseContent },
    { role: 'user', content: 'What are some good follow-up questions or topics?' }
  ];
  const suggestionsResult = await callOpenAI(suggestionPrompt);

  let samplePrompts: string[] = [];
  const suggestionsContent = suggestionsResult.content ?? '';
  try {
    samplePrompts = JSON.parse(suggestionsContent);
  } catch {
    samplePrompts = [suggestionsContent];
  }

  return Response.json({ samplePrompts });
} 