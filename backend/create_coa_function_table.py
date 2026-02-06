"""
Script to create the coa_function table if it doesn't exist.
Run this script to ensure the table is created in your database.
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from app.rest.v1.function.model import Function

def create_table():
    """Create the coa_function table if it doesn't exist"""
    app = create_app()
    
    with app.app_context():
        # Check if table exists
        inspector = db.inspect(db.engine)
        existing_tables = inspector.get_table_names()
        
        if 'coa_function' not in existing_tables:
            print("Creating coa_function table...")
            Function.__table__.create(db.engine, checkfirst=True)
            print("✅ coa_function table created successfully!")
        else:
            print("ℹ️  coa_function table already exists.")
        
        # Verify the table structure
        if 'coa_function' in existing_tables or 'coa_function' in db.inspect(db.engine).get_table_names():
            columns = db.inspect(db.engine).get_columns('coa_function')
            print(f"\n📊 Table 'coa_function' has {len(columns)} columns:")
            for col in columns:
                print(f"   - {col['name']} ({col['type']})")

if __name__ == '__main__':
    create_table()

