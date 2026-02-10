"""add_due_date_to_cards

Revision ID: dba094943a0c
Revises: 07bf63b37417
Create Date: 2026-02-10 22:32:09.075428

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dba094943a0c'
down_revision: Union[str, Sequence[str], None] = '07bf63b37417'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('cards', sa.Column('due_date', sa.DateTime(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('cards', 'due_date')
