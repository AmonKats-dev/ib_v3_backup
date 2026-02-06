"""
Simple script to update the database with latest migrations.
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
from flask_migrate import upgrade, current

def update_database():
    """Update database to latest migration version."""
    print("=" * 70)
    print("Updating Database")
    print("=" * 70)
    
    try:
        app = create_app()
        
        with app.app_context():
            # Check current migration version
            try:
                current_rev = current()
                print(f"\n[INFO] Current migration version: {current_rev}")
            except Exception as e:
                print(f"\n[INFO] No current migration version: {e}")
                print("[INFO] This is normal for a new database.")
            
            # Run migrations
            print("\n[INFO] Upgrading database to latest migration...")
            try:
                upgrade()
                print("\n[SUCCESS] Database migrations completed successfully!")
                print("=" * 70)
                return True
            except Exception as e:
                print(f"\n[WARNING] Migration completed with message: {e}")
                # Check if it's just a warning or actual error
                if "already" in str(e).lower() or "current" in str(e).lower():
                    print("[SUCCESS] Database is already up to date!")
                    print("=" * 70)
                    return True
                else:
                    print("[ERROR] Migration failed!")
                    import traceback
                    traceback.print_exc()
                    return False
                    
    except Exception as e:
        print(f"\n[ERROR] Error during database update: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = update_database()
    sys.exit(0 if success else 1)

