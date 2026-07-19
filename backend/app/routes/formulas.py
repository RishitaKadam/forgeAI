import re

from fastapi import APIRouter, HTTPException

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_formula_prompt

router = APIRouter(tags=["Formula Extractor"])

FORMULA_PATTERN = re.compile(
    r"[A-Za-zΑ-Ωα-ω0-9_]+\s*=\s*[^=\n]{2,80}|[∑∫√±≤≥≠≈π][^\n]{0,80}"
)


@router.get("/formulas/{doc_id}")
def formula_extractor(doc_id: str):
    meta = get_document(doc_id)
    if not meta:
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
