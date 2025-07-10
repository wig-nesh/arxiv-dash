# backend/app/crud/crud_paper.py

from sqlalchemy.orm import Session
from sqlalchemy import or_ # Import the 'or_' function for combining filters
from typing import List, Optional
from datetime import date

from app.db import models

# Note: We don't need to import schemas here anymore
# as we are returning the ORM models directly.

def get_papers(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    categories: Optional[List[str]] = None
) -> List[models.Paper]:
    """
    Retrieve papers from the database with advanced filtering and pagination.
    """
    query = db.query(models.Paper)

    # 1. Filter by search keyword (in title or abstract)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Paper.title.ilike(search_term), 
                models.Paper.abstract.ilike(search_term)
            )
        )

    # 2. Filter by date range
    if start_date:
        query = query.filter(models.Paper.submitted_date >= start_date)
    if end_date:
        query = query.filter(models.Paper.submitted_date <= end_date)

    # 3. Filter by categories
    if categories:
        # We need to find papers where the 'categories' string contains
        # ANY of the provided category codes.
        category_filters = [models.Paper.categories.like(f"%{cat}%") for cat in categories]
        query = query.filter(or_(*category_filters))

    # Order by most recent papers first, then apply pagination
    papers = query.order_by(models.Paper.submitted_date.desc()).offset(skip).limit(limit).all()
    
    return papers