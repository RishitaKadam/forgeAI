from app.services.vector_db import search_documents
from app.services.prompt_service import build_prompt
from app.services.gemini_service import generate_answer


def chat(question: str, doc_id: str | None = None):
    docs = search_documents(question, k=12, doc_id=doc_id)

    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = build_prompt(context=context, question=question)

    answer = generate_answer(prompt)

    return {
        "answer": answer,
        "sources": [
            {
                "source": doc.metadata.get("source", "Uploaded PDF"),
                "page": doc.metadata.get("page"),
            }
            for doc in docs
        ],
    }
