# Database Safety Guide

## ⚠️ Important: Protecting Your Data

This guide explains how tests, seeds, and migrations interact with your database to prevent accidental data loss.

## Database Files

### Production Database
- **File**: `taskflow.db`
- **Used by**: The running application (`uvicorn app.main:app`)
- **Contains**: Your actual work data
- **⚠️ NEVER delete this file unless you want to lose all your data**

### Test Database
- **File**: None (in-memory only)
- **URL**: `sqlite+aiosqlite://` (no file path)
- **Used by**: `pytest` test suite
- **Safety**: ✅ Tests NEVER touch production data
- **How**: See `tests/conftest.py` - uses dependency injection to override database

### Seed Database (Optional)
- **File**: Configurable via `SEED_DB` environment variable
- **Default**: Falls back to production database (`taskflow.db`)
- **⚠️ WARNING**: Seed script DELETES ALL DATA before inserting demo data

## Safe Operations

### ✅ Running Tests
```bash
pytest                    # Always safe - uses in-memory database
pytest -v                 # Verbose output, still safe
pytest --cov              # With coverage, still safe
```

**Why it's safe**: Tests use `sqlite+aiosqlite://` (in-memory) configured in `tests/conftest.py`. The test database is created before each test and destroyed after, never touching `taskflow.db`.

### ✅ Running Migrations
```bash
alembic upgrade head      # Safe - only modifies schema, not data
alembic downgrade -1      # Safe - rollback last migration
alembic current           # Safe - just reads current version
alembic history           # Safe - just shows migration history
```

**Why it's safe**: Alembic only modifies table structure (schema), not the data in tables. Your cards, columns, and tags remain intact.

### ✅ Running the App
```bash
uvicorn app.main:app --reload    # Safe - only reads/writes via API
```

**Why it's safe**: The app only modifies data through normal API operations (create/update/delete cards, etc.).

## ⚠️ DANGEROUS Operations

### ❌ Seed Script (Default Usage)
```bash
python -m app.seed        # DANGEROUS - prompts for confirmation
```

**What it does**:
1. Connects to `taskflow.db` (your production database)
2. **DELETES ALL existing columns, cards, tags, and card-tag associations**
3. Inserts demo data (sample columns, cards, tags)

**Why it's dangerous**: Lines 14-16 in `app/seed.py`:
```python
# Clear existing data
for model in [CardTag, Card, Tag, Column]:
    await db.execute(model.__table__.delete())
```

**Protection**: Now requires typing "yes" to confirm.

### ✅ Seed Script (Safe Usage)

**Option 1: Use a separate database**
```bash
SEED_DB=demo.db python -m app.seed --force
```
This creates a new `demo.db` file instead of touching `taskflow.db`.

**Option 2: Use a different database entirely**
```bash
# Create demo database
SEED_DB=demo.db python -m app.seed --force

# Run app with demo database
DATABASE_URL=sqlite+aiosqlite:///./demo.db uvicorn app.main:app --reload
```

**Option 3: Backup first**
```bash
# Backup production database
cp taskflow.db taskflow.db.backup

# Then seed if needed
python -m app.seed
```

## Quick Reference

| Command | Touches Production DB? | Data Loss Risk? | Safe? |
|---------|------------------------|-----------------|-------|
| `pytest` | ❌ No (in-memory) | ❌ None | ✅ Always safe |
| `alembic upgrade head` | ✅ Yes (schema only) | ❌ None* | ✅ Safe |
| `alembic downgrade -1` | ✅ Yes (schema only) | ⚠️ Low* | ⚠️ Review first |
| `uvicorn app.main:app` | ✅ Yes (normal ops) | ❌ None | ✅ Safe |
| `python -m app.seed` | ✅ Yes (deletes all!) | ⚠️ **HIGH** | ❌ **Dangerous** |
| `SEED_DB=demo.db python -m app.seed --force` | ❌ No (uses demo.db) | ❌ None | ✅ Safe |

\* Schema changes can affect data in complex migrations, but typical migrations (adding columns, etc.) are safe.

## Best Practices

### 1. Never Run Seed on Production Data
Unless you specifically want demo data and are okay losing your current data.

### 2. Always Use Separate Databases for Testing
Already configured! Tests use in-memory database automatically.

### 3. Backup Before Major Changes
```bash
# Before running seeds or complex migrations
cp taskflow.db taskflow.db.backup

# If something goes wrong, restore:
cp taskflow.db.backup taskflow.db
```

### 4. Use SEED_DB for Demo Purposes
```bash
# Create a demo database with sample data
SEED_DB=demo.db python -m app.seed --force

# Show others the demo
DATABASE_URL=sqlite+aiosqlite:///./demo.db uvicorn app.main:app

# Your real data in taskflow.db remains untouched
```

### 5. Review Migrations Before Running
```bash
# Generate migration
alembic revision --autogenerate -m "add_new_field"

# Review the generated file in alembic/versions/
cat alembic/versions/YYYY_MM_DD_HHMM-*.py

# If it looks good, apply it
alembic upgrade head
```

## What If I Already Lost Data?

### From Seed Script
If you just ran the seed script and lost your data:
1. **Stop immediately** - don't run any more commands
2. Check for backups in your version control or backup system
3. If you have a `taskflow.db.backup`, restore it:
   ```bash
   cp taskflow.db.backup taskflow.db
   ```

### From Migration
If a migration went wrong:
```bash
# Rollback the last migration
alembic downgrade -1

# Check if data is restored
sqlite3 taskflow.db "SELECT * FROM cards LIMIT 5;"
```

## Future Improvements

To make the seed script even safer, we could:
1. ✅ Add confirmation prompt (DONE)
2. ✅ Support SEED_DB environment variable (DONE)
3. Add automatic backup before seeding
4. Create an "upsert" mode that doesn't delete existing data
5. Add a `--dry-run` flag to show what would be deleted

## Summary

- ✅ **Tests are safe** - they use in-memory database
- ✅ **Migrations are safe** - they only modify schema
- ✅ **App is safe** - normal operations
- ❌ **Seed script is dangerous** - deletes all data
  - **Solution**: Use `SEED_DB=demo.db python -m app.seed --force`

When in doubt, make a backup:
```bash
cp taskflow.db taskflow.db.backup
```
