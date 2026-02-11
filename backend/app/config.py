import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./taskflow.db"
    backend_port: int = 8000
    frontend_port: int = 5173

    @property
    def cors_origins(self) -> list[str]:
        return [f"http://localhost:{self.frontend_port}"]


# Allow SEED_DB environment variable to override database for seeding
if seed_db := os.getenv("SEED_DB"):
    settings = Settings(database_url=f"sqlite+aiosqlite:///./{seed_db}")
else:
    settings = Settings()
