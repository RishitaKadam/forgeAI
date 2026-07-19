"""
Lightweight JSON-backed document registry.
Keeps track of every uploaded PDF (metadata) plus its full extracted text,
so every feature (dashboard, summary, formulas, graph, compare, report)
can reuse the same source of truth without re-parsing the PDF.
"""
import json
import os
import threading

STORE_DIR = "storage"
DOCS_FILE = os.path.join(STORE_DIR, "documents.json")
TEXTS_DIR = os.path.join(STORE_DIR, "texts")

os.makedirs(TEXTS_DIR, exist_ok=True)
_lock = threading.Lock()


def _read():
    if not os.path.exists(DOCS_FILE):
        return {}
    with open(DOCS_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}


def _write(data):
    with open(DOCS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def save_document(doc_id: str, meta: dict, full_text: str):
    with _lock:
        data = _read()
        data[doc_id] = meta
        _write(data)

    with open(os.path.join(TEXTS_DIR, f"{doc_id}.txt"), "w", encoding="utf-8") as f:
        f.write(full_text)


def list_documents():
    return list(_read().values())


def get_document(doc_id: str):
    return _read().get(doc_id)


def get_document_text(doc_id: str) -> str:
    path = os.path.join(TEXTS_DIR, f"{doc_id}.txt")
    if not os.path.exists(path):
        return ""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def delete_document(doc_id: str):
    with _lock:
        data = _read()
        data.pop(doc_id, None)
        _write(data)

    path = os.path.join(TEXTS_DIR, f"{doc_id}.txt")
    if os.path.exists(path):
        os.remove(path)
