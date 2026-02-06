#!/usr/bin/env python3
"""
Restore database schema and insert test credentials
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

def restore_schema_and_test_data():
    """Restore database schema and insert test credentials"""
    try:
        print("🚀 Starting database restoration and test data setup...")
        
        # Import and create app
        from app import create_app
        from app.shared import db
        from flask_migrate import upgrade
        from sqlalchemy import text
        
        app = create_app()
        
        with app.app_context():
            # Step 1: Restore database schema using migrations
            print("\n📊 Step 1: Restoring database schema using migrations...")
            try:
                upgrade()
                print("✅ Database schema restored successfully!")
            except Exception as e:
                print(f"⚠️  Migration warning (may be expected if already up to date): {e}")
                # Continue anyway as migrations might already be applied
            
            # Step 2: Insert test credentials
            print("\n📊 Step 2: Inserting test credentials...")
            
            # Read SQL files
            sql_dir = os.path.join(os.path.dirname(__file__), 'tests')
            
            # Insert role if it doesn't exist
            try:
                existing_role = db.session.execute(
                    text("SELECT id FROM `role` WHERE id = 1")
                ).fetchone()
                if not existing_role:
                    with open(os.path.join(sql_dir, 'data_role.sql'), 'r', encoding='utf-8') as f:
                        role_sql = f.read()
                    db.session.execute(text(role_sql))
                    db.session.commit()
                    print("✅ Admin role inserted")
                else:
                    print("ℹ️  Admin role already exists")
            except Exception as e:
                print(f"⚠️  Role insertion: {e}")
                db.session.rollback()
            
            # Insert users if they don't exist
            try:
                existing_user = db.session.execute(
                    text("SELECT id FROM `user` WHERE username = 'test'")
                ).fetchone()
                if not existing_user:
                    with open(os.path.join(sql_dir, 'data_user.sql'), 'r', encoding='utf-8') as f:
                        user_sql = f.read()
                    db.session.execute(text(user_sql))
                    db.session.commit()
                    print("✅ Test users inserted")
                else:
                    print("ℹ️  Test users already exist")
            except Exception as e:
                print(f"⚠️  User insertion: {e}")
                db.session.rollback()
            
            # Insert user_role relationship if it doesn't exist
            try:
                existing_user_role = db.session.execute(
                    text("SELECT id FROM `user_role` WHERE id = 1")
                ).fetchone()
                if not existing_user_role:
                    with open(os.path.join(sql_dir, 'data_user_role.sql'), 'r', encoding='utf-8') as f:
                        user_role_sql = f.read()
                    db.session.execute(text(user_role_sql))
                    db.session.commit()
                    print("✅ User-role relationship inserted")
                else:
                    print("ℹ️  User-role relationship already exists")
            except Exception as e:
                print(f"⚠️  User-role insertion: {e}")
                db.session.rollback()
            
            print("\n✅ Database restoration and test data setup complete!")
            print("\n📋 Test credentials:")
            print("   - Username: test, Password: test (Admin)")
            print("   - Username: test2, Password: test (Regular user)")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = restore_schema_and_test_data()
    if success:
        print("\n🎉 Setup complete!")
    else:
        print("\n💥 Setup failed.")
        sys.exit(1)

