import re

from fastapi import APIRouter, HTTPException, Depends

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_formula_prompt
from app.services.session import get_session_id

router = APIRouter(tags=["Formula Extractor"])

FORMULA_PATTERN = re.compile(
    r"[A-Za-zΑ-Ωα-ω0-9_]+\s*=\s*[^=\n]{2,80}|[∑∫√±≤≥≠≈π][^\n]{0,80}"
)


@router.get("/formulas/{doc_id}")
def formula_extractor(doc_id: str, session_id: str = Depends(get_session_id)):
    meta = get_document(doc_id)
    if not meta or meta.get("session_id") != session_id:
        raise HTTPException(404, "Document not found.")

    text = get_document_text(doc_id)

    candidates, seen = [], set()
    for line in text.splitlines():
        line = line.strip()
        if not line or len(line) > 120:
            continue
        if FORMULA_PATTERN.search(line):
            key = line.lower()
            if key not in seen:
                seen.add(key)
                candidates.append(line)
        if len(candidates) >= 40:
            break

    explanation = ""
    if candidates:
        prompt = build_formula_prompt(candidates[:25])
        explanation = generate_answer(prompt)

    return {
        "doc_id": doc_id,
        "filename": meta["filename"],
        "formulas": candidates,
        "explanation": explanation,
    }