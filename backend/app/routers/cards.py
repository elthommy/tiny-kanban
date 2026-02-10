from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Card, CardTag, Column
from app.schemas import CardCreate, CardMove, CardOut, CardUpdate

router = APIRouter(tags=["cards"])


@router.post("/columns/{column_id}/cards", response_model=CardOut, status_code=201)
async def create_card(
    column_id: str, data: CardCreate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Column).where(Column.id == column_id))
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Column not found")

    result = await db.execute(
        select(Card).where(
            Card.column_id == column_id, Card.is_archived == False
        )  # noqa: E712
    )
    max_pos = len(result.scalars().all())

    card = Card(
        column_id=column_id,
        title=data.title,
        description=data.description,
        image_url=data.image_url,
        due_date=data.due_date,
        position=max_pos,
    )
    db.add(card)
    await db.flush()

    if data.tag_ids:
        for tag_id in data.tag_ids:
            db.add(CardTag(card_id=card.id, tag_id=tag_id))

    await db.commit()
    result = await db.execute(
        select(Card).where(Card.id == card.id).options(selectinload(Card.tags))
    )
    return result.scalar_one()


@router.patch("/cards/{card_id}", response_model=CardOut)
async def update_card(
    card_id: str, data: CardUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Card).where(Card.id == card_id).options(selectinload(Card.tags))
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(404, "Card not found")

    if data.title is not None:
        card.title = data.title
    if data.description is not None:
        card.description = data.description
    if data.image_url is not None:
        card.image_url = data.image_url
    if data.due_date is not None:
        card.due_date = data.due_date
    card.updated_at = datetime.now(timezone.utc)

    if data.tag_ids is not None:
        await db.execute(CardTag.__table__.delete().where(CardTag.card_id == card_id))
        for tag_id in data.tag_ids:
            db.add(CardTag(card_id=card_id, tag_id=tag_id))

    await db.commit()
    result = await db.execute(
        select(Card).where(Card.id == card.id).options(selectinload(Card.tags))
    )
    return result.scalar_one()


@router.delete("/cards/{card_id}", status_code=204)
async def delete_card(card_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(404, "Card not found")
    await db.delete(card)
    await db.commit()


@router.put("/cards/move", response_model=CardOut)
async def move_card(data: CardMove, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Card).where(Card.id == data.card_id).options(selectinload(Card.tags))
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(404, "Card not found")

    old_column_id = card.column_id

    # Shift cards down in the target column at and after the target position
    await db.execute(
        update(Card)
        .where(
            Card.column_id == data.target_column_id,
            Card.position >= data.position,
            Card.is_archived == False,  # noqa: E712
            Card.id != data.card_id,
        )
        .values(position=Card.position + 1)
    )

    card.column_id = data.target_column_id
    card.position = data.position
    card.updated_at = datetime.now(timezone.utc)

    # Close gaps in old column
    if old_column_id and old_column_id != data.target_column_id:
        result = await db.execute(
            select(Card)
            .where(
                Card.column_id == old_column_id,
                Card.is_archived == False,  # noqa: E712
            )
            .order_by(Card.position)
        )
        for i, c in enumerate(result.scalars().all()):
            c.position = i

    await db.commit()
    result = await db.execute(
        select(Card).where(Card.id == card.id).options(selectinload(Card.tags))
    )
    return result.scalar_one()


@router.post("/cards/{card_id}/archive", response_model=CardOut)
async def archive_card(card_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Card).where(Card.id == card_id).options(selectinload(Card.tags))
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(404, "Card not found")
    card.is_archived = True
    card.archived_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(card)
    return card


@router.post("/cards/{card_id}/restore", response_model=CardOut)
async def restore_card(card_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Card).where(Card.id == card_id).options(selectinload(Card.tags))
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(404, "Card not found")

    # If the original column is gone, put it in the first column
    if card.column_id:
        col_result = await db.execute(select(Column).where(Column.id == card.column_id))
        if not col_result.scalar_one_or_none():
            card.column_id = None

    if not card.column_id:
        first_col = await db.execute(select(Column).order_by(Column.position).limit(1))
        col = first_col.scalar_one_or_none()
        if col:
            card.column_id = col.id

    # Put at end of column
    if card.column_id:
        result = await db.execute(
            select(Card).where(
                Card.column_id == card.column_id,
                Card.is_archived == False,  # noqa: E712
            )
        )
        card.position = len(result.scalars().all())

    card.is_archived = False
    card.archived_at = None
    await db.commit()
    result = await db.execute(
        select(Card).where(Card.id == card.id).options(selectinload(Card.tags))
    )
    return result.scalar_one()
