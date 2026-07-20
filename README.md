\# ForgeAI



\*\*Talk to your engineering PDFs.\*\* ForgeAI is an AI-powered document intelligence platform — upload a manual, datasheet, research paper or report, and chat with it by voice or text, search it semantically, extract formulas, generate executive summaries, compare documents, and produce formal reports, all backed by a real retrieval-augmented generation (RAG) pipeline.





\---



\## What ForgeAI does



Most "chat with your PDF" tools stop at Q\&A. ForgeAI treats a document as something to be \*understood\*, not just searched:



\- Ask questions in plain English (or by voice) and get structured, cited answers grounded in the actual document text — not hallucinated.

\- Get an instant executive summary instead of skimming 40 pages.

\- Automatically extract and explain every formula/equation in a technical document.

\- Visualize how concepts and components in a document relate to each other as a knowledge graph.

\- Compare two documents side by side.

\- Generate a formal report (overview, findings, specs, risks, recommendations) from raw source material.



\## Architecture overview



```

┌────────────┐        HTTPS         ┌──────────────┐

│  Frontend   │ ───────────────────▶│   Backend     │

│  React 19   │ ◀─────────────────── │   FastAPI     │

│  (Vercel)   │        JSON          │  (Render)     │

└────────────┘                      └──────┬───────┘

&#x20;                                           │

&#x20;                    ┌──────────────────────┼──────────────────────┐

&#x20;                    ▼                      ▼                      ▼

&#x20;             ┌─────────────┐      ┌───────────────┐      ┌────────────────┐

&#x20;             │  PDF Parser  │      │  ChromaDB      │      │  Gemini API     │

&#x20;             │  (chunking)  │      │  (vector store)│      │  (embeddings +  │

&#x20;             │              │      │                │      │   generation)   │

&#x20;             └─────────────┘      └───────────────┘      └────────────────┘

```



\*\*Flow for a chat question (RAG pipeline):\*\*

1\. On upload, the PDF is parsed and split into overlapping text chunks.

2\. Each chunk is embedded (Gemini's embedding model) and stored in ChromaDB.

3\. On a question, the question itself is embedded and used to semantically retrieve the most relevant chunks.

4\. Those chunks are inserted into a structured prompt sent to Gemini, along with formatting/behavior instructions (Markdown output, no fabricated answers, page citations).

5\. The answer streams back to the frontend, rendered with proper Markdown, citation badges, and optional text-to-speech.



The other 6 tools (Summary, Formulas, Knowledge Graph, Compare, Report, Dashboard) reuse this same retrieval + prompt pattern, each with a purpose-built prompt template.



\## Features



| Feature | Description |

|---|---|

| 🧠 AI Chat | Ask questions by text or voice; answers are Markdown-formatted with page-level citations. Voice output reads answers back aloud. |

| 🔍 Smart Search | Semantic search across the document with exact page navigation. |

| 📄 Executive Summary | A structured, board-ready summary generated on demand. |

| Σ Formula Extractor | Finds every equation/formula in the document and explains each variable. |

| 🕸️ Knowledge Graph | Extracts concepts, components and processes and visualizes how they relate. |

| ⚖️ Compare PDFs | Structured side-by-side comparison of two documents. |

| 📊 Engineering Dashboard | Instant stats — page count, reading time, top terms, detected specs. |

| 📝 Report Generator | Turns a raw document into a formal report (overview, findings, risks, recommendations). |

| 🎙️ Voice In/Out | Native browser speech recognition + synthesis — no extra API cost. |



\## Tech stack



\*\*Frontend:\*\* React 19, React Router, Tailwind CSS, Vite, `react-markdown` + `remark-gfm`, `lucide-react`

\*\*Backend:\*\* FastAPI, Python 3.11

\*\*AI / Retrieval:\*\* Google Gemini (generation + embeddings), ChromaDB (vector store), LangChain (`langchain-chroma`, `langchain-community`)

\*\*Deployment:\*\* Vercel (frontend), Render (backend)



\## Setup instructions



\### Prerequisites

\- Node.js 18+

\- Python 3.11

\- A \[Gemini API key](https://aistudio.google.com/apikey)



\### 1. Clone the repo

```bash

git clone https://github.com/RishitaKadam/forgeAI.git

cd forgeAI

```



\### 2. Backend setup

```bash

cd backend

python -m venv venv

venv\\Scripts\\activate        # Windows

\# source venv/bin/activate   # macOS/Linux



pip install -r requirements.txt

copy .env.example .env       # Windows

\# cp .env.example .env       # macOS/Linux

```

Open `backend/.env` and add your real key:

```

GEMINI\_API\_KEY=your\_key\_here

GEMINI\_MODEL=gemini-3.5-flash

FRONTEND\_ORIGINS=http://localhost:5173

MAX\_UPLOAD\_MB=30

```

Run it:

```bash

uvicorn app.main:app --reload

```

Confirm it's up at `http://127.0.0.1:8000/health`.



\### 3. Frontend setup

In a second terminal:

```bash

cd frontend

npm install

npm run dev

```

Open `http://localhost:5173`, upload a PDF, and start chatting.



\### 4. Deploying to production

See \[`DEPLOY.md`](./DEPLOY.md) for the full walkthrough — Render for the backend, Vercel for the frontend, both auto-deploying on every `git push`.



\---



\## Putting this project on GitHub



If you haven't pushed it yet:



```bash

cd forgeAI

git init

git add .

git commit -m "Initial commit"

git branch -M main

git remote add origin https://github.com/RishitaKadam/forgeAI.git

git push -u origin main

```



If the repo already exists and you're just adding this README:

```bash

\# put this file at the root of your repo as README.md

git add README.md

git commit -m "Add project README"

git push

```



GitHub automatically renders `README.md` on your repo's homepage — no extra setup needed. To make the repo look complete, also make sure these exist at the root (they likely already do from earlier setup):

\- `.gitignore` in both `backend/` and `frontend/` (keeps `.env`, `venv/`, `node\_modules/` out of the repo)

\- `backend/.env.example` (placeholders only, never a real key)

\- `DEPLOY.md` (deployment guide)



\## License



Add a license if you want others to be able to reuse this (e.g. MIT) — GitHub can generate one for you when creating the repo, or add a `LICENSE` file manually.

