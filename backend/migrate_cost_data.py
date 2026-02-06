"""
Script to migrate data from costing table to cost_category and cost_classification tables.
This script:
1. Migrates level 1 items (parent_id is NULL) from costing to cost_category
2. Migrates level 2 items (parent_id points to level 1) from costing to cost_classification
"""
import os
import sys

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from app.rest.v1.costing.model import Costing
from app.rest.v1.cost_category.model import CostCategory
from app.rest.v1.cost_classification.model import CostClassification


def migrate_cost_data():
    """Migrate data from costing to cost_category and cost_classification"""
    try:
        app = create_app()
        
        with app.app_context():
            print("=" * 60)
            print("Migrating data from costing to cost_category and cost_classification")
            print("=" * 60)
            
            # Check if tables are already populated
            existing_categories = CostCategory.query.filter_by(is_deleted=False).count()
            existing_classifications = CostClassification.query.filter_by(is_deleted=False).count()
            
            if existing_categories > 0 or existing_classifications > 0:
                print(f"\n⚠ Warning: Found {existing_categories} cost categories and {existing_classifications} cost classifications already in database.")
                response = input("Do you want to continue? This may create duplicates. (yes/no): ")
                if response.lower() != 'yes':
                    print("Migration cancelled.")
                    return False
            
            # Get all costing records
            all_costings = Costing.query.filter_by(is_deleted=False).all()
            print(f"\nFound {len(all_costings)} costing records to process")
            
            # Separate by level
            # Level 1: items with no parent (parent_id is None)
            level_1_costings = [c for c in all_costings if c.parent_id is None]
            # Level 2: items whose parent is a level 1 item
            level_1_ids = {c.id for c in level_1_costings}
            level_2_costings = [c for c in all_costings if c.parent_id in level_1_ids]
            
            print(f"  - Level 1 (cost categories): {len(level_1_costings)}")
            print(f"  - Level 2 (cost classifications): {len(level_2_costings)}")
            
            # Create mapping from old costing ID to new cost_category ID
            costing_to_category_map = {}
            categories_created = 0
            classifications_created = 0
            
            # Step 1: Migrate level 1 items to cost_category
            print("\n" + "-" * 60)
            print("Step 1: Migrating level 1 items to cost_category...")
            print("-" * 60)
            
            for costing in level_1_costings:
                # Check if category already exists by code
                existing = CostCategory.query.filter_by(code=costing.code, is_deleted=False).first()
                if existing:
                    print(f"  ⚠ Cost category with code '{costing.code}' already exists, skipping...")
                    costing_to_category_map[costing.id] = existing.id
                    continue
                
                # Create new cost category
                cost_category = CostCategory(
                    code=costing.code,
                    name=costing.name,
                    expenditure_type=None  # Can be set later if needed
                )
                cost_category.save()
                costing_to_category_map[costing.id] = cost_category.id
                categories_created += 1
                print(f"  ✓ Created cost category: {costing.code} - {costing.name}")
            
            print(f"\n✓ Created {categories_created} cost categories")
            
            # Step 2: Migrate level 2 items to cost_classification
            print("\n" + "-" * 60)
            print("Step 2: Migrating level 2 items to cost_classification...")
            print("-" * 60)
            
            for costing in level_2_costings:
                # Get the parent's cost_category_id
                parent_category_id = costing_to_category_map.get(costing.parent_id)
                
                if not parent_category_id:
                    print(f"  ⚠ Warning: Parent costing (id={costing.parent_id}) not found for costing '{costing.code}'. Skipping...")
                    continue
                
                # Check if classification already exists by code
                existing = CostClassification.query.filter_by(code=costing.code, is_deleted=False).first()
                if existing:
                    print(f"  ⚠ Cost classification with code '{costing.code}' already exists, skipping...")
                    continue
                
                # Create new cost classification
                cost_classification = CostClassification(
                    code=costing.code,
                    name=costing.name,
                    cost_category_id=parent_category_id
                )
                cost_classification.save()
                classifications_created += 1
                print(f"  ✓ Created cost classification: {costing.code} - {costing.name} (category_id: {parent_category_id})")
            
            print(f"\n✓ Created {classifications_created} cost classifications")
            
            # Summary
            print("\n" + "=" * 60)
            print("Migration Summary:")
            print("=" * 60)
            print(f"  Cost Categories created: {categories_created}")
            print(f"  Cost Classifications created: {classifications_created}")
            print(f"  Total records migrated: {categories_created + classifications_created}")
            print("\n✓ Migration completed successfully!")
            
            return True
            
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = migrate_cost_data()
    sys.exit(0 if success else 1)

