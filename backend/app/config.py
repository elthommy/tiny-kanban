"""
Application configuration using Pydantic Settings.

This module uses pydantic-settings to manage configuration with automatic
environment variable loading and validation.
"""

import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with automatic environment variable loading.

    Pydantic Settings loads configuration values in the following priority order:
    1. Arguments passed to Settings() constructor (highest priority)
    2. Environment variables (e.g., BACKEND_PORT=8001)
    3. Variables from .env file in the current working directory
    4. Default field values (lowest priority)

    Usage:
        Create a .env file in the backend/ directory:
            BACKEND_PORT=8001
            FRONTEND_PORT=5173
            DATABASE_URL=sqlite+aiosqlite:///./taskflow.db

        Values are automatically loaded when Settings() is instantiated.
        Environment variable names match field names in uppercase.
    """

    model_config = SettingsConfigDict(
        env_file=".env",  # Load from .env file in current working directory
        env_file_encoding="utf-8",  # UTF-8 encoding for .env file
    )

    # Database connection string for SQLAlchemy async engine
    database_url: str = "sqlite+aiosqlite:///./taskflow.db"

    # Backend server port for uvicorn
    backend_port: int = 8000

    # Frontend dev server port (used for CORS configuration)
    frontend_port: int = 5173

    @property
    def cors_origins(self) -> list[str]:
        """CORS allowed origins based on frontend port."""
        return [f"http://localhost:{self.frontend_port}"]


# Allow SEED_DB environment variable to override database for seeding
if seed_db := os.getenv("SEED_DB"):
    settings = Settings(database_url=f"sqlite+aiosqlite:///./{seed_db}")
else:
    settings = Settings()
