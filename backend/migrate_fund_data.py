"""
Script to migrate data from fund table to fund_source table.
This script:
1. Keeps level 1 items (parent_id is NULL) in fund table (they're already there)
2. Migrates level 2 items (parent_id points to level 1) from fund to fund_source
"""
import os
import sys

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from app.rest.v1.fund.model import Fund
from app.rest.v1.fund_source.model import FundSource


def migrate_fund_data():
    """Migrate data from fund to fund_source"""
    try:
        app = create_app()
        
        with app.app_context():
            print("=" * 60)
            print("Migrating data from fund to fund_source")
            print("=" * 60)
            
            # Check if fund_source table is already populated
            existing_sources = FundSource.query.filter_by(is_deleted=False).count()
            
            if existing_sources > 0:
                print(f"\n⚠ Warning: Found {existing_sources} fund sources already in database.")
                response = input("Do you want to continue? This may create duplicates. (yes/no): ")
                if response.lower() != 'yes':
                    print("Migration cancelled.")
                    return False
            
            # Get all fund records
            all_funds = Fund.query.filter_by(is_deleted=False).all()
            print(f"\nFound {len(all_funds)} fund records to process")
            
            # Separate by level
            # Level 1: items with no parent (parent_id is None)
            level_1_funds = [f for f in all_funds if f.parent_id is None]
            # Level 2: items whose parent is a level 1 item
            level_1_ids = {f.id for f in level_1_funds}
            level_2_funds = [f for f in all_funds if f.parent_id in level_1_ids]
            
            print(f"  - Level 1 (main funds): {len(level_1_funds)} (kept in fund table)")
            print(f"  - Level 2 (fund sources): {len(level_2_funds)} (to migrate to fund_source)")
            
            # Verify that all level 2 funds have valid parents
            valid_level_2_funds = []
            invalid_funds = []
            
            for fund in level_2_funds:
                parent = Fund.query.filter_by(id=fund.parent_id, is_deleted=False).first()
                if parent:
                    valid_level_2_funds.append(fund)
                else:
                    invalid_funds.append(fund)
            
            if invalid_funds:
                print(f"\n⚠ Warning: Found {len(invalid_funds)} level 2 funds with invalid parents. These will be skipped.")
                for fund in invalid_funds:
                    print(f"    - {fund.code} - {fund.name} (parent_id: {fund.parent_id})")
            
            # Step 1: Migrate level 2 items to fund_source
            print("\n" + "-" * 60)
            print("Step 1: Migrating level 2 items to fund_source...")
            print("-" * 60)
            
            sources_created = 0
            
            for fund in valid_level_2_funds:
                # Check if fund_source already exists by code
                existing = FundSource.query.filter_by(code=fund.code, is_deleted=False).first()
                if existing:
                    print(f"  ⚠ Fund source with code '{fund.code}' already exists, skipping...")
                    continue
                
                # Create new fund source
                fund_source = FundSource(
                    code=fund.code,
                    name=fund.name,
                    fund_id=fund.parent_id  # Link to parent fund
                )
                fund_source.save()
                sources_created += 1
                print(f"  ✓ Created fund source: {fund.code} - {fund.name} (fund_id: {fund.parent_id})")
            
            print(f"\n✓ Created {sources_created} fund sources")
            
            # Summary
            print("\n" + "=" * 60)
            print("Migration Summary:")
            print("=" * 60)
            print(f"  Level 1 funds (kept in fund table): {len(level_1_funds)}")
            print(f"  Fund Sources created: {sources_created}")
            print(f"  Invalid level 2 funds skipped: {len(invalid_funds)}")
            print("\n✓ Migration completed successfully!")
            
            return True
            
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = migrate_fund_data()
    sys.exit(0 if success else 1)

