import os
from langchain_core.embeddings import Embeddings
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
EMBED_MODEL = "gemini-embedding-001"
BATCH_SIZE = 90


class GeminiEmbeddings(Embeddings):
    def embed_documents(self, texts):
        all_embeddings = []
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i:i + BATCH_SIZE]
            result = client.models.embed_content(model=EMBED_MODEL, contents=batch)
            all_embeddings.extend(e.values for e in result.embeddings)
        return all_embeddings

    def embed_query(self, text):
        result = client.models.embed_content(model=EMBED_MODEL, contents=[text])
        return result.embeddings[0].values


_embedding_model = GeminiEmbeddings()


def get_embedding_model():
    return _embedding_model