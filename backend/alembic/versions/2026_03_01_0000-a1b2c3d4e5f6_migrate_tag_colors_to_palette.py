"""migrate_tag_colors_to_palette

Revision ID: a1b2c3d4e5f6
Revises: dba094943a0c
Create Date: 2026-03-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'dba094943a0c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Legacy color name -> palette hex mapping
LEGACY_COLOR_MAP = {
    "red": "#ef4444",
    "blue": "#3b82f6",
    "green": "#22c55e",
    "amber": "#f59e0b",
    "purple": "#a855f7",
    "slate": "#64748b",
    "emerald": "#10b981",
    "pink": "#ec4899",
    "orange": "#f97316",
}

PALETTE = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#ec4899", "#64748b",
]


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    n = int(hex_color[1:], 16)
    return (n >> 16) & 255, (n >> 8) & 255, n & 255


def _get_text_color(bg_hex: str) -> str:
    r, g, b = _hex_to_rgb(bg_hex)
    channels = []
    for c in (r, g, b):
        s = c / 255
        channels.append(s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4)
    luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
    return "#000000" if luminance > 0.179 else "#ffffff"


def _find_closest(hex_color: str) -> str:
    r1, g1, b1 = _hex_to_rgb(hex_color)
    best = PALETTE[0]
    best_dist = float("inf")
    for p in PALETTE:
        r2, g2, b2 = _hex_to_rgb(p)
        dist = (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
        if dist < best_dist:
            best_dist = dist
            best = p
    return best


def upgrade() -> None:
    # Migrate data first, before altering schema
    conn = op.get_bind()
    tags = conn.execute(sa.text("SELECT id, color, bg_color FROM tags")).fetchall()

    for tag_id, color, bg_color in tags:
        if bg_color:
            # Snap existing bg_color to closest palette color
            new_bg = _find_closest(bg_color)
        else:
            # Map legacy color name to palette hex
            new_bg = LEGACY_COLOR_MAP.get(color, "#3b82f6")
        new_fg = _get_text_color(new_bg)
        conn.execute(
            sa.text("UPDATE tags SET bg_color = :bg, fg_color = :fg WHERE id = :id"),
            {"bg": new_bg, "fg": new_fg, "id": tag_id},
        )

    # Now alter the schema: drop color column, make bg/fg NOT NULL
    with op.batch_alter_table("tags") as batch_op:
        batch_op.drop_column("color")
        batch_op.alter_column("bg_color", existing_type=sa.String(7), nullable=False,
                              server_default="#3b82f6")
        batch_op.alter_column("fg_color", existing_type=sa.String(7), nullable=False,
                              server_default="#ffffff")


def downgrade() -> None:
    with op.batch_alter_table("tags") as batch_op:
        batch_op.add_column(sa.Column("color", sa.String(50), nullable=False,
                                      server_default="blue"))
        batch_op.alter_column("bg_color", existing_type=sa.String(7), nullable=True)
        batch_op.alter_column("fg_color", existing_type=sa.String(7), nullable=True)
