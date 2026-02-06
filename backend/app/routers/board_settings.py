from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import BoardSettings
from app.schemas import BoardSettingsOut, BoardSettingsUpdate

router = APIRouter(tags=["board_settings"])


@router.get("/board-settings", response_model=BoardSettingsOut)
async def get_board_settings(db: AsyncSession = Depends(get_db)):
    """Get board settings. Creates default settings if none exist."""
    result = await db.execute(select(BoardSettings))
    settings = result.scalar_one_or_none()

    if not settings:
        # Create default settings
        settings = BoardSettings()
        db.add(settings)
        await db.commit()
        await db.refresh(settings)

    return settings


@router.patch("/board-settings", response_model=BoardSettingsOut)
async def update_board_settings(
    data: BoardSettingsUpdate, db: AsyncSession = Depends(get_db)
):
    """Update board settings."""
    result = await db.execute(select(BoardSettings))
    settings = result.scalar_one_or_none()

    if not settings:
        # Create if doesn't exist
        settings = BoardSettings()
        db.add(settings)

    if data.title is not None:
        settings.title = data.title
    if data.subtitle is not None:
        settings.subtitle = data.subtitle

    await db.commit()
    await db.refresh(settings)
    return settings
