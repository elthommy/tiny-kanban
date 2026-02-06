"""Seed the database with demo data.

⚠️  WARNING: This will DELETE ALL EXISTING DATA! ⚠️

Usage:
  python -m app.seed                    # Use production database (prompts for confirmation)
  python -m app.seed --force            # Skip confirmation (DANGEROUS!)
  SEED_DB=seed.db python -m app.seed    # Use a different database file

For safety, consider using a separate database:
  SEED_DB=demo.db python -m app.seed --force
"""

import asyncio
import os
import sys

from app.database import Base, async_session, engine
from app.models import Card, CardTag, Column, Tag


def confirm_seed():
    """Ask user for confirmation before seeding."""
    if "--force" in sys.argv:
        return True

    db_path = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./taskflow.db")
    db_file = db_path.split("///")[-1] if "///" in db_path else "in-memory"

    print("⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️")
    print(f"This will DELETE ALL DATA in: {db_file}")
    print("\nTo use a separate database instead:")
    print("  SEED_DB=demo.db python -m app.seed --force\n")

    response = input("Are you sure you want to continue? Type 'yes' to confirm: ")
    return response.lower() == "yes"


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Clear existing data
        for model in [CardTag, Card, Tag, Column]:
            await db.execute(model.__table__.delete())

        # Columns
        todo = Column(id="col-todo", name="To Do", position=0)
        in_progress = Column(id="col-inprogress", name="In Progress", position=1)
        done = Column(id="col-done", name="Done", position=2, is_done_column=True)
        db.add_all([todo, in_progress, done])

        # Tags
        tags = {
            "high": Tag(id="tag-high", name="High Priority", color="red"),
            "low": Tag(id="tag-low", name="Low Priority", color="green"),
            "design": Tag(id="tag-design", name="Design", color="blue"),
            "dev": Tag(id="tag-dev", name="Development", color="amber"),
            "refactor": Tag(id="tag-refactor", name="Refactoring", color="purple"),
            "ops": Tag(id="tag-ops", name="Operations", color="slate"),
        }
        db.add_all(tags.values())

        # Cards
        cards = [
            Card(
                id="card-1",
                column_id="col-todo",
                title="Design System Update",
                description="Update the design system with new components and tokens.",
                position=0,
            ),
            Card(
                id="card-2",
                column_id="col-todo",
                title="User Research Interviews",
                description="Conduct user research interviews for the new feature.",
                position=1,
            ),
            Card(
                id="card-3",
                column_id="col-inprogress",
                title="API Integration",
                description="Integrate the new API endpoints with the frontend.",
                position=0,
            ),
            Card(
                id="card-4",
                column_id="col-inprogress",
                title="Component Library Cleanup",
                description="Clean up and document the component library.",
                position=1,
            ),
            Card(
                id="card-5",
                column_id="col-done",
                title="Setup AWS Pipeline",
                description="Set up the CI/CD pipeline on AWS.",
                position=0,
            ),
        ]
        db.add_all(cards)

        # Card-tag associations
        card_tags = [
            CardTag(card_id="card-1", tag_id="tag-high"),
            CardTag(card_id="card-1", tag_id="tag-design"),
            CardTag(card_id="card-2", tag_id="tag-low"),
            CardTag(card_id="card-3", tag_id="tag-dev"),
            CardTag(card_id="card-4", tag_id="tag-refactor"),
            CardTag(card_id="card-5", tag_id="tag-ops"),
        ]
        db.add_all(card_tags)

        # Archived cards
        from datetime import datetime, timezone

        archived = [
            Card(
                id="card-archived-1",
                column_id="col-todo",
                title="Design System Refresh",
                description="Refresh the design system.",
                position=0,
                is_archived=True,
                archived_at=datetime(2023, 10, 12, tzinfo=timezone.utc),
            ),
            Card(
                id="card-archived-2",
                column_id="col-inprogress",
                title="API Documentation Draft",
                description="Draft API documentation.",
                position=0,
                is_archived=True,
                archived_at=datetime(2023, 10, 10, tzinfo=timezone.utc),
            ),
            Card(
                id="card-archived-3",
                column_id="col-done",
                title="Q3 Performance Analysis",
                description="Analyze Q3 performance metrics.",
                position=0,
                is_archived=True,
                archived_at=datetime(2023, 10, 8, tzinfo=timezone.utc),
            ),
        ]
        db.add_all(archived)

        archived_card_tags = [
            CardTag(card_id="card-archived-1", tag_id="tag-design"),
            CardTag(card_id="card-archived-1", tag_id="tag-high"),
            CardTag(card_id="card-archived-2", tag_id="tag-dev"),
            CardTag(card_id="card-archived-3", tag_id="tag-ops"),
        ]
        db.add_all(archived_card_tags)

        await db.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    if not confirm_seed():
        print("❌ Seeding cancelled.")
        sys.exit(0)

    asyncio.run(seed())
