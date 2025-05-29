# Modern AI Tech Stack

## Getting Started With AI and LLMs

### Frameworks for LLM Integration:

* **LangChain / LangGraph:** Useful for structuring interactions with large language models (LLMs), setting up agents to use external tools, and managing complex workflows involving multiple models. Good for quick prototyping, but not recommended if you want high customizability — “lower-level” tools (e.g., using OpenAI/Anthropic APIs and writing all prompts from scratch) are more well-suited in this case. It has a huge toolset from the active community that accelerates development.
* **LiteLLM:** Wrapper for calling hundreds of LLMs using the traditional OpenAI format. Great for seamless changing models and providers.
* **DSPy:** A user-friendly framework that helps you build AI systems without writing complex prompts. It automatically improves the prompts by learning what works best using evals, letting you focus on creating modular AI applications using simple Python code rather than struggling with prompt engineering[cite: 296, 369].
* **LlamaIndex:** Helps connect LLMs to your data sources. It offers advanced retrieval and query capabilities, making it easier to feed relevant information to the model. It has a massive integration hub called LlamaHub with hundreds of connectors to utilities such as Data Loaders, Agent Tools, Llama Packs, and Llama Datasets[cite: 299, 300].

### Rapid Prototyping Tools:

* **Chainlit / Vercel AI SDK:** Provide a fast path to create and deploy conversational interfaces or prototypes. If you want to test an idea quickly, these tools can accelerate development of chat-like experiences.
* **Prompt to code tools:** Here is a designer walkthrough of using each of them:
    * **Lovable:** Lovable is an AI-powered tool that transforms natural language descriptions into functional web applications; it excels in rapid prototyping, allowing non-technical team members to create functional prototypes and validate ideas quickly.
    * **Replit:** Replit is a cloud-based coding platform that supports over 50 programming languages and offers AI-assisted code generation and is particularly useful for beginners and educators, offering a seamless coding experience without local setup. It has examples of successful bigger projects as well.
    * **V0:** is a powerful tool for generating high-quality UIs and code, with a focus on React and Next.js development. V0 excels in creating complex UIs and integrating with modern web development frameworks.
    * **Bolt:** Bolt is an AI-powered app builder that allows you to create full-stack applications using natural language prompts and is particularly useful for quickly creating and testing functional prototypes without extensive coding knowledge.
* **Cursor:** Our recommended modern IDE for most languages and frameworks. It might take some time for the developers to get used to it and know how to control the AI inside the project. The team can find recommendations of guiding prompts online, or give us a call and we can share our hacks and successful usage patterns.
* **Designer System UI tools:** can be used to create entire user interfaces. Wireframing with these is a good place to start from:
    * **Polymet:** AI-powered tool for creating well-designed user interfaces and prototypes with Figma integration.
    * **UX Pilot:** Streamline UI design process with AI-generated layouts and customizable themes.
    * **Subframe:** Visual UI editor offering real-time collaboration and component libraries for designers and developers.
* **Landing page tools:** by far the best way to get a landing page up quickly. With tons of interactive/animation elements and also they have out of the box templates to build from:
    * **Framer:** Versatile platform for creating visually stunning and conversion-optimized landing pages with extensive templates.
    * **Relume:** Comprehensive suite for rapid website design, featuring AI-powered Site Builder and Figma integration.
    * **Dora:** AI-driven tool for building landing pages quickly using text prompts and customizable design presets.

## Selecting and Using Models

### General-Purpose Language Models:

* **OpenAI, Anthropic:** The most powerful models for tasks like summarization, Q&A, and content generation.
* **Azure OpenAI Service & Amazon Bedrock:** Cloud-based services offering secure, enterprise-ready access to powerful language models.
* **Azure OpenAI Service:** Integrates models like GPT-4o and o1 directly into Microsoft’s Azure ecosystem, with strong isolation of customer data.
* **Amazon Bedrock:** Provides a single API to access multiple foundation models from various providers, supports custom fine-tuning with private data, and ensures data isolation and encryption.
* Choosing between providers can depend on factors like existing cloud infrastructure, compliance requirements (e.g., HIPAA, GDPR), pricing, and the need for specific capabilities (e.g., code generation, custom agents, or private model fine-tuning).

### Voice and Image Generation Tools:

* **ElevenLabs:** Powerful audio tools, like high-quality voice synthesis for adding spoken responses. Expensive, best for creating high quality content for an audience than one-to-one personalized interactions.
* **Play.ht:** ElevenLabs quality competitor. Fast, natural-sounding text-to-speech generation with a vast library of AI voices and languages, making it straightforward to create realistic voice content with emotion and custom voice cloning capabilities.
* **Amazon Polly (Neural Voice):** Delivers enterprise-grade text-to-speech with high availability, low latency, and SSML support, making it a reliable choice for production applications requiring real-time voice synthesis at scale. Not as human-like as ElevenLabs but can be used in many use cases.
* **Azure Text-to-Speech:** Provides enterprise-grade neural voice synthesis with its API delivering precise phoneme-level timestamps in the response, enabling perfect audio-text synchronization and detailed speech analysis capabilities.
* **Stable Diffusion / Riffusion:** Open-source AI models for generating high-quality images or music. Very customizable with many models and checkpoints available, allowing to create APIs for real-time image generation.
* **Midjourney:** A cloud-based image generation service that allows users to create high-quality images using AI. Probably the best image generation tool for creating realistic images, but cannot be used as an API.

