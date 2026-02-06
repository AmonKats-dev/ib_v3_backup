"""
Simple script to create the coa_function table if it doesn't exist.
This bypasses migrations and directly creates the table.
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
from sqlalchemy import inspect

def create_table():
    """Create the coa_function table if it doesn't exist"""
    app = create_app()
    
    with app.app_context():
        print("Checking for coa_function table...")
        inspector = inspect(db.engine)
        existing_tables = inspector.get_table_names()
        
        if 'coa_function' in existing_tables:
            print("SUCCESS: coa_function table already exists!")
            columns = inspector.get_columns('coa_function')
            print(f"   Table has {len(columns)} columns")
            return True
        
        print("Creating coa_function table...")
        try:
            from app.rest.v1.function.model import Function
            # Create the table
            Function.__table__.create(db.engine, checkfirst=True)
            print("SUCCESS: coa_function table created!")
            
            # Verify it was created
            inspector = inspect(db.engine)
            if 'coa_function' in inspector.get_table_names():
                print("Verified: coa_function table now exists in database")
                return True
            else:
                print("WARNING: Table creation reported success but table not found")
                return False
        except Exception as e:
            print(f"ERROR creating table: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    success = create_table()
    sys.exit(0 if success else 1)

