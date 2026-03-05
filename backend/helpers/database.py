import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load .env variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_POSTGRESQL_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True  # prevents stale connections
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# ------------------------
# FastAPI Dependency
# ------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()