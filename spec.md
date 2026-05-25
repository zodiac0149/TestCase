Project Overview
Build a full-stack AI-powered platform that generates intelligent test cases using user prompts, repository context, uploaded code, API definitions, historical generations, and AI memory embeddings. The platform must help developers automatically generate unit tests, integration tests, API tests, edge-case tests, validation tests, and negative test cases. The system must continuously improve generation quality through feedback loops, embedding memory, and prompt refinement.

Tech Stack
Frontend uses React, Vite, Tailwind CSS, React Router, Axios, and Zustand. Backend uses Node.js, Express.js, MongoDB, Mongoose, and JWT authentication. AI integration is done through the Groq API using an OpenAI-compatible SDK. Vector embeddings are stored in MongoDB.

Core Features
The authentication system must support signup, login, logout, JWT authentication, protected routes, and persistent sessions.

For project management, users must be able to create projects, upload repositories as ZIP files, connect GitHub repositories, view saved generations, and manage project workspaces.

For repository analysis, the backend must scan repository files, detect the frontend framework, detect the backend framework, detect API routes, detect database models, detect services, and generate folder structure summaries. Supported ecosystems are React, Node.js, Express.js, MongoDB, JavaScript, and TypeScript.

For AI test generation, users provide a testing goal, a code snippet or repository, and optional testing instructions. The AI must generate unit tests, integration tests, API tests, edge-case tests, validation tests, mock data, and expected outputs. All generated outputs must be editable, support regeneration, and support export.

For the memory embedding system, the platform must store generated test cases, generate embeddings for each generation, retrieve similar historical generations, and improve future AI outputs through context retrieval.

For the feedback loop, users must be able to approve, reject, rate, and regenerate generations. All feedback must be stored so future prompts can be optimized.

The AI chat assistant must respond to questions such as "explain this test", "generate additional edge cases", "improve assertions", "identify missing tests", and "explain coverage gaps". It must use repository context, previous generations, and embedding retrieval to form its answers.

The export system must support Markdown export, PDF export, JSON export, and copy-to-clipboard.

Frontend Pages
The landing page contains a hero section, a product introduction, a feature showcase, and authentication buttons. Authentication is split into a signup page and a login page. The dashboard displays all user projects, recent generations, project statistics, and empty states. The project workspace contains the repository overview, generated tests, generation form, AI chat panel, export controls, and generation history. The repository analysis view displays detected technologies, detected routes, the folder structure, and an architecture summary.

Backend Architecture
The routes layer is responsible for API routing, middleware usage, and request validation. The controllers layer handles requests and formats responses. The services layer is responsible for AI orchestration, repository analysis, embedding workflows, and test generation logic. The AI engine is responsible for prompt construction, context retrieval, generation refinement, and AI communication.

Database Collections
Users — name, email, password, createdAt.
Projects — userId, projectName, repositoryUrl, repositorySummary, detectedTechnologies, createdAt.
Generations — projectId, generationType, generatedContent, qualityScore, feedback, createdAt.
Embeddings — projectId, embedding, content, metadata.
Chats — projectId, userMessage, assistantMessage, createdAt.
API Endpoints
POST /api/auth/signup — create account.
POST /api/auth/login — log in.
POST /api/projects — create a project.
GET /api/projects — list projects.
GET /api/projects/:id — get project details.
POST /api/repositories/upload — upload a ZIP repository.
POST /api/repositories/github — import a GitHub repository.
POST /api/generate/tests — generate test cases.
POST /api/generate/regenerate — regenerate test cases.
POST /api/chat — project-aware AI assistant.
GET /api/export/markdown/:projectId — Markdown export.
GET /api/export/pdf/:projectId — PDF export.
GET /api/export/json/:projectId — JSON export.
Folder Structure
The frontend root is client/src/ and contains folders for api, components, pages, store, hooks, layouts, routes, and utils. The backend root is server/src/ and contains folders for config, routes, controllers, services, middlewares, models, ai, embeddings, parsing, utils, and validators.

Development Phases
Phase 1 — frontend and backend initialization, MongoDB connection, and authentication system.
Phase 2 — dashboard, project CRUD, and repository upload.
Phase 3 — file scanning, technology detection, and architecture summaries.
Phase 4 — prompt system, AI integration, test generation, and regeneration.
Phase 5 — embedding generation, semantic retrieval, and historical context enhancement.
Phase 6 — AI chat assistant, Markdown export, PDF export, and JSON export.
UI and UX Requirements
The UI must support dark mode, be fully responsive, include loading states and skeleton loaders, include syntax-highlighted code blocks, support editable generated content, and use a clean developer-focused design.

Security Requirements
The application must hash passwords, validate JWT tokens, sanitize uploads, validate repository URLs, secure environment variables, prevent prompt injection, and validate request payloads.

Final Expected Outcome
The completed platform must intelligently understand repositories, generate high-quality test cases, improve generation quality over time, support AI-assisted QA workflows, and scale to support developer productivity workflows. The final application should feel like modern AI developer tooling.