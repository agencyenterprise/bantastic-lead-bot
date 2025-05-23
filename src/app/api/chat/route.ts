import { callOpenAI } from '@/api/lib/llmClient';
import { AE_SYSTEM_PROMPT, NEGATIVE_ALIGNMENT_PROMPT, SUGGESTED_PROMPTS_SYSTEM_PROMPT } from '@/api/lib/promptTemplates';
import { getRelevantDocs } from '@/api/lib/knowledgeBase';

export async function POST(req: Request) {
  const { messages, userMessage } = await req.json();

  const fullPrompt = [
    { role: 'system', content: `${AE_SYSTEM_PROMPT}\n${NEGATIVE_ALIGNMENT_PROMPT}` },
    ...messages,
    { role: 'user', content: userMessage },
  ];

  try {
    // This is the main assistant response
    const aiResponse = await callOpenAI(fullPrompt);

    // This is the prompt for the suggested prompts
    const suggestionPrompt = [
      { role: 'system', content: SUGGESTED_PROMPTS_SYSTEM_PROMPT },
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse.content },
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

    return Response.json({ response: aiResponse, samplePrompts });
  } catch (error) {
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
} 