# backend/app/crud/crud_paper.py

from sqlalchemy.orm import Session
from sqlalchemy import or_, and_ 
from typing import List, Optional, Dict, Any
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
) -> Dict[str, Any]:
    """
    Retrieve papers from the database with advanced filtering and pagination.
    Returns a dictionary containing the list of papers and the total count.
    """
    query = db.query(models.Paper)

    # 1. Filter by search keyword (in title or abstract)
    if search:
        # Split the search string into individual words
        search_terms = search.split()
        
        # Create a list of filter conditions, one for each word
        # This will find papers where title OR abstract contains the word
        search_filters = []
        for term in search_terms:
            search_filters.append(
                or_(
                    models.Paper.title.ilike(f"%{term}%"),
                    models.Paper.abstract.ilike(f"%{term}%")
                )
            )
        
        # Chain all conditions together with AND
        # This ensures the paper contains ALL the search words
        query = query.filter(and_(*search_filters))

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

    total_count = query.count()  # Get the total count of papers matching the filters

    # Order by most recent papers first, then apply pagination
    papers = query.order_by(models.Paper.submitted_date.desc()).offset(skip).limit(limit).all()
    
    return {
        "total_count": total_count,
        "papers": papers
    }