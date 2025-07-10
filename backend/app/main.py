from fastapi import FastAPI
from app.api.api_v1.api import api_router

app = FastAPI(
    title="arXiv Dashboard API",
    description="An API to search and save papers from arXiv.",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the arXiv Dashboard API :)"}

app.include_router(api_router, prefix="/api")