---
source: guide Modern AI Tech Stack.md
type: guide
chunk: 4
total_chunks: 37
---

* **LangChain / LangGraph:** Useful for structuring interactions with large language models (LLMs), setting up agents to use external tools, and managing complex workflows involving multiple models. Good for quick prototyping, but not recommended if you want high customizability — “lower-level” tools (e.g., using OpenAI/Anthropic APIs and writing all prompts from scratch) are more well-suited in this case. It has a huge toolset from the active community that accelerates development.
* **LiteLLM:** Wrapper for calling hundreds of LLMs using the traditional OpenAI format. Great for seamless changing models and providers.
* **DSPy:** A user-friendly framework that helps you build AI systems without writing complex prompts. It automatically improves the prompts by learning what works best using evals, letting you focus on creating modular AI applications using simple Python code rather than struggling with prompt engineering[cite: 296, 369].