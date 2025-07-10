# backend/scripts/check_db.py

import sys
import os
import argparse
from sqlalchemy.orm import Session

# Add the project root to the Python path to allow importing 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.models import Paper

def check_for_paper(search_term: str):
    """
    Searches the database for a paper with a title containing the search term.
    """
    db: Session = SessionLocal()
    print(f"\n🔍 Searching for papers with titles containing: '{search_term}'")
    
    try:
        # Using ilike for case-insensitive search
        papers = db.query(Paper).filter(Paper.title.ilike(f"%{search_term}%")).all()
        
        if not papers:
            print("\n❌ No matching papers found in the database.")
            return
            
        print(f"\n✅ Found {len(papers)} matching paper(s):")
        print("-" * 40)
        for paper in papers:
            print(f"  ID: {paper.arxiv_id}")
            print(f"  Date: {paper.submitted_date}")
            print(f"  Title: {paper.title[:80]}...") # Print first 80 chars
            print("-" * 40)
            
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="A helper script to check for papers in the SQLite database."
    )
    parser.add_argument(
        "search_term", 
        type=str, 
        help="The text to search for in paper titles."
    )
    
    args = parser.parse_args()
    check_for_paper(args.search_term)