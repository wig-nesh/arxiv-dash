from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app import crud
from app.schemas import paper
from app.db.session import SessionLocal

router = APIRouter()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/papers/", response_model=List[paper.Paper])
def read_papers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None
):
    """
    Retrieve papers.
    - 'skip' for pagination offset.
    - 'limit' for number of items per page.
    - 'search' to filter by a keyword in title or abstract.
    """
    papers = crud.crud_paper.get_papers(db=db, skip=skip, limit=limit, search=search)
    return papers