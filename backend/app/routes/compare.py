from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_compare_prompt
from app.services.session import get_session_id

router = APIRouter(tags=["Compare PDFs"])


class CompareRequest(BaseModel):
    doc_id_a: str
    doc_id_b: str


@router.post("/compare")
def compare_documents(req: CompareRequest, session_id: str = Depends(get_session_id)):
    meta_a = get_document(req.doc_id_a)
    meta_b = get_document(req.doc_id_b)

    if not meta_a or meta_a.get("session_id") != session_id:
        raise HTTPException(404, "One or both documents were not found.")
    if not meta_b or meta_b.get("session_id") != session_id:
        raise HTTPException(404, "One or both documents were not found.")

    text_a = get_document_text(req.doc_id_a)[:9000]
    text_b = get_document_text(req.doc_id_b)[:9000]

    prompt = build_compare_prompt(meta_a["filename"], text_a, meta_b["filename"], text_b)
    result = generate_answer(prompt)

    return {
        "doc_a": meta_a["filename"],
        "doc_b": meta_b["filename"],
        "comparison": result,
    }