### Voice and Image Recognition Tools:

* **Deepgram:** Provides lightning-fast, highly accurate speech-to-text transcription through advanced AI models, making it easy to transcribe audio and video content with features like speaker diarization and real-time streaming.
* **AssemblyAI:** Delivers state-of-the-art speech-to-text conversion with advanced features like speaker detection and content moderation, enabling developers to easily transform audio and video content into accurate, intelligent transcripts.

### OCR Services:

* **AWS Textract:** Machine learning to extract text, forms, and tables from scanned documents with high accuracy, making it effortless to automate document processing workflows and convert unstructured data into structured formats.
* **Google Cloud Vision OCR:** Superior handwriting recognition capabilities. Exceptional at handling multiple languages and complex layouts.
* **Custom build with Vision Models:** Custom Vision LM-based OCR solutions offer superior understanding of document context and relationships between elements while handling complex layouts more naturally than traditional OCR services like Textract, though they typically operate at higher latency and cost.

### General AI Models:

* **Hugging Face:** A platform for sharing and discovering AI models, including a wide range of language models, image models, and audio models. Great for finding open-source models and for quick prototyping.
* **Replicate:** A platform for deploying and running AI models, including a wide range of language models, image models, and audio models. Great for deploying models as an API. Like Hugging Face, a great place to find open-source models.

### Agentic Research Tools

* **Third-Party Services:**
    * **Perplexity:** A high-quality research and information retrieval service with powerful capabilities but lower rate limits. Integrates multiple AI models and provides real-time web search.
    * **Brave Search API:** Offers higher rate limits than Perplexity but with lower quality results. Suitable for applications requiring frequent queries and basic web search functionality.
    * **Tavily:** Great to augment AI agents with an intelligent search through AI by processing and summarizing web content in real-time, providing developers with a reliable API for context-aware search results that go beyond simple keyword matching.
    * **SerpAPI:** Another good option for Tavily web search for AI Agents. While more traditional, it offers structured search results from multiple engines with reliable parsing and real-time data.
* **Open Source Alternatives:**
    * **Perplexica:** A self-hosted alternative that combines open-source LLMs through Ollama. Provides multiple search modes and local file search capabilities while maintaining privacy.
    * **SearxNG:** A privacy-focused federated metasearch engine supporting over 70 search engines. Features categorical searching and extensive customization options, with built-in Tor network compatibility.
* When choosing between these tools, we consider factors like:
    * Required query volume and rate limits.
    * Quality vs. quantity of results.
    * Privacy and data handling requirements.
    * Need for customization and self-hosting.
* These tools can be particularly valuable when building autonomous agents or research-intensive applications that require real-time information retrieval capabilities.

## Data Handling and Vector Databases

### Embedding Storage and Retrieval:

* **PostgreSQL with pgvector:** A PostgreSQL extension that allows you to store vector embeddings within your database, enabling semantic search and advanced similarity queries without introducing a separate vector database.
* **Pinecone:** A powerful vector database that makes it simple to build and scale AI applications with similarity search, enabling fast and accurate retrieval of high-dimensional data.
* **Supabase:** Provides vector storage and retrieval alongside a suite of other database functionalities, offering a customizable solution for projects requiring both vector and traditional database operations.

### Graph Databases:

* When choosing a graph database for AI solutions, consider factors such as specific AI use case requirements (e.g., real-time processing, GraphRAG) and scalability needs and integration capabilities with existing AI/ML tools. Performance for complex graph queries and analytics will also be part of the decision making process. Support for vector operations and similarity search might be needed from your workload and solution architecture.
* **Neo4j:** Often considered the gold standard in graph databases, Neo4j provides a powerful graph platform with its native graph storage and processing capabilities. It's optimized for AI and machine learning tasks, especially with its graph data science library and Cypher query language. Neo4j's integration with AI models like those for GraphRAG (Retrieval-Augmented Generation) makes it a top choice for building AI-driven applications.
* **Amazon Neptune:** As a fully managed service by AWS, Amazon Neptune supports both property graph and RDF models, making it versatile for AI applications needing to handle diverse data types. It's optimized for high-performance graph queries, which is beneficial for AI tasks like fraud detection and network security.
* **FalkorDB:** Is specifically designed for AI applications, offering ultra-low latency for real-time AI and knowledge retrieval. Optimized for GraphRAG (Retrieval-Augmented Generation) applications and has a scalable multi-graph architecture for enterprise-level AI workloads. It has a unique use of sparse matrices and linear algebra for graph querying.

## Observability, Testing, and Iteration

### Logging and Debugging:

