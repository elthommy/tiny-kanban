from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Card
from app.schemas import CardOut

router = APIRouter(tags=["search"])


@router.get("/search", response_model=list[CardOut])
async def search_cards(
    q: str = Query("", min_length=0),
    db: AsyncSession = Depends(get_db),
):
    if not q:
        return []
    result = await db.execute(
        select(Card)
        .where(
            Card.is_archived == False,  # noqa: E712
            Card.title.ilike(f"%{q}%"),
        )
        .options(selectinload(Card.tags))
        .order_by(Card.position)
        .limit(50)
    )
    return result.scalars().all()
