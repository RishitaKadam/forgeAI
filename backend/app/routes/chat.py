from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.services.chat_service import chat
from app.services.session import get_session_id

router = APIRouter(tags=["Chat"])


class ChatRequest(BaseModel):
    question: str
    doc_id: Optional[str] = None


@router.post("/chat")
def ask_question(request: ChatRequest, session_id: str = Depends(get_session_id)):
    return chat(request.question, session_id=session_id, doc_id=request.doc_id)