#!/usr/bin/env python3
"""
Load test data into the database
"""

import os
import sys
import logging

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def load_test_data():
    """Load test data into the database"""
    try:
        print("🚀 Loading test data into IBP Database...")
        
        # Import and create app
        from app import create_app
        from app.shared import db
        from app.rest.v1.user.model import User
        from app.rest.v1.role.model import Role
        from app.rest.v1.user_role.model import UserRole
        
        app = create_app()
        
        with app.app_context():
            print("📊 Loading test users...")
            
            # Check if test users already exist
            existing_user = User.query.filter_by(username='test').first()
            if existing_user:
                print("⚠️  Test users already exist. Skipping...")
                return True
            
            # Create test users
            test_user1 = User(
                id=1,
                username='test',
                password='$pbkdf2-sha256$29000$y/lf6/0/p3TOmZMyxthbyw$EDo/LNVEXi9bmqnSrao.Lz4J0x5jhcV7ECbn3HYpd0k',  # password: 'test'
                full_name='John Doe',
                email='test@test.com',
                phone='11111',
                is_blocked=False,
                created_by=1,
                modified_by=1
            )
            
            test_user2 = User(
                id=2,
                username='test2',
                password='$pbkdf2-sha256$29000$y/lf6/0/p3TOmZMyxthbyw$EDo/LNVEXi9bmqnSrao.Lz4J0x5jhcV7ECbn3HYpd0k',  # password: 'test'
                full_name='Jane Doe',
                email='test2@test.com',
                phone='22222',
                is_blocked=False,
                created_by=1,
                modified_by=1
            )
            
            # Check if admin role exists, create if not
            admin_role = Role.query.filter_by(id=1).first()
            if not admin_role:
                admin_role = Role(
                    id=1,
                    name='admin',
                    is_deleted=False,
                    permissions='["full_access"]',
                    phase_ids='[1]',
                    created_by=1,
                    modified_by=1
                )
                db.session.add(admin_role)
            
            # Check if user-role relationship exists, create if not
            user_role = UserRole.query.filter_by(id=1).first()
            if not user_role:
                user_role = UserRole(
                    id=1,
                    user_id=1,
                    role_id=1,
                    is_approved=True,
                    is_delegated=False,
                    created_by=1,
                    modified_by=1
                )
                db.session.add(user_role)
            
            # Add users to database
            db.session.add(test_user1)
            db.session.add(test_user2)
            
            db.session.commit()
            
            print("✅ Test data loaded successfully!")
            print("📋 Test users created:")
            print("   - Username: test, Password: test (Admin)")
            print("   - Username: test2, Password: test (Regular user)")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = load_test_data()
    if success:
        print("\n🎉 Test data loading complete!")
    else:
        print("\n💥 Test data loading failed.")
        sys.exit(1)