* **Helicone / Langfuse:** Tools for logging and monitoring LLM interactions. They provide insights into usage patterns, help identify issues, and support continuous model improvement.
* **Sentry:** Exception tracking and performance monitoring with detailed error context.
* **Datadog:** Comprehensive observability platform with powerful APM, logs, and metrics visualization.

### Prompt Evaluation and Optimization:

* **Promptfoo:** Enables structured testing and benchmarking of different prompts or models. This allows systematic improvements to both model performance and user experience over time.
* **Agenta:** Open-source LLM developer platform that has end-to-end tools for the entire LLMOps workflow. Simplifies the deployment and testing of LLM-powered applications by providing a collaborative platform for prompt engineering, model evaluation, and A/B testing of different prompts and configurations in production.
* **DSPy:** A user-friendly framework that helps you build AI systems without writing complex prompts. It automatically improves the prompts by learning what works best using evals, letting you focus on creating modular AI applications using simple Python code rather than struggling with prompt engineering.

## Application Frameworks and Development Stacks

### Frontend Frameworks:

* **Next.js or Vite SPA + API Server:** Modern, performant JavaScript frameworks that support rapid development of both frontend and backend capabilities.
* **TypeScript:** Adds static typing to JavaScript, dramatically improving code quality and developer experience.
* **Zod:** Runtime type validation that works great with TypeScript, essential for form validation and API type safety.
* **TanStack:** TypeScript-first solutions for common web development challenges like data fetching, tables, and routing, all while prioritizing performance and developer experience through powerful APIs that give developers complete control over the presentation layer.
    * **TanStack Query:** Makes data fetching, caching, and state management much simpler.
* **Zustand:** Is a brilliantly simple and powerful state management library that ditches boilerplate code in favor of a straightforward, hook-based approach to handling global state in React applications.
* **Tailwind / Shadcn UI:** Utility-first CSS frameworks and component libraries for streamlined, consistent UI design.
* **Clerk:** Simplifies authentication and user management by providing pre-built components and hooks that handle everything from social logins to user profiles, making it exceptionally easy to add secure authentication to modern web applications.
* **Axios:** Clean, Promise-based HTTP client for making API requests.
* **Playwright:** End-to-end testing by offering reliable, cross-browser automation with built-in auto-waiting, powerful debugging tools, and an intuitive API that makes writing and maintaining tests a breeze.
* **Luxon:** A powerful, modern, and friendly wrapper for JavaScript dates and times.

### API and Data Layers:

* **tRPC / GraphQL / REST:** Options for structuring and organizing your APIs. The choice depends on complexity, team experience, and client needs.
* **Prisma / Drizzle / SQLAlchemy:** ORMs that simplify database queries, schema management, and migrations.
* **Redis for data caching:** In-memory data store that excels at caching, real-time analytics, and message queuing, making it an invaluable tool for modern applications that demand high performance.
* **Socket.IO:** Enables real-time, bidirectional communication between web clients and servers, making it effortless to build interactive features like live chat with audio and video or avatars and instant notifications.

### Python Backend:

* **FastAPI:** A performant, modern framework for building APIs in Python. It pairs well with SQLAlchemy and can be a good fit if you prefer Python’s ecosystem for data and AI work.
* **Pydantic:** Data validation and settings management library. Great for validating data and creating data models.
* **SQLAlchemy:** A powerful SQL toolkit and Object-Relational Mapping (ORM) library for Python. It provides a full suite of well-known enterprise-level persistence patterns, designed for efficient and high-performing database access.
* **Alembic:** A database migrations tool for SQLAlchemy. Allows managing database schema changes in a version-controlled manner, ensuring that database schemas evolve predictably and consistently.
* **uv:** A modern, fast, and secure package manager for Python. It provides a simple and consistent interface for managing dependencies, making it easier to install, update, and remove packages. Faster and easier than poetry, and more robust than pip.
* **ruff:** A modern Python code linter and formatter. It provides a fast and configurable linting solution, helping developers write clean and consistent code. It's great when integrated with VS Code / Cursor.

## Collaboration, Productivity, and Design Tools

* **GitHub:** A widely-used platform for version control, code collaboration, and continuous integration/delivery, allowing teams to work efficiently and maintain code quality.
* **Cursor:** An AI-enhanced code editor that can improve developer productivity, assist with refactoring, and suggest code snippets. Probably the tool from this list that will mostly increase a developer's productivity.
* **Linear:** A project management tool focused on speed and efficiency, helping teams stay organized and prioritize tasks in an agile environment.
* **Figma:** A collaborative design and prototyping tool for creating and refining user interfaces, ensuring developers and designers work closely together to deliver cohesive user experiences.
* **Microsoft Clarity:** Provides free website analytics with heatmaps, session recordings, and user behavior insights, helping developers and marketers understand exactly how users interact with their sites through visual evidence rather than just numbers.

**Note:** Given the pace at which AI technologies advance, these recommendations will likely evolve over time. It’s essential to remain agile—regularly evaluating new tools, models, and best practices—to ensure you’re always using the most effective solutions.