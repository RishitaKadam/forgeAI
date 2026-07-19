import os
from langchain_core.embeddings import Embeddings
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
EMBED_MODEL = "gemini-embedding-001"


class GeminiEmbeddings(Embeddings):
    def embed_documents(self, texts):
        result = client.models.embed_content(model=EMBED_MODEL, contents=texts)
        return [e.values for e in result.embeddings]

    def embed_query(self, text):
        result = client.models.embed_content(model=EMBED_MODEL, contents=[text])
        return result.embeddings[0].values


_embedding_model = GeminiEmbeddings()


def get_embedding_model():
    return _embedding_model