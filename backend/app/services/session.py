from fastapi import Header, HTTPException


def get_session_id(x_session_id: str | None = Header(default=None)) -> str:
    if not x_session_id:
        raise HTTPException(400, "Missing session identifier.")
    return x_session_id