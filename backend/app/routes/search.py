from typing import Optional

from fastapi import APIRouter, HTTPException, Depends

from app.services.vector_db import search_documents
from app.services.session import get_session_id

router = APIRouter(tags=["Smart Search"])


@router.get("/search")
def smart_search(q: str, doc_id: Optional[str] = None, k: int = 8, session_id: str = Depends(get_session_id)):
    if not q or not q.strip():
        raise HTTPException(400, "Query is required.")

    docs = search_documents(q, session_id=session_id, k=k, doc_id=doc_id)

    results = [
        {
            "source": doc.metadata.get("source", "Uploaded PDF"),
            "page": doc.metadata.get("page"),
            "snippet": doc.page_content[:450],
        }
        for doc in docs
    ]

    return {"query": q, "results": results}