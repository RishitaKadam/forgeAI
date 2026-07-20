from fastapi import APIRouter, HTTPException
from fastapi import Depends
from app.services.session import get_session_id
from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_summary_prompt

router = APIRouter(tags=["Executive Summary"])


@router.get("/summary/{doc_id}")
def executive_summary(doc_id: str):
    meta = get_document(doc_id)
    if not meta:
        raise HTTPException(404, "Document not found.")

    text = get_document_text(doc_id)[:18000]
    if not text.strip():
        raise HTTPException(400, "This document has no extractable text.")

    prompt = build_summary_prompt(text)
    summary = generate_answer(prompt)

    return {"doc_id": doc_id, "filename": meta["filename"], "summary": summary}
