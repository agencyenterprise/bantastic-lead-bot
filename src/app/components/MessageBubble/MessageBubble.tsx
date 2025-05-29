import React from 'react';
import LoadingDots from '../LoadingDots/LoadingDots';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
  loading?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, loading }) => {
  const isUser = sender === 'user';
  return (
    <div
      className={`max-w-[75%] mb-1 px-4 py-2 rounded-2xl text-white ${
        isUser
          ? 'self-end bg-indigo-500'
          : 'self-start bg-neutral-700'
      }`}>
      {loading ? <LoadingDots /> : <ReactMarkdown>{text}</ReactMarkdown>}
    </div>
  );
};

export default MessageBubble; 