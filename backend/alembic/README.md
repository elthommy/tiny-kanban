# Database Migrations with Alembic

## Creating a New Migration

When you modify models in `app/models.py`:

1. Generate migration from model changes:
   ```bash
   alembic revision --autogenerate -m "describe_your_changes"
   ```

2. Review the generated file in `alembic/versions/`

3. Apply the migration:
   ```bash
   alembic upgrade head
   ```

## Common Commands

- `alembic current` - Show current migration version
- `alembic history` - Show migration history
- `alembic upgrade head` - Apply all pending migrations
- `alembic downgrade -1` - Rollback last migration
- `alembic revision -m "message"` - Create empty migration (for data migrations)

## Development vs Production

**Development**: Migrations run automatically on app startup (AUTO_MIGRATE=true)

**Production**: Run migrations manually before deploying:
```bash
AUTO_MIGRATE=false alembic upgrade head
AUTO_MIGRATE=false uvicorn app.main:app
```

## Example Workflow

### Adding a New Field

1. Edit `app/models.py`:
   ```python
   class Card(Base):
       # ... existing fields ...
       priority: Mapped[str] = mapped_column(String(20), default="medium")
   ```

2. Generate and apply migration:
   ```bash
   alembic revision --autogenerate -m "add_priority_to_cards"
   alembic upgrade head
   ```

### Data Migration

For complex changes requiring data transformation:

```bash
# Create empty migration
alembic revision -m "migrate_card_statuses"

# Edit the file manually to transform data
def upgrade() -> None:
    op.add_column('cards', sa.Column('status', sa.String(50)))
    op.execute("UPDATE cards SET status = 'archived' WHERE is_archived = 1")
    op.execute("UPDATE cards SET status = 'active' WHERE is_archived = 0")
    # Drop old column if needed
```

## Troubleshooting

### Migration conflicts
If multiple developers create migrations simultaneously, use `alembic merge` to create a merge migration.

### Reverting changes
```bash
alembic downgrade -1  # Go back one migration
alembic downgrade <revision_id>  # Go to specific revision
```

### Fresh database setup
```bash
alembic upgrade head
```
