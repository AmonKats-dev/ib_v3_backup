"""
Combined script to migrate all relationship data.
This script runs both cost and fund migrations in sequence.
"""
import os
import sys

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from migrate_cost_data import migrate_cost_data
from migrate_fund_data import migrate_fund_data


def migrate_all():
    """Run all migrations"""
    print("\n" + "=" * 60)
    print("COMPLETE MIGRATION: Cost and Fund Relationships")
    print("=" * 60)
    
    success = True
    
    # Migrate cost data
    print("\n\n[1/2] Migrating cost data...")
    if not migrate_cost_data():
        print("\n✗ Cost data migration failed!")
        success = False
    else:
        print("\n✓ Cost data migration completed successfully!")
    
    # Migrate fund data
    print("\n\n[2/2] Migrating fund data...")
    if not migrate_fund_data():
        print("\n✗ Fund data migration failed!")
        success = False
    else:
        print("\n✓ Fund data migration completed successfully!")
    
    # Final summary
    print("\n" + "=" * 60)
    if success:
        print("✓ ALL MIGRATIONS COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Verify the data in cost_category, cost_classification, and fund_source tables")
        print("2. Test the frontend to ensure cost classifications filter by cost category")
        print("3. Test the frontend to ensure fund sources filter by fund")
    else:
        print("✗ SOME MIGRATIONS FAILED!")
        print("=" * 60)
        print("\nPlease review the errors above and fix them before proceeding.")
    
    return success


if __name__ == '__main__':
    success = migrate_all()
    sys.exit(0 if success else 1)

