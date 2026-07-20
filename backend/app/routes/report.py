from fastapi import APIRouter, HTTPException, Depends

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_report_prompt
from app.services.session import get_session_id

router = APIRouter(tags=["Report Generator"])


@router.get("/report/{doc_id}")
def generate_report(doc_id: str, session_id: str = Depends(get_session_id)):
    meta = get_document(doc_id)
    if not meta or meta.get("session_id") != session_id:
        raise HTTPException(404, "Document not found.")

    text = get_document_text(doc_id)[:18000]
    prompt = build_report_prompt(meta["filename"], text)
    report = generate_answer(prompt)

    return {"doc_id": doc_id, "filename": meta["filename"], "report": report}