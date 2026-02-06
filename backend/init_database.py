#!/usr/bin/env python3
"""
Simple database initialization script
"""

import os
import sys

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def init_database():
    """Initialize the database"""
    try:
        print("🚀 Initializing IBP Database...")
        
        # Import and create app
        from app import create_app
        from app.shared import db
        
        app = create_app()
        
        with app.app_context():
            print("📊 Creating database tables...")
            db.create_all()
            print("✅ Database tables created successfully!")
            print("📋 Database 'ibpdb' is ready with all tables!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = init_database()
    if success:
        print("\n🎉 Database setup complete!")
    else:
        print("\n💥 Database setup failed.")
        sys.exit(1)
