from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_compare_prompt

router = APIRouter(tags=["Compare PDFs"])


class CompareRequest(BaseModel):
    doc_id_a: str
    doc_id_b: str


@router.post("/compare")
def compare_documents(req: CompareRequest):
    meta_a = get_document(req.doc_id_a)
    meta_b = get_document(req.doc_id_b)

    if not meta_a or not meta_b:
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
