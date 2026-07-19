import os

from dotenv import load_dotenv
from google import genai

from app.config import GEMINI_MODEL

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_answer(prompt: str, temperature: float = 0.2, max_tokens: int = 4096) -> str:
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "temperature": temperature,
            "max_output_tokens": max_tokens,
        },
    )
    return response.text or ""
