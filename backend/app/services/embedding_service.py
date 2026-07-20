import os
import time
from langchain_core.embeddings import Embeddings
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
EMBED_MODEL = "gemini-embedding-001"
BATCH_SIZE = 20
MAX_RETRIES = 5


def _embed_batch_with_retry(batch):
    delay = 15
    for attempt in range(MAX_RETRIES):
        try:
            result = client.models.embed_content(model=EMBED_MODEL, contents=batch)
            return [e.values for e in result.embeddings]
        except Exception as e:
            is_rate_limit = "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e)
            if is_rate_limit and attempt < MAX_RETRIES - 1:
                time.sleep(delay)
                delay = min(delay * 2, 60)
                continue
            raise


class GeminiEmbeddings(Embeddings):
    def embed_documents(self, texts):
        all_embeddings = []
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i:i + BATCH_SIZE]
            all_embeddings.extend(_embed_batch_with_retry(batch))
            time.sleep(2)
        return all_embeddings

    def embed_query(self, text):
        return _embed_batch_with_retry([text])[0]


_embedding_model = GeminiEmbeddings()


def get_embedding_model():
    return _embedding_model