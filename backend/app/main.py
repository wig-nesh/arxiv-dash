from fastapi import FastAPI
from app.api.api_v1.api import api_router
from app.db.session import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="arXiv Dashboard API",
    description="An API to search and save papers from arXiv.",
    version="0.1.0",
)

@app.on_event("startup")
def on_startup():
    """
    This function runs when the FastAPI application starts up.
    It ensures the database and tables are created.
    """
    print("Running startup tasks...")
    create_db_and_tables()
    print("Startup tasks complete. Database is ready.")

# Define the origins that are allowed to make requests
origins = [
    "http://localhost:5173", # The default Vite dev server URL
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the arXiv Dashboard API :)"}

app.include_router(api_router, prefix="/api")