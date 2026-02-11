import asyncio
import os
from contextlib import asynccontextmanager

from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import archive, board_settings, cards, columns, search, tags


def run_migrations():
    """Run Alembic migrations programmatically."""
    alembic_cfg = Config("alembic.ini")
    # Override database URL from settings
    alembic_cfg.set_main_option(
        "sqlalchemy.url", settings.database_url.replace("sqlite+aiosqlite:", "sqlite:")
    )
    command.upgrade(alembic_cfg, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-run migrations in development (controlled by environment variable)
    if os.getenv("AUTO_MIGRATE", "true").lower() == "true":
        await asyncio.to_thread(run_migrations)

    yield


app = FastAPI(title="tiny-kanban API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(columns.router, prefix="/api")
app.include_router(cards.router, prefix="/api")
app.include_router(tags.router, prefix="/api")
app.include_router(archive.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(board_settings.router, prefix="/api")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.backend_port,
        reload=True,
    )
