from fastapi import APIRouter, HTTPException

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_report_prompt

router = APIRouter(tags=["Report Generator"])


@router.get("/report/{doc_id}")
def generate_report(doc_id: str):
    meta = get_document(doc_id)
    if not meta:
        raise HTTPException(404, "Document not found.")

    text = get_document_text(doc_id)[:18000]
    prompt = build_report_prompt(meta["filename"], text)
    report = generate_answer(prompt)

    return {"doc_id": doc_id, "filename": meta["filename"], "report": report}
