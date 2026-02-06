# Alembic Database Migration Integration - Implementation Summary

## What Was Implemented

### 1. Dependencies
- Added `alembic>=1.13.0` to `pyproject.toml`
- Installed via pip in virtual environment

### 2. Alembic Initialization
- Initialized Alembic with `alembic init alembic`
- Created directory structure:
  - `alembic/` - Migration scripts directory
  - `alembic/versions/` - Individual migration files
  - `alembic.ini` - Configuration file
  - `alembic/env.py` - Migration runtime environment

### 3. Configuration

#### alembic/env.py
- Added backend directory to Python path for importing app modules
- Imported all models (Column, Card, Tag, CardTag, BoardSettings)
- Imported app settings and database Base
- Configured async-to-sync URL conversion (`sqlite+aiosqlite:` → `sqlite:`)
- Set `target_metadata = Base.metadata` for autogenerate support

#### alembic.ini
- Enabled timestamp-based migration file naming:
  - Format: `YYYY_MM_DD_HHMM-<revision>_<slug>.py`
  - Example: `2026_02_06_2103-07bf63b37417_initial_schema.py`

### 4. App Integration (app/main.py)

Replaced the old startup code:
```python
async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
```

With migration-based startup:
```python
def run_migrations():
    """Run Alembic migrations programmatically."""
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option(
        "sqlalchemy.url",
        settings.database_url.replace("sqlite+aiosqlite:", "sqlite:")
    )
    command.upgrade(alembic_cfg, "head")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-run migrations in development (controlled by AUTO_MIGRATE env var)
    if os.getenv("AUTO_MIGRATE", "true").lower() == "true":
        await asyncio.to_thread(run_migrations)
    yield
```

### 5. Initial Migration

- Generated initial migration: `2026_02_06_2103-07bf63b37417_initial_schema.py`
- Migration was empty (no changes) because database already existed with matching schema
- Used `alembic stamp head` to mark existing database as up-to-date

### 6. Documentation

#### backend/alembic/README.md
- Created comprehensive migration guide
- Common commands reference
- Development vs production workflows
- Examples for adding fields and data migrations
- Troubleshooting section

#### README.md (main project)
- Added "Database Setup" section with:
  - First-time setup instructions
  - Development workflow (auto-migration)
  - Creating migrations after model changes
- Updated Tech Stack to include Alembic

## Environment Variables

### AUTO_MIGRATE
Controls whether migrations run automatically on app startup.

**Development (default):**
```bash
AUTO_MIGRATE=true uvicorn app.main:app --reload
```
- Migrations run automatically on startup
- Maximum convenience for developers
- No need to remember to run `alembic upgrade head`

**Production:**
```bash
AUTO_MIGRATE=false uvicorn app.main:app
```
- Migrations must be run manually before deployment
- Full control over when schema changes happen
- Standard industry practice

## Verification Results

### ✅ Tests Passed
- All 20 backend tests pass
- Seed script works correctly
- Migration autogenerate detects model changes
- Migration history tracks correctly

### ✅ Database Tables
All original tables intact plus Alembic tracking:
- columns
- cards
- tags
- card_tags
- board_settings
- alembic_version (new - tracks migration state)

### ✅ Migration Status
```bash
$ alembic current
07bf63b37417 (head)

$ alembic history
<base> -> 07bf63b37417 (head), initial_schema
```

### ✅ Workflow Tested
1. Added test field to Card model
2. Generated migration with `alembic revision --autogenerate`
3. Verified migration correctly detected change:
   ```python
   def upgrade() -> None:
       op.add_column('cards', sa.Column('priority', sa.String(length=20), nullable=False))

   def downgrade() -> None:
       op.drop_column('cards', 'priority')
   ```
4. Cleaned up test changes

## Future Workflow

### Making Schema Changes

1. **Edit model** in `app/models.py`:
   ```python
   class Card(Base):
       # Add new field
       priority: Mapped[str] = mapped_column(String(20), default="medium")
   ```

2. **Generate migration**:
   ```bash
   alembic revision --autogenerate -m "add_priority_to_cards"
   ```

3. **Review generated file** in `alembic/versions/`

4. **Apply migration**:
   ```bash
   alembic upgrade head
   ```

   Or just restart the app (auto-migration in dev mode)

### Rolling Back

```bash
alembic downgrade -1              # Go back one migration
alembic downgrade <revision_id>   # Go to specific version
```

### Team Collaboration

1. Developer A creates migration and commits to git
2. Developer B pulls changes
3. Developer B runs `alembic upgrade head` (or just starts the app in dev mode)
4. Database is automatically updated to match the new schema

## Benefits Achieved

✅ **Version Control**: All schema changes tracked in git
✅ **Rollback Capability**: Can undo migrations if needed
✅ **Team Coordination**: Multiple developers can manage schema changes
✅ **Production Safety**: Test migrations before applying to production
✅ **Audit Trail**: Complete history of database evolution
✅ **Auto-generation**: Most migrations created automatically from model changes
✅ **Developer Friendly**: Auto-migration in dev means less manual work
✅ **Industry Standard**: Using the standard tool for SQLAlchemy projects

## No Breaking Changes

- Existing database continues to work (stamped to initial migration)
- All tests pass
- Seed script works
- No data migration required
- Backward compatible with current workflows
