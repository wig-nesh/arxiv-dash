
from fastapi import APIRouter
from app.api.api_v1.endpoints import papers

api_router = APIRouter()
api_router.include_router(papers.router, prefix="/v1", tags=["papers"])