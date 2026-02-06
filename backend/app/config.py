import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./taskflow.db"
    cors_origins: list[str] = ["http://localhost:5173"]


# Allow SEED_DB environment variable to override database for seeding
if seed_db := os.getenv("SEED_DB"):
    settings = Settings(database_url=f"sqlite+aiosqlite:///./{seed_db}")
else:
    settings = Settings()
