# Database Safety Improvements

## Problem Identified

The seed script (`app/seed.py`) was dangerous because:
1. ❌ It deleted all existing data without warning
2. ❌ It always operated on the production database (`taskflow.db`)
3. ❌ No confirmation prompt before destructive operation
4. ❌ Documentation didn't warn about data loss

## Solutions Implemented

### 1. Confirmation Prompt ✅
**File**: `app/seed.py`

Added interactive confirmation before seeding:
```
⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️
This will DELETE ALL DATA in: ./taskflow.db

To use a separate database instead:
  SEED_DB=demo.db python -m app.seed --force

Are you sure you want to continue? Type 'yes' to confirm:
```

- User must type `yes` to proceed
- Shows which database file will be affected
- Suggests safer alternative (SEED_DB)

### 2. Separate Demo Database Support ✅
**Files**: `app/config.py`, `app/seed.py`

Added `SEED_DB` environment variable:
```bash
# Safe: Uses demo.db instead of production taskflow.db
SEED_DB=demo.db python -m app.seed --force
```

The `--force` flag skips confirmation (safe when using SEED_DB).

### 3. Updated Documentation ✅

**Created `backend/DATABASE_SAFETY.md`**:
- Explains which operations are safe vs dangerous
- Shows how tests use in-memory database
- Documents proper seed script usage
- Provides backup and recovery procedures
- Quick reference table of all database operations

**Updated `README.md`**:
- Added warning about seed script
- Shows safe usage with `SEED_DB`
- Links to `DATABASE_SAFETY.md`

### 4. Improved Seed Script Documentation ✅
**File**: `app/seed.py`

Added comprehensive docstring:
```python
"""Seed the database with demo data.

⚠️  WARNING: This will DELETE ALL EXISTING DATA! ⚠️

Usage:
  python -m app.seed                    # Use production database (prompts for confirmation)
  python -m app.seed --force            # Skip confirmation (DANGEROUS!)
  SEED_DB=seed.db python -m app.seed    # Use a different database file
"""
```

## Test Safety (Already Safe) ✅

**File**: `tests/conftest.py`

Tests were already safe:
```python
TEST_DB_URL = "sqlite+aiosqlite://"  # In-memory, no file
```

- Tests use in-memory database
- Never touch production `taskflow.db`
- Database created before each test, destroyed after
- No changes needed - already perfect!

## Recommended Workflow

### For Development (Your Real Data)
```bash
# Just use the app normally
alembic upgrade head
uvicorn app.main:app --reload
```

### For Demos/Screenshots (Separate Database)
```bash
# Create demo database with sample data
SEED_DB=demo.db python -m app.seed --force

# Run app with demo data
DATABASE_URL=sqlite+aiosqlite:///./demo.db uvicorn app.main:app

# Your production taskflow.db remains untouched!
```

### For Testing
```bash
# Always safe - uses in-memory database
pytest -v
```

### For Collaboration
```bash
# Each developer can have their own database
cp taskflow.db my-experimental-changes.db
DATABASE_URL=sqlite+aiosqlite:///./my-experimental-changes.db uvicorn app.main:app
```

## Prevention Checklist

Before running any command, ask:

1. **Does this modify data?**
   - ✅ API operations (via frontend) - Safe
   - ✅ Migrations - Safe (schema only)
   - ❌ Seed script - DANGEROUS

2. **Which database does it use?**
   - ✅ Tests use in-memory - Safe
   - ✅ App uses configuration from env - Check `DATABASE_URL`
   - ❌ Seed uses production by default - Set `SEED_DB`

3. **Can I undo this?**
   - ✅ Migrations can rollback - `alembic downgrade -1`
   - ❌ Seed script cannot undo - Make backup first

4. **Do I have a backup?**
   ```bash
   cp taskflow.db taskflow.db.backup
   ```

## What Changed

| File | Change | Why |
|------|--------|-----|
| `app/seed.py` | Added confirmation prompt | Prevent accidental data loss |
| `app/seed.py` | Added `--force` flag | Allow skip for safe usage with SEED_DB |
| `app/seed.py` | Enhanced docstring | Clear warnings and usage examples |
| `app/config.py` | Added SEED_DB support | Allow separate demo database |
| `DATABASE_SAFETY.md` | Created new file | Comprehensive safety guide |
| `README.md` | Added warnings | Point users to safe practices |

## Before vs After

### Before (Dangerous)
```bash
cd backend
python -m app.seed
# ❌ Silently deletes all your data!
```

### After (Safe)
```bash
cd backend
python -m app.seed
# ⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️
# This will DELETE ALL DATA in: ./taskflow.db
# ...
# Are you sure you want to continue? Type 'yes' to confirm: █

# Or use separate database:
SEED_DB=demo.db python -m app.seed --force
# ✅ Safe - creates demo.db, leaves taskflow.db alone
```

## Testing Results

### ✅ Confirmation Prompt
```bash
$ echo "no" | python -m app.seed
⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️
This will DELETE ALL DATA in: ./taskflow.db
...
❌ Seeding cancelled.
```

### ✅ Separate Database
```bash
$ SEED_DB=demo.db python -m app.seed --force
Database seeded successfully!

$ ls -lh *.db
-rw-r--r-- 1 user user 48K ... demo.db       # New demo database
-rw-r--r-- 1 user user 56K ... taskflow.db  # Production untouched
```

### ✅ Tests Still Pass
```bash
$ pytest -v
============================== 20 passed in 0.72s ==============================
```

## Summary

✅ **Tests are safe** - Always were, use in-memory database
✅ **Seed now has confirmation** - Must type "yes" to confirm
✅ **SEED_DB environment variable** - Easy to use separate database
✅ **Comprehensive documentation** - `DATABASE_SAFETY.md` explains everything
✅ **README updated** - Warns users about dangers

**Bottom line**: You can now safely work with the database without fear of accidental data loss!
