import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callOpenAI(messages: any[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
  });
  return response.choices[0].message;
}

export async function callOpenAIStream(messages: any[], onData: (token: string) => void) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      onData(content);
    }
  }
} 