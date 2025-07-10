import sys
import os
# We need the 'datetime' object specifically for parsing strings
from datetime import date, timedelta, datetime # <-- MODIFIED THIS LINE

# It adds the parent directory of 'scripts' (which is 'backend') to the Python path.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import arxivscraper
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, create_db_and_tables
from app.db.models import Paper

def scrape_and_store():
    """
    Scrapes arXiv for papers from the last 7 days in cs.LG and cs.AI,
    and stores them in the database, avoiding duplicates.
    """
    db: Session = SessionLocal()

    try:
        # Define scraping parameters
        today = date.today()
        seven_days_ago = today - timedelta(days=7)
        
        categories = ['cs.LG', 'cs.AI', 'stat.ML']
        
        print(f"Scraping from {seven_days_ago.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')} for categories: {categories}")

        scraper = arxivscraper.Scraper(
            category='cs',
            date_from=seven_days_ago.strftime('%Y-%m-%d'),
            date_until=today.strftime('%Y-%m-%d'),
            t=10,
            filters={'categories': categories}
        )
        
        output = scraper.scrape()
        print(f"Found {len(output)} papers.")

        new_papers_count = 0
        for paper_data in output:
            paper_arxiv_id = paper_data['id']

            existing_paper = db.query(Paper).filter(Paper.arxiv_id == paper_arxiv_id).first()
            if existing_paper:
                continue

            # Convert the string date to a Python date object
            submitted_date_obj = datetime.strptime(paper_data['created'], '%Y-%m-%d').date() # <-- MODIFIED THIS LINE

            new_paper = Paper(
                arxiv_id=paper_arxiv_id,
                title=paper_data['title'].strip(),
                abstract=paper_data['abstract'].strip(),
                authors=", ".join(paper_data['authors']),
                categories=", ".join(paper_data['categories']),
                pdf_url=paper_data['url'],
                submitted_date=submitted_date_obj # Use the converted date object here
            )
            
            db.add(new_paper)
            new_papers_count += 1
        
        if new_papers_count > 0:
            print(f"Adding {new_papers_count} new papers to the database...")
            db.commit()
            print("Successfully committed new papers.")
        else:
            print("No new papers to add.")

    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    create_db_and_tables()
    
    print("\nStarting the scraping process...")
    scrape_and_store()
    print("\nScraping process finished.")