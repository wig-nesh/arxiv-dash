from sqlalchemy import Column, Date, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

# The base class for our models to inherit from
Base = declarative_base()


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    arxiv_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(Text, nullable=False)
    authors = Column(Text)  # comma-separated string
    categories = Column(String)  # comma-separated string
    pdf_url = Column(String)
    submitted_date = Column(Date)
