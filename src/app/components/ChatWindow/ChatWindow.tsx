'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import SuggestedPrompts from '../SuggestedPrompts/SuggestedPrompts';
import type { ChatMessage } from '../../../../types/chat';

const defaultPrompts = [
  'What services does AE Studio offer?',
  'What are usual ways you integrate AI into your projects?',
  'How can AI help my business?',
];

const greetMessage = 'Hello! I\'m AE\'s assistant. How can I help you today?';

const INACTIVITY_LIMIT_MS = 2 * 60 * 1000; // 2 minutes

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: greetMessage },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [samplePrompts, setSamplePrompts] = useState<string[]>(defaultPrompts);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (bottomOfMessagesRef.current) {
      bottomOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleEndChat();
    }, INACTIVITY_LIMIT_MS);
  }, [conversationId, chatEnded]);

  // Reset timer on every message change
  useEffect(() => {
    if (!chatEnded) resetInactivityTimer();
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [messages, chatEnded, resetInactivityTimer]);

  // End chat handler
  const handleEndChat = async () => {
    if (!conversationId || chatEnded) return;
    setChatEnded(true);
    setInput('');
    setLoading(false);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    try {
      const res = await fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();
      setReport(data.summary || 'No summary available.');
    } catch (err) {
      setReport('Failed to generate report.');
    }
  };

  // Streaming sendMessage
  const sendMessageStream = async () => {
    if (input.trim() === '' || loading || chatEnded) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setSamplePrompts([]);
    setInput('');
    setLoading(true);

    let botMsg = '';

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.filter(m => m.role !== 'system'),
          userMessage: input,
          ...(conversationId ? { conversationId } : {}),
        }),
      });

      // Extract conversationId from response header if not already set
      if (!conversationId) {
        const headerConvId = res.headers.get('X-Conversation-Id');
        if (headerConvId) setConversationId(headerConvId);
      }

      const suggestedPromptsRes = await fetch('/api/chat/suggested-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.filter(m => m.role !== 'system'),
          userMessage: input,
          aiResponseContent: botMsg,
        }),
      });
      const suggestedPromptsData = await suggestedPromptsRes.json();
      setSamplePrompts(suggestedPromptsData.samplePrompts);

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let load = true;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (load) {
          load = false;
          setLoading(false);
          setMessages([...newMessages, { role: 'assistant', content: '' }]);
        }
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // SSE format: data: <token>\n\n
          chunk.split('data: ').forEach((part) => {
            if (part.trim() === '') return;
            const token = part.replace(/\n\n$/, '');
            botMsg += token;
            setMessages((prev) => {
              // Replace the last assistant message with the updated content
              const updated = [...prev];
              if (updated[updated.length - 1]?.role === 'assistant') {
                updated[updated.length - 1] = { role: 'assistant', content: botMsg };
              }
              return updated;
            });
          });
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    }
  };

  const promptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="w-[600px] h-[750px] border border-gray-300 rounded-lg flex flex-col bg-neutral-900">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.content} sender={msg.role === 'user' ? 'user' : 'bot'} />
        ))}
        {loading && (
          <MessageBubble loading sender="bot" text="" />
        )}
        <div ref={bottomOfMessagesRef} id='bottom-of-messages' />
        {chatEnded && report && (
          <div className="mt-4 p-4 bg-neutral-800 rounded text-white border border-indigo-500">
            <h3 className="font-bold mb-2 text-indigo-300">Conversation Summary</h3>
            <pre className="whitespace-pre-wrap text-sm">{report}</pre>
          </div>
        )}
      </div>
      {!loading && !chatEnded && <SuggestedPrompts prompts={samplePrompts} onPromptClick={promptClick} />}
      <div className="flex p-2 border-t border-gray-700 bg-neutral-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessageStream(); }}
          className="flex-1 p-2 rounded bg-neutral-700 text-white outline-none border-none"
          placeholder={chatEnded ? "Chat ended." : "Type your message..."}
          disabled={loading || chatEnded}
        />
        <button
          onClick={sendMessageStream}
          className="ml-2 px-4 py-2 rounded bg-indigo-500 text-white border-none hover:bg-indigo-600 transition-colors"
          disabled={loading || chatEnded}
        >
          Send
        </button>
        <button
          onClick={handleEndChat}
          className="ml-2 px-4 py-2 rounded bg-red-500 text-white border-none hover:bg-red-600 transition-colors"
          disabled={chatEnded || !conversationId}
        >
          End Chat
        </button>
      </div>
    </div>
  );
};

export default ChatWindow; 