'use client';
import React, { useState } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import SuggestedPrompts from '../SuggestedPrompts/SuggestedPrompts';
import type { ChatMessage } from '../../../../types/chat';

const defaultPrompts = [
  'What services does AE Studio offer?',
  'Show me your case studies',
  'How can AI help my business?',
  'What is your project timeline?',
  'How do I get started?'
];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m AE\'s assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [samplePrompts, setSamplePrompts] = useState<string[]>(defaultPrompts);

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.filter(m => m.role !== 'system'),
          userMessage: input,
        }),
      });
      const data = await res.json();
      if (data.response?.content) {
        setMessages([...newMessages, { role: 'assistant' as const, content: data.response.content }]);
      }
      if (data.samplePrompts && Array.isArray(data.samplePrompts)) {
        setSamplePrompts(data.samplePrompts);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const promptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="w-[400px] h-[500px] border border-gray-300 rounded-lg flex flex-col bg-neutral-900">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.content} sender={msg.role === 'user' ? 'user' : 'bot'} />
        ))}
        {loading && (
          <MessageBubble text="..." sender="bot" />
        )}
      </div>
      <SuggestedPrompts prompts={samplePrompts} onPromptClick={promptClick} />
      <div className="flex p-2 border-t border-gray-700 bg-neutral-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          className="flex-1 p-2 rounded bg-neutral-700 text-white outline-none border-none"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 rounded bg-indigo-500 text-white border-none hover:bg-indigo-600 transition-colors"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow; 