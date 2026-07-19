from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FRONTEND_ORIGINS
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router
from app.routes.search import router as search_router
from app.routes.summary import router as summary_router
from app.routes.dashboard import router as dashboard_router
from app.routes.formulas import router as formulas_router
from app.routes.graph import router as graph_router
from app.routes.compare import router as compare_router
from app.routes.report import router as report_router

app = FastAPI(
    title="ForgeAI API",
    description="AI Engineering Intelligence Platform",
    version="2.0.0",
)

# Enable CORS - allows your deployed frontend (Vercel/Netlify) plus localhost dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_origin_regex=r"https://.*\.(vercel|netlify)\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Welcome to ForgeAI API 🚀"}


@app.get("/health")
def health():
    return {"status": "Server Running", "success": True}


app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(search_router)
app.include_router(summary_router)
app.include_router(dashboard_router)
app.include_router(formulas_router)
app.include_router(graph_router)
app.include_router(compare_router)
app.include_router(report_router)
