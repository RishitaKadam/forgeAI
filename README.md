# ForgeAI

> AI-powered Engineering Document Intelligence Platform built using FastAPI, React, Gemini, ChromaDB and Retrieval-Augmented Generation (RAG).

ForgeAI enables engineers, students, and researchers to interact with technical documents through AI. Instead of manually searching hundreds of pages, users can ask questions in natural language, retrieve relevant sections semantically, generate executive summaries, extract formulas, visualize relationships as knowledge graphs, compare documents, and generate structured engineering reports.

---

## Preview

<img width="1536" height="717" alt="image" src="https://github.com/user-attachments/assets/34731b37-434d-44cf-953c-a81c56d09e0d" />


---

# Features

### AI Chat
- Chat with engineering PDFs using natural language
- Voice input and text-to-speech output
- Structured Markdown responses
- Page-level citations for every answer

<img width="1522" height="722" alt="image" src="https://github.com/user-attachments/assets/131eba75-509b-4bf2-bf8c-ff0d3377e5aa" />

---

### Smart Search
- Semantic search powered by vector embeddings
- Exact page navigation
- Retrieves the most relevant document sections instead of keyword matching

---

### Executive Summary
- Generates concise summaries of lengthy technical documents
- Ideal for manuals, datasheets and research papers

<img width="1535" height="726" alt="Screenshot 2026-07-20 130212" src="https://github.com/user-attachments/assets/2e142273-814b-4f5b-8f2b-d38aaffff4db" />

---

### Formula Extractor
- Detects mathematical equations automatically
- Explains every variable
- Describes engineering significance and practical applications

<img width="1536" height="726" alt="Screenshot 2026-07-20 130125" src="https://github.com/user-attachments/assets/08041067-1a7d-4152-8403-5fbaeedbb1a8" />

---

### Knowledge Graph
- Extracts concepts, components and relationships
- Visualizes how entities are connected throughout the document

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/49ec882a-96c8-40ef-87b6-ce6dc7b24e22" />

---

### Engineering Dashboard
- Document statistics
- Reading time estimation
- Frequently occurring engineering terms
- Extracted specifications
  
<img width="1536" height="727" alt="Screenshot 2026-07-20 130008" src="https://github.com/user-attachments/assets/85f6f972-5eac-4e3c-9ead-be95e0278f90" />

---

### Compare PDFs
- Side-by-side comparison of technical documents
- Highlights similarities and differences using AI

---

### AI Report Generator
Generate structured engineering reports including:

- Executive Overview
- Findings
- Technical Specifications
- Risks
- Recommendations

---

# Architecture

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/f1edcf45-03fa-431f-9198-967d65d672f3" />

---

# System Workflow

1. User uploads one or more PDF documents.

2. FastAPI extracts text from the PDF.

3. The document is divided into overlapping chunks.

4. Gemini Embeddings converts every chunk into vector representations.

5. ChromaDB stores those vectors.

6. User asks a question.

7. The query is embedded.

8. Semantic similarity search retrieves the most relevant chunks.

9. Retrieved context is injected into a structured prompt.

10. Gemini generates a grounded answer using only retrieved context.

11. The frontend renders the answer with Markdown formatting, citations and optional voice output.

---

# Tech Stack

## Frontend
- React 19
- Tailwind CSS
- Vite
- React Router
- React Markdown
- Remark GFM
- Lucide React

## Backend
- FastAPI
- Python 3.11

## AI & Retrieval
- Google Gemini
- Gemini Embeddings
- ChromaDB
- LangChain

## Deployment
- Vercel
- Render

---

# Project Structure

```text
ForgeAI
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── chroma_db/
│
├── images/
│
└── README.md
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/RishitaKadam/ForgeAI.git

cd ForgeAI
```

---

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env`

```env
GEMINI_API_KEY=YOUR_API_KEY

GEMINI_MODEL=gemini-3.5-flash

FRONTEND_ORIGINS=http://localhost:5173
```

Run the backend

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

Open

```
http://localhost:5173
```

---

# Future Improvements

- Multi-document reasoning
- OCR support for scanned PDFs
- Authentication
- Conversation history
- Cloud storage integration
- Streaming responses
- Better Knowledge Graph generation
- Larger document support

---

# Lessons Learned

Building ForgeAI provided hands-on experience with:

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Prompt Engineering
- Vector Databases
- FastAPI Backend Development
- React Frontend Development
- Production Deployment
- AI Application Architecture
- Debugging distributed systems
- API integration and optimization

---

# Acknowledgements

This project uses:

- Google Gemini
- ChromaDB
- LangChain
- FastAPI
- React
- Tailwind CSS

---

# License

This project is licensed under the MIT License.
