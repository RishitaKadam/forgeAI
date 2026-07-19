import json
import re

from fastapi import APIRouter, HTTPException

from app.services.store import get_document, get_document_text
from app.services.gemini_service import generate_answer
from app.services.prompt_service import build_graph_prompt

router = APIRouter(tags=["Knowledge Graph"])


@router.get("/knowledge-graph/{doc_id}")
def knowledge_graph(doc_id: str):
    meta = get_document(doc_id)
    if not meta:
        raise HTTPException(404, "Document not found.")

    text = get_document_text(doc_id)[:14000]
    prompt = build_graph_prompt(text)
    raw = generate_answer(prompt, temperature=0.1)

    cleaned = re.sub(r"^```json|^```|```$", "", raw.strip(), flags=re.MULTILINE).strip()

    try:
        graph = json.loads(cleaned)
        graph.setdefault("nodes", [])
        graph.setdefault("edges", [])
    except Exception:
        graph = {"nodes": [], "edges": []}

    return {"doc_id": doc_id, "filename": meta["filename"], "graph": graph}
