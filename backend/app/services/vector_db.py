from langchain_community.vectorstores import Chroma
from app.services.embedding_service import get_embedding_model

DB_PATH = "vectorstore"


def load_vector_db():
    return Chroma(
        persist_directory=DB_PATH,
        embedding_function=get_embedding_model()
    )


def create_vector_db(chunks, metadatas):
    db = Chroma.from_texts(
        texts=chunks,
        embedding=get_embedding_model(),
        metadatas=metadatas,
        persist_directory=DB_PATH
    )
    return db


def search_documents(question, session_id: str, k=8, doc_id: str | None = None):
    db = load_vector_db()

    if doc_id:
        where = {"$and": [{"doc_id": doc_id}, {"session_id": session_id}]}
    else:
        where = {"session_id": session_id}

    docs = db.similarity_search(question, k=k, filter=where)
    return docs


def delete_by_doc_id(doc_id: str):
    db = load_vector_db()
    try:
        db._collection.delete(where={"doc_id": doc_id})
    except Exception:
        pass