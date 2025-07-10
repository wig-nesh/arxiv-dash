from fastapi import APIRouter
from app.api.api_v1.endpoints import papers
from app.api.api_v1.endpoints import scrape

api_router = APIRouter()
api_router.include_router(papers.router, prefix="/v1", tags=["papers"])
api_router.include_router(scrape.router, prefix="/v1", tags=["scrape"])