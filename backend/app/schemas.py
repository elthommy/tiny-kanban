from datetime import datetime

from pydantic import BaseModel

# --- Tags ---


class TagCreate(BaseModel):
    name: str
    color: str = "blue"


class TagOut(BaseModel):
    id: str
    name: str
    color: str
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Cards ---


class CardCreate(BaseModel):
    title: str
    description: str | None = None
    image_url: str | None = None
    tag_ids: list[str] = []


class CardUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
    tag_ids: list[str] | None = None


class CardOut(BaseModel):
    id: str
    column_id: str | None
    title: str
    description: str | None
    image_url: str | None
    position: int
    is_archived: bool
    archived_at: datetime | None
    created_at: datetime
    updated_at: datetime
    tags: list[TagOut] = []

    model_config = {"from_attributes": True}


class CardMove(BaseModel):
    card_id: str
    target_column_id: str
    position: int


# --- Columns ---


class ColumnCreate(BaseModel):
    name: str
    is_done_column: bool = False


class ColumnUpdate(BaseModel):
    name: str | None = None
    is_done_column: bool | None = None


class ColumnOut(BaseModel):
    id: str
    name: str
    position: int
    is_done_column: bool
    created_at: datetime
    updated_at: datetime
    cards: list[CardOut] = []

    model_config = {"from_attributes": True}


class ColumnReorder(BaseModel):
    column_ids: list[str]


# --- Archive ---


class ArchiveQuery(BaseModel):
    q: str | None = None
    page: int = 1
    page_size: int = 20


class ArchivePage(BaseModel):
    items: list[CardOut]
    total: int
    page: int
    page_size: int
