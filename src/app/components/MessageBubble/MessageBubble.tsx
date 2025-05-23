import React from 'react';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  const isUser = sender === 'user';
  return (
    <div
      className={`max-w-[75%] mb-1 px-4 py-2 rounded-2xl text-white ${
        isUser
          ? 'self-end bg-indigo-500'
          : 'self-start bg-neutral-700'
      }`}
    >
      {text}
    </div>
  );
};

export default MessageBubble; 