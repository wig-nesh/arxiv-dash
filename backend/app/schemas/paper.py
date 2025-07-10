from pydantic import BaseModel
from datetime import date
from typing import List

# This is our main Pydantic model for a Paper.
# It will be used for reading data from the API (responses).
class Paper(BaseModel):
    id: int
    arxiv_id: str
    title: str
    abstract: str
    authors: str  # We'll handle splitting on the frontend
    categories: str # We'll handle splitting on the frontend
    pdf_url: str
    submitted_date: date

    # This is a Pydantic configuration class.
    # 'orm_mode = True' tells Pydantic to read the data even if it
    # is not a dict, but an ORM model (like our SQLAlchemy Paper model).
    class Config:
        orm_mode = True



# Create a new schema for the paginated response
class PaperPage(BaseModel):
    total_count: int
    papers: List[Paper]