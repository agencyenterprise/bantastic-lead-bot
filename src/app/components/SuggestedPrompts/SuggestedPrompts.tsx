import React from "react";

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  prompts,
  onPromptClick,
}) => {
  return (
    <div className="w-full py-2">
      <div className="flex flex-col gap-2">
        {prompts.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onPromptClick(prompt)}
            className="w-19/20 self-center whitespace-normal px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors border border-indigo-200 shadow-sm text-sm font-medium"
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
