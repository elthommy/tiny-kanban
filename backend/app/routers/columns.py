from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Card, Column
from app.schemas import ColumnCreate, ColumnOut, ColumnReorder, ColumnUpdate

router = APIRouter(tags=["columns"])


@router.get("/columns", response_model=list[ColumnOut])
async def list_columns(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Column)
        .options(selectinload(Column.cards).selectinload(Card.tags))
        .order_by(Column.position)
    )
    columns = result.scalars().all()
    for col in columns:
        col.cards = [c for c in col.cards if not c.is_archived]
    return columns


@router.post("/columns", response_model=ColumnOut, status_code=201)
async def create_column(data: ColumnCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Column))
    max_pos = len(result.scalars().all())
    col = Column(name=data.name, position=max_pos, is_done_column=data.is_done_column)
    db.add(col)
    await db.commit()
    await db.refresh(col)
    result = await db.execute(
        select(Column)
        .where(Column.id == col.id)
        .options(selectinload(Column.cards).selectinload(Card.tags))
    )
    return result.scalar_one()


@router.patch("/columns/{column_id}", response_model=ColumnOut)
async def update_column(
    column_id: str, data: ColumnUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Column)
        .where(Column.id == column_id)
        .options(selectinload(Column.cards).selectinload(Card.tags))
    )
    col = result.scalar_one_or_none()
    if not col:
        raise HTTPException(404, "Column not found")
    if data.name is not None:
        col.name = data.name
    if data.is_done_column is not None:
        col.is_done_column = data.is_done_column
    col.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(col)
    return col


@router.delete("/columns/{column_id}", status_code=204)
async def delete_column(column_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Column).where(Column.id == column_id))
    col = result.scalar_one_or_none()
    if not col:
        raise HTTPException(404, "Column not found")
    now = datetime.now(timezone.utc)
    await db.execute(
        update(Card)
        .where(Card.column_id == column_id, Card.is_archived == False)  # noqa: E712
        .values(is_archived=True, archived_at=now)
    )
    await db.delete(col)
    await db.commit()


@router.put("/columns/reorder", response_model=list[ColumnOut])
async def reorder_columns(data: ColumnReorder, db: AsyncSession = Depends(get_db)):
    for i, col_id in enumerate(data.column_ids):
        await db.execute(update(Column).where(Column.id == col_id).values(position=i))
    await db.commit()
    result = await db.execute(
        select(Column)
        .options(selectinload(Column.cards).selectinload(Card.tags))
        .order_by(Column.position)
    )
    columns = result.scalars().all()
    for col in columns:
        col.cards = [c for c in col.cards if not c.is_archived]
    return columns
