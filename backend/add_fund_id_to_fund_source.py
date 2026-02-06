"""
Script to add fund_id column to fund_source table directly.
This can be run independently of migrations.
"""
import os
import sys

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from sqlalchemy import inspect, text

def add_fund_id_column():
    """Add fund_id column to fund_source table"""
    try:
        app = create_app()
        
        with app.app_context():
            print("Checking fund_source table structure...")
            
            # Check if column already exists
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('fund_source')]
            
            if 'fund_id' in columns:
                print("✓ fund_id column already exists in fund_source table")
                return True
            
            print("Adding fund_id column to fund_source table...")
            
            # Check database type
            dialect = db.engine.dialect.name
            
            # Add the column using a transaction
            with db.engine.begin() as conn:
                if dialect == 'mysql' or dialect == 'mariadb':
                    # MySQL/MariaDB syntax
                    conn.execute(text("""
                        ALTER TABLE fund_source 
                        ADD COLUMN fund_id INT NULL
                    """))
                    print("✓ Added fund_id column")
                    
                elif dialect == 'postgresql':
                    # PostgreSQL syntax
                    conn.execute(text("""
                        ALTER TABLE fund_source 
                        ADD COLUMN IF NOT EXISTS fund_id INTEGER NULL
                    """))
                    print("✓ Added fund_id column")
                    
                else:
                    # Generic SQL (may need adjustment)
                    conn.execute(text("""
                        ALTER TABLE fund_source 
                        ADD COLUMN fund_id INTEGER NULL
                    """))
                    print("✓ Added fund_id column")
            
            # Add foreign key constraint in a separate transaction
            with db.engine.begin() as conn:
                try:
                    conn.execute(text("""
                        ALTER TABLE fund_source 
                        ADD CONSTRAINT fund_source_fund_fk 
                        FOREIGN KEY (fund_id) REFERENCES fund(id)
                    """))
                    print("✓ Added foreign key constraint")
                except Exception as e:
                    # Check if constraint already exists
                    error_msg = str(e).lower()
                    if 'duplicate' in error_msg or 'already exists' in error_msg or 'constraint' in error_msg:
                        print("⚠ Foreign key constraint may already exist (this is OK)")
                    else:
                        print(f"⚠ Warning when adding foreign key: {e}")
                        # Don't fail if constraint already exists
            
            print("\n✓ Successfully added fund_id column to fund_source table!")
            return True
            
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = add_fund_id_column()
    sys.exit(0 if success else 1)

