# backend/app/api/api_v1/endpoints/scrape.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.schemas.scrape import ScrapeRequest
from app.schemas.paper import Paper as PaperSchema # Use an alias to avoid name conflict
from app.services import scraping_service
from app.api.api_v1.endpoints.papers import get_db # Reuse our get_db dependency

router = APIRouter()

@router.post("/scrape/", response_model=List[PaperSchema])
def trigger_scrape(
    scrape_request: ScrapeRequest,
    db: Session = Depends(get_db)
):
    """
    Triggers an on-demand scrape of arXiv with the specified parameters.
    Returns the list of newly found and stored papers.
    """
    new_papers = scraping_service.run_scrape(
        db=db,
        categories=scrape_request.categories,
        start_date=scrape_request.start_date,
        end_date=scrape_request.end_date
    )
    return new_papers