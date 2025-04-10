import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    STAGE: str = os.getenv("ENV", "development")
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    DATABASE_CONNECTION_STRING: str
    FRONTEND_URL: str

    model_config = SettingsConfigDict(env_file=f".env.{STAGE}" if os.path.exists(f".env.{STAGE}") else ".env")
    
@lru_cache
def get_settings() -> Settings:
    return Settings()