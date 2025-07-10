from sqlalchemy.orm import Session
from typing import List, Optional

from app.db import models
from app.schemas import paper as paper_schema

def get_papers(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[models.Paper]:
    """
    Retrieve papers from the database with pagination and optional search.
    """
    query = db.query(models.Paper)

    if search:
        # Simple search across title and abstract
        search_term = f"%{search}%"
        query = query.filter(
            models.Paper.title.ilike(search_term) | models.Paper.abstract.ilike(search_term)
        )

    # We order by the most recent papers first
    papers = query.order_by(models.Paper.submitted_date.desc()).offset(skip).limit(limit).all()
    return papers