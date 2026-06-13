# Structured AI Knowledge Builder
Architecture for information, not just text.

## Demo Video
[Watch Demo](https://www.youtube.com/watch?v=XnnfZWsPxfo)

## The Problem
Most AI tools output "walls of text"—unorganized Markdown blocks that are difficult to scan, verify, or reuse. Users spend more time parsing LLM responses into useful formats than actually consuming the knowledge. Standard chat interfaces lack spatial hierarchy and often hallucinate technical references.

## The Solution
The Structured AI Knowledge Builder implements an 8-stage synthesis pipeline that orchestrates raw intent into a Neo-Brutalist Bento Grid. By replacing standard chat with an extraction engine, the application ensures every piece of information has a designated functional home, ranging from layman summaries to cited technical sources.

## Architecture

```
User -> React Frontend -> Express Backend -> MARTA (Azure Foundry IQ + Bing Web Search) -> JSON -> Bento Grid -> PDF Export
```

## MARTA — The Foundry IQ Layer
MARTA (Master Orchestrator Agent) is not an LLM wrapper; it is a search-grounded synthesis engine built on Azure AI Foundry. 

- **Grounding:** Every response is anchored by Bing Web Search. MARTA retrieves live data before generating content.
- **Zero Hallucination:** By enforcing a strict JSON schema and using search-grounded tools, MARTA eliminates fake URLs and fabricated technical definitions.
- **Orchestration:** MARTA independently handles the transformation of complex topics into 10 distinct knowledge modules (layman, definition, how-to, etc.).

## 🤖 GitHub Copilot Usage
Built with GitHub Copilot as the primary development assistant throughout the project.

**Verified Microsoft Learn Achievement:** [Introduction to GitHub Copilot — Completed June 5, 2026](https://learn.microsoft.com/en-us/users/ahteshamlatif-8503/achievements/abqryyh7)

## Features
- **8-Stage Pipeline:** Visualized tracking of the synthesis process from retrieval to formatting.
- **Persona System:** Contextual framing for Student, Dev, Engineer, Kid, Teacher, Business, and the "Donkey" gamified mode.
- **Bento Grid:** Neo-Brutalist high-contrast UI for maximum information density and scannability.
- **Deep Dive:** Interaction pattern allowing users to populate the input field directly from grid items.
- **YouTube Interceptor:** Validates and embeds search-grounded video guides with fallback query support.
- **PDF Export:** High-fidelity server-side PDF generation via Puppeteer.
- **System Cooling:** Token-aware rate limiter protecting API throughput.
- **Schema Guard:** Server-side validation ensuring MARTA's output meets the 10-field requirement.

## Security & Resilience

| Attack Vector | Behavior | Status |
| :--- | :--- | :--- |
| SQL Injection | Converted to educational content | ✅ Safe |
| Prompt Injection | Blocked by Foundry guardrails | ✅ Safe |
| XSS | Converted to educational content | ✅ Safe |

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Node.js, Express, Puppeteer |
| **AI Orchestration** | Azure AI Foundry (MARTA / GPT-4.1-mini) |
| **Grounding** | Bing Web Search API |
| **Language** | TypeScript |

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/structured-ai-knowledge-builder.git
   cd structured-ai-knowledge-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   Create a `.env` file in the root directory.
   ```bash
   cp .env.example .env
   ```

4. **Run the development environment:**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `FOUNDRY_ENDPOINT` | The Azure AI Foundry agent endpoint URL. |
| `AZURE_CLI_AUTH` | The server uses `AzureCliCredential`. Ensure you are logged in via `az login`. |

## Project Structure

```text
root/
├── server.ts
├── src/
│   ├── App.tsx
│   ├── services/
│   │   └── knowledgeService.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── InputSection.tsx
│   │   ├── KnowledgeDisplay.tsx
│   │   ├── KnowledgeCard.tsx
│   │   ├── LoaderSkeleton.tsx
│   │   ├── ProcessChain.tsx
│   │   ├── VideoBentoCard.tsx
│   │   ├── YouTubePlayer.tsx
│   │   └── ErrorBoundary.tsx
│   └── types.ts
├── AGENTS.md
└── .env.example
```

## Hackathon Track
- **Track:** Creative Apps
- **Intelligence:** Foundry IQ (MARTA Orchestrator)
- **Eligibility:** Student Award (Ahtesham Latif — University of the Punjab, IBIT)

## Known Edge Cases & Future Work
- **Unicode/Emoji:** High-density emoji topics may occasionally disrupt server-side PDF font rendering.
- **Timeout Retry:** Implementation of exponential backoff for Azure Foundry cold starts.
- **Web Search Fallback:** Improving the logic for Bing search when primary knowledge nodes return sparse data.
- **Gravity Mode (V2):** Physics-based interaction for Bento Cards to emphasize information "weight."

## License
MIT

---
**Developer:** Ahtesham Latif  
**University:** University of the Punjab (IBIT)
