from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import chat

router = APIRouter(tags=["Chat"])


class ChatRequest(BaseModel):
    question: str
    doc_id: Optional[str] = None


@router.post("/chat")
def ask_question(request: ChatRequest):
    return chat(request.question, doc_id=request.doc_id)
