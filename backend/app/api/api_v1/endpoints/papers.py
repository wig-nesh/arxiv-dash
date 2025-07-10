from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.crud import crud_paper
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
    search: Optional[str] = None,
    start_date: Optional[date] = Query(None, description="Format: YYYY-MM-DD"),
    end_date: Optional[date] = Query(None, description="Format: YYYY-MM-DD"),
    # This allows multiple 'category' query params, e.g., ?category=cs.AI&category=cs.LG
    categories: Optional[List[str]] = Query(None, alias="category")
):
    """
    Retrieve papers with advanced filtering.
    """
    papers = crud_paper.get_papers(
        db=db, 
        skip=skip, 
        limit=limit, 
        search=search,
        start_date=start_date,
        end_date=end_date,
        categories=categories
    )
    return papers