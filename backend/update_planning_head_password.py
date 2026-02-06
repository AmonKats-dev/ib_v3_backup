"""
Script to update planning_head user password to Test@1234 (same as programme_head).
"""

import sys
import os
from datetime import datetime

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Set environment
os.environ['APP_ENV'] = 'local'

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from app.rest.v1.user.model import User

# Password hash for "Test@1234" - this is the same hash used for programme_head
# Generated using: pbkdf2_sha256.encrypt("Test@1234")
PASSWORD_HASH = "$pbkdf2-sha256$29000$9R6jdO597703pjSG8N77/w$XRLjt2qusrFNaRPdLCCxugK6M5xF9QZTNjHiiYaaiBk"

def update_planning_head_password():
    """Update planning_head user password to Test@1234."""
    print("=" * 70)
    print("Updating planning_head User Password")
    print("=" * 70)
    
    try:
        app = create_app()
        with app.app_context():
            # Find planning_head user
            print("\n[INFO] Searching for 'planning_head' user...")
            planning_head = User.query.filter_by(username='planning_head').first()
            
            if not planning_head:
                print("[ERROR] User 'planning_head' not found in the database.")
                print("[INFO] Creating new planning_head user...")
                
                # Get first user for created_by and organization
                first_user = User.query.first()
                if not first_user:
                    print("[ERROR] No users found in database. Cannot create planning_head.")
                    sys.exit(1)
                
                # Get first organization
                from app.rest.v1.organization.model import Organization
                org = Organization.query.first()
                if not org:
                    print("[ERROR] No organizations found in database. Cannot create planning_head.")
                    sys.exit(1)
                
                # Create new user
                planning_head = User(
                    username='planning_head',
                    password=PASSWORD_HASH,
                    full_name='Planning Head',
                    email='planning.head@example.com',
                    phone='0000000001',
                    organization_id=org.id,
                    password_changed_on=datetime.now(),
                    is_blocked=False,
                    created_by=first_user.id,
                    created_on=datetime.now()
                )
                db.session.add(planning_head)
                db.session.commit()
                print(f"[OK] Created new planning_head user (ID: {planning_head.id})")
            else:
                print(f"[FOUND] User: {planning_head.username} (ID: {planning_head.id})")
                
                # Update password
                print("\n[INFO] Updating password to 'Test@1234'...")
                planning_head.password = PASSWORD_HASH
                planning_head.password_changed_on = datetime.now()
                db.session.commit()
                print("[OK] Password updated successfully")
            
            # Verify the password hash
            print(f"\n[INFO] Verifying password hash...")
            print(f"  - Password Hash: {planning_head.password}")
            print(f"  - Hash matches programme_head: {planning_head.password == PASSWORD_HASH}")
            
            # Verify password works
            if User.verify_hash("Test@1234", planning_head.password):
                print("[OK] Password verification successful - 'Test@1234' works!")
            else:
                print("[WARNING] Password verification failed - please check the hash")
            
            print("\n" + "=" * 70)
            print("SUCCESS")
            print("=" * 70)
            print(f"\n[OK] planning_head user updated:")
            print(f"  - Username: {planning_head.username}")
            print(f"  - Password: Test@1234")
            print(f"  - Email: {planning_head.email}")
            print(f"  - ID: {planning_head.id}")
            print("\n[NOTE] The password is now the same as programme_head user.")
            print("=" * 70)
            
    except Exception as e:
        print(f"\n[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    update_planning_head_password()

