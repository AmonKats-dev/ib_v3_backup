#!/usr/bin/env python3
"""
Create a new database migration
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

def create_migration(message="Auto migration"):
    """Create a new database migration"""
    try:
        print("🚀 Creating new database migration...")
        
        # Import and create app
        from app import create_app
        from flask_migrate import migrate
        
        app = create_app()
        
        with app.app_context():
            print(f"\n📊 Creating migration: {message}")
            try:
                migrate(message=message)
                print("✅ Migration created successfully!")
            except Exception as e:
                print(f"❌ Migration creation error: {e}")
                import traceback
                traceback.print_exc()
                return False
        
        return True
    except Exception as e:
        print(f"❌ Error creating migration: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    message = sys.argv[1] if len(sys.argv) > 1 else "Auto migration"
    success = create_migration(message)
    sys.exit(0 if success else 1)

