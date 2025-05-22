'use client';
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { FaRegCommentDots } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="flex flex-col items-center mb-8">
        <FaRegCommentDots className="text-5xl mb-2" />
        <h1 className="text-5xl font-semibold tracking-tight">AE chatbot</h1>
      </div>
      <ChatWindow />
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          Clear Conversation
        </button>
      </div>
    </div>
  );
}
