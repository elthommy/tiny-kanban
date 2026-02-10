"""initial_schema

Revision ID: 07bf63b37417
Revises:
Create Date: 2026-02-06 21:03:31.817907

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "07bf63b37417"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create columns table
    op.create_table(
        'columns',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('is_done_column', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create tags table
    op.create_table(
        'tags',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=False),
        sa.Column('bg_color', sa.String(length=7), nullable=True),
        sa.Column('fg_color', sa.String(length=7), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Create board_settings table
    op.create_table(
        'board_settings',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('subtitle', sa.String(length=500), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create cards table
    op.create_table(
        'cards',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('column_id', sa.String(), nullable=True),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(length=2000), nullable=True),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('is_archived', sa.Boolean(), nullable=False),
        sa.Column('archived_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['column_id'], ['columns.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create card_tags junction table
    op.create_table(
        'card_tags',
        sa.Column('card_id', sa.String(), nullable=False),
        sa.Column('tag_id', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['card_id'], ['cards.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('card_id', 'tag_id'),
        sa.UniqueConstraint('card_id', 'tag_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('card_tags')
    op.drop_table('cards')
    op.drop_table('board_settings')
    op.drop_table('tags')
    op.drop_table('columns')
