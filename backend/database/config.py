import os
import dotenv
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

if os.getenv("ENV") == "development":
    dotenv_path = '.env.development'
elif os.getenv("ENV") == "production":
    dotenv_path = '.env.production'
else:
    dotenv_path = '.env'
    
dotenv.load_dotenv(dotenv_path)
DATABASE_URL = os.getenv("DATABASE_CONNECTION_STRING")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()