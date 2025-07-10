# backend/app/schemas/scrape.py
from pydantic import BaseModel
from typing import List

class ScrapeRequest(BaseModel):
    categories: List[str]
    start_date: str
    end_date: str