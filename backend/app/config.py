from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./taskflow.db"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
