from fastapi import APIRouter, Depends, Query
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Card, CardTag, Column
from app.schemas import ArchivePage, CardOut

router = APIRouter(tags=["archive"])


@router.get("/archive", response_model=ArchivePage)
async def list_archive(
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    recent_limit: int | None = Query(None, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    base = select(Card).where(Card.is_archived == True)  # noqa: E712
    if q:
        base = base.where(Card.title.ilike(f"%{q}%"))

    count_q = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_q)).scalar()

    items_q = base.options(selectinload(Card.tags)).order_by(Card.archived_at.desc())

    # If recent_limit is set, ignore pagination and return only N most recent items
    if recent_limit:
        items_q = items_q.limit(recent_limit)
    else:
        items_q = items_q.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(items_q)
    items = result.scalars().all()
    return ArchivePage(items=items, total=total, page=page, page_size=page_size)


@router.post("/archive/restore-all", response_model=list[CardOut])
async def restore_all(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Card)
        .where(Card.is_archived == True)  # noqa: E712
        .options(selectinload(Card.tags))
    )
    cards = result.scalars().all()

    first_col_result = await db.execute(
        select(Column).order_by(Column.position).limit(1)
    )
    first_col = first_col_result.scalar_one_or_none()

    for card in cards:
        if card.column_id:
            col_check = await db.execute(
                select(Column).where(Column.id == card.column_id)
            )
            if not col_check.scalar_one_or_none():
                card.column_id = first_col.id if first_col else None
        elif first_col:
            card.column_id = first_col.id
        card.is_archived = False
        card.archived_at = None

    await db.commit()
    return cards


@router.post("/archive/clear", status_code=204)
async def clear_archive(db: AsyncSession = Depends(get_db)):
    archived_ids = select(Card.id).where(Card.is_archived == True)  # noqa: E712
    await db.execute(delete(CardTag).where(CardTag.card_id.in_(archived_ids)))
    await db.execute(delete(Card).where(Card.is_archived == True))  # noqa: E712
    await db.commit()
