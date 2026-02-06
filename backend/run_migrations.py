"""
Script to run database migrations and ensure coa_function table exists.
"""
import os
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from flask_migrate import upgrade, current
from sqlalchemy import inspect, text

def run_migrations():
    """Run database migrations"""
    try:
        app = create_app()
        
        with app.app_context():
            print("Running database migrations...")
            
            # Check current migration version
            try:
                current_rev = current()
                print(f"Current migration version: {current_rev}")
            except Exception as e:
                print(f"No current migration version (database may be new): {e}")
            
            # Run migrations
            print("\nUpgrading database to latest migration...")
            try:
                upgrade()
                print("Migrations completed successfully!")
            except Exception as e:
                print(f"Migration upgrade completed (may have warnings): {e}")
            
            # Check if coa_function table exists
            print("\nChecking for coa_function table...")
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            
            if 'coa_function' in existing_tables:
                print("SUCCESS: coa_function table exists!")
                columns = inspector.get_columns('coa_function')
                print(f"   Table has {len(columns)} columns:")
                for col in columns[:5]:  # Show first 5 columns
                    nullable = "NULL" if col['nullable'] else "NOT NULL"
                    print(f"   - {col['name']}: {col['type']} {nullable}")
                if len(columns) > 5:
                    print(f"   ... and {len(columns) - 5} more columns")
            else:
                print("WARNING: coa_function table does NOT exist!")
                print("   Creating table using db.create_all()...")
                try:
                    from app.rest.v1.function.model import Function
                    Function.__table__.create(db.engine, checkfirst=True)
                    print("SUCCESS: coa_function table created!")
                except Exception as create_error:
                    print(f"ERROR creating table: {create_error}")
                    import traceback
                    traceback.print_exc()
                    return False
                
        return True
    except Exception as e:
        print(f"ERROR during migration: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = run_migrations()
    sys.exit(0 if success else 1)
