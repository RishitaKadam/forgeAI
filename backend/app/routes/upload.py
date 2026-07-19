import os
import shutil
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import MAX_UPLOAD_MB
from app.services.pdf_service import extract_pages
from app.services.chunk_service import chunk_pages
from app.services.vector_db import create_vector_db, delete_by_doc_id
from app.services.store import save_document, list_documents, get_document, delete_document

router = APIRouter(tags=["Documents"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported.")

    doc_id = uuid.uuid4().hex[:12]
    filepath = os.path.join(UPLOAD_FOLDER, f"{doc_id}.pdf")

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    if size_mb > MAX_UPLOAD_MB:
        os.remove(filepath)
        raise HTTPException(400, f"File too large. Limit is {MAX_UPLOAD_MB}MB.")

    try:
        pages = extract_pages(filepath)
    except Exception:
        os.remove(filepath)
        raise HTTPException(400, "Could not read this PDF. It may be corrupted or scanned as images.")

    full_text = "\n".join(pages)

    page_chunks = chunk_pages(pages)
    chunks = [c for c, _ in page_chunks]
    metadatas = [
        {"source": file.filename, "doc_id": doc_id, "page": page_num}
        for _, page_num in page_chunks
    ]

    if chunks:
        create_vector_db(chunks=chunks, metadatas=metadatas)

    meta = {
        "doc_id": doc_id,
        "filename": file.filename,
        "pages": len(pages),
        "characters": len(full_text),
        "words": len(full_text.split()),
        "chunks": len(chunks),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }

    save_document(doc_id, meta, full_text)

    return {
        "success": True,
        **meta,
        "message": "Document processed and indexed successfully.",
    }


@router.get("/documents")
def get_documents():
    docs = list_documents()
    docs.sort(key=lambda d: d.get("uploaded_at", ""), reverse=True)
    return {"documents": docs}


@router.get("/documents/{doc_id}")
def get_document_meta(doc_id: str):
    doc = get_document(doc_id)
    if not doc:
        raise HTTPException(404, "Document not found.")
    return doc


@router.delete("/documents/{doc_id}")
def remove_document(doc_id: str):
    doc = get_document(doc_id)
    if not doc:
        raise HTTPException(404, "Document not found.")

    delete_document(doc_id)
    delete_by_doc_id(doc_id)

    filepath = os.path.join(UPLOAD_FOLDER, f"{doc_id}.pdf")
    if os.path.exists(filepath):
        os.remove(filepath)

    return {"success": True}
