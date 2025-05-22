import React from 'react';

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ prompts, onPromptClick }) => {
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex gap-2 min-w-max">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onPromptClick(prompt)}
            className="whitespace-nowrap px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors border border-indigo-200 shadow-sm text-sm font-medium"
            type="button"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts; 