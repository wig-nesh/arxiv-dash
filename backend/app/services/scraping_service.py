# backend/app/services/scraping_service.py

from datetime import date, datetime
from typing import List, Dict, Any
import arxivscraper
from sqlalchemy.orm import Session

from app.db.models import Paper

def run_scrape(db: Session, categories: List[str], start_date: str, end_date: str) -> List[Paper]:
    """
    Performs an on-demand scrape and stores new papers in the database.
    
    Args:
        db: The database session.
        categories: A list of arXiv category codes (e.g., ['cs.AI', 'cs.LG']).
        start_date: The start date in 'YYYY-MM-DD' format.
        end_date: The end date in 'YYYY-MM-DD' format.
        
    Returns:
        A list of the newly added Paper objects.
    """
    
    print(f"Starting on-demand scrape for categories {categories} from {start_date} to {end_date}")
    
    scraper = arxivscraper.Scraper(
        category='cs', # This is a broad filter; we'll refine with the `filters` dict
        date_from=start_date,
        date_until=end_date,
        t=10,
        filters={'categories': categories}
    )
    
    output = scraper.scrape()
    print(f"Scraper found {len(output)} papers.")
    
    newly_added_papers = []
    
    batch_counter = 0
    batch_size = 500

    for paper_data in output:
        paper_arxiv_id = paper_data['id']
        
        # Check if paper already exists
        existing_paper = db.query(Paper).filter(Paper.arxiv_id == paper_arxiv_id).first()
        if existing_paper:
            continue
            
        # Parse and prepare data
        submitted_date_obj = datetime.strptime(paper_data['created'], '%Y-%m-%d').date()
        cats_data = paper_data['categories']
        cats_list = cats_data.split() if isinstance(cats_data, str) else cats_data
        categories_str = ", ".join(cats_list)

        clean_title = paper_data['title'].strip().replace('\n', ' ')
        clean_abstract = paper_data['abstract'].strip().replace('\n', ' ')
        
        # Create new Paper object
        new_paper = Paper(
            arxiv_id=paper_arxiv_id,
            title=clean_title.capitalize(),
            abstract=clean_abstract.capitalize(),
            authors=", ".join(paper_data['authors']),
            categories=categories_str,
            pdf_url=paper_data['url'],
            submitted_date=submitted_date_obj
        )
        
        db.add(new_paper)
        newly_added_papers.append(new_paper)
        batch_counter += 1

        if batch_counter >= batch_size:
            print(f"Committing batch of {batch_counter} papers...")
            db.commit()
            batch_counter = 0

    if batch_counter > 0:
        print(f"Committing final batch of {batch_counter} papers...")
        db.commit()

    # Commit all new papers to the database
    if newly_added_papers:
        print(f"Committing {len(newly_added_papers)} new papers to the database.")
        db.commit()
        # Refresh objects to get their newly assigned DB IDs
        for paper in newly_added_papers:
            db.refresh(paper)
    else:
        print("No new papers to add.")
        
    return newly_added_papers