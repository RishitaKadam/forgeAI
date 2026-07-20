import os
import time

from dotenv import load_dotenv
from google import genai

from app.config import GEMINI_MODEL

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MAX_RETRIES = 4
RETRYABLE_MARKERS = ("503", "UNAVAILABLE", "429", "RESOURCE_EXHAUSTED")


def generate_answer(prompt: str, temperature: float = 0.2, max_tokens: int = 4096) -> str:
    delay = 3
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )
            return response.text or ""
        except Exception as e:
            is_retryable = any(marker in str(e) for marker in RETRYABLE_MARKERS)
            if is_retryable and attempt < MAX_RETRIES - 1:
                time.sleep(delay)
                delay = min(delay * 2, 20)
                continue
            raise

    return ""