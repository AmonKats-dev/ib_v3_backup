# Migration Guide: Cost Category/Classification and Fund/Fund Source Relationships

This guide explains how to migrate data from the `costing` and `fund` tables to establish proper relationships between:
- `cost_category` and `cost_classification` tables
- `fund` and `fund_source` tables

## Overview

The migration scripts will:
1. **Cost Data Migration**: Extract level 1 items from `costing` table → `cost_category`, and level 2 items → `cost_classification` (with proper `cost_category_id` relationships)
2. **Fund Data Migration**: Extract level 2 items from `fund` table → `fund_source` (with proper `fund_id` relationships)

## Prerequisites

- Python environment with all dependencies installed
- Database access configured
- Backup of your database (recommended)

## Running the Migrations

### Option 1: Run All Migrations Together (Recommended)

```bash
cd backend
python migrate_all_relationships.py
```

This will run both migrations in sequence and provide a complete summary.

### Option 2: Run Migrations Separately

#### Migrate Cost Data
```bash
cd backend
python migrate_cost_data.py
```

#### Migrate Fund Data
```bash
cd backend
python migrate_fund_data.py
```

## What the Scripts Do

### Cost Data Migration (`migrate_cost_data.py`)

1. **Identifies Level 1 Items**: Finds all `costing` records with `parent_id = NULL` (these become cost categories)
2. **Identifies Level 2 Items**: Finds all `costing` records whose parent is a level 1 item (these become cost classifications)
3. **Creates Cost Categories**: Migrates level 1 items to `cost_category` table
4. **Creates Cost Classifications**: Migrates level 2 items to `cost_classification` table with `cost_category_id` set to the parent's new ID

### Fund Data Migration (`migrate_fund_data.py`)

1. **Identifies Level 1 Items**: Finds all `fund` records with `parent_id = NULL` (these remain in the `fund` table)
2. **Identifies Level 2 Items**: Finds all `fund` records whose parent is a level 1 item (these become fund sources)
3. **Creates Fund Sources**: Migrates level 2 items to `fund_source` table with `fund_id` set to the parent's ID

## Safety Features

- **Duplicate Detection**: Scripts check for existing records by code before creating new ones
- **Validation**: Verifies parent relationships exist before creating child records
- **User Confirmation**: Prompts before proceeding if data already exists
- **Error Handling**: Provides detailed error messages if something goes wrong

## After Migration

Once the migration is complete:

1. **Verify Data**: Check that records were created in:
   - `cost_category` table
   - `cost_classification` table (with `cost_category_id` populated)
   - `fund_source` table (with `fund_id` populated)

2. **Test Frontend**: 
   - Select a cost category and verify that only related cost classifications appear
   - Select a fund and verify that only related fund sources appear

3. **Check Relationships**:
   ```sql
   -- Verify cost category relationships
   SELECT cc.id, cc.code, cc.name, cat.code as category_code, cat.name as category_name
   FROM cost_classification cc
   LEFT JOIN cost_category cat ON cc.cost_category_id = cat.id;
   
   -- Verify fund source relationships
   SELECT fs.id, fs.code, fs.name, f.code as fund_code, f.name as fund_name
   FROM fund_source fs
   LEFT JOIN fund f ON fs.fund_id = f.id;
   ```

## Troubleshooting

### "Parent not found" warnings
- This means some level 2 items have invalid parent references
- These items will be skipped during migration
- Review your data to fix parent relationships if needed

### Duplicate code errors
- The scripts check for existing records by code
- If duplicates exist, the script will skip them
- Review your data to ensure codes are unique

### No data migrated
- Verify that your `costing` and `fund` tables have data
- Check that the level structure is correct (level 1 = no parent, level 2 = has parent)
- Review the console output for specific error messages

## Notes

- The original data in `costing` and `fund` tables is **not deleted** - this is a copy operation
- The migration is **idempotent** - you can run it multiple times safely (it will skip existing records)
- If you need to re-run the migration, you may want to clear the target tables first (be careful!)

## Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your database connection and permissions
3. Review the data structure in your `costing` and `fund` tables
4. Ensure foreign key constraints are properly set up

