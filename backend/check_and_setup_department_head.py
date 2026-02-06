"""
Script to check and setup department_head user password and role.
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
from app.rest.v1.user_role.model import UserRole
from app.rest.v1.role.model import Role

# Password hash for "Test@1234" - same as programme_head
PASSWORD_HASH = "$pbkdf2-sha256$29000$9R6jdO597703pjSG8N77/w$XRLjt2qusrFNaRPdLCCxugK6M5xF9QZTNjHiiYaaiBk"

# Role ID for "Department Head" (from workflow step 2)
DEPARTMENT_HEAD_ROLE_ID = 21

def check_and_setup_department_head():
    """Check and setup department_head user password and role."""
    print("=" * 70)
    print("Checking and Setting Up department_head User")
    print("=" * 70)
    
    try:
        app = create_app()
        with app.app_context():
            # Find department_head user
            print("\n[INFO] Searching for 'department_head' user...")
            department_head = User.query.filter_by(username='department_head').first()
            
            if not department_head:
                print("[ERROR] User 'department_head' not found in the database.")
                sys.exit(1)
            
            print(f"[FOUND] User: {department_head.username}")
            print(f"  - ID: {department_head.id}")
            print(f"  - Full Name: {department_head.full_name}")
            print(f"  - Email: {department_head.email}")
            print(f"  - Current Password Hash: {department_head.password}")
            print(f"  - Password Hash Length: {len(department_head.password) if department_head.password else 0}")
            
            # Check current password
            password_matches = department_head.password == PASSWORD_HASH
            print(f"  - Password matches Test@1234: {password_matches}")
            
            # Check existing roles
            print(f"\n[INFO] Checking existing roles...")
            user_roles = UserRole.query.filter_by(user_id=department_head.id).all()
            if user_roles:
                print(f"  - Found {len(user_roles)} user_role(s):")
                for ur in user_roles:
                    role = Role.query.get(ur.role_id)
                    approved_status = "APPROVED" if ur.is_approved else "NOT APPROVED"
                    if role:
                        print(f"    * {role.name} (ID: {role.id}) - {approved_status}")
            else:
                print("  - No roles assigned")
            
            # Update password if needed
            if not password_matches:
                print(f"\n[INFO] Updating password to 'Test@1234'...")
                department_head.password = PASSWORD_HASH
                department_head.password_changed_on = datetime.now()
                db.session.commit()
                print("[OK] Password updated successfully")
            else:
                print("\n[OK] Password is already set to 'Test@1234'")
            
            # Find Department Head role
            print(f"\n[INFO] Searching for role with ID {DEPARTMENT_HEAD_ROLE_ID}...")
            role = Role.query.get(DEPARTMENT_HEAD_ROLE_ID)
            
            if not role:
                print(f"[ERROR] Role with ID {DEPARTMENT_HEAD_ROLE_ID} not found.")
                print("[INFO] Searching for roles with 'Department' in the name...")
                roles = Role.query.filter(Role.name.like('%Department%')).all()
                if roles:
                    print("[FOUND] Roles with 'Department' in name:")
                    for r in roles:
                        print(f"  - {r.name} (ID: {r.id})")
                    if len(roles) == 1:
                        role = roles[0]
                        print(f"[INFO] Using role: {role.name} (ID: {role.id})")
                    else:
                        print("[ERROR] Multiple department roles found. Please specify which one to use.")
                        sys.exit(1)
                else:
                    print("[ERROR] No department roles found in database.")
                    sys.exit(1)
            else:
                print(f"[FOUND] Role: {role.name} (ID: {role.id})")
            
            # Check if user_role already exists
            print(f"\n[INFO] Checking for existing user_role assignment...")
            existing_user_role = UserRole.query.filter_by(
                user_id=department_head.id,
                role_id=role.id
            ).first()
            
            if existing_user_role:
                print(f"[FOUND] User role already exists (ID: {existing_user_role.id})")
                
                # Update to ensure it's approved
                if not existing_user_role.is_approved:
                    print("[INFO] Updating user_role to be approved...")
                    existing_user_role.is_approved = True
                    if not existing_user_role.approved_by:
                        first_user = User.query.first()
                        existing_user_role.approved_by = first_user.id if first_user else department_head.id
                    db.session.commit()
                    print("[OK] User role updated and approved")
                else:
                    print("[OK] User role is already approved")
            else:
                # Create new user_role
                print("[INFO] Creating new user_role assignment...")
                
                # Get first user for approved_by
                first_user = User.query.first()
                approved_by = first_user.id if first_user else department_head.id
                
                user_role = UserRole(
                    user_id=department_head.id,
                    role_id=role.id,
                    is_approved=True,
                    approved_by=approved_by,
                    is_delegated=False,
                    is_delegator=False,
                    created_by=approved_by,
                    created_on=datetime.now()
                )
                
                db.session.add(user_role)
                db.session.commit()
                print(f"[OK] User role created successfully (ID: {user_role.id})")
            
            # Verify the assignment
            print("\n[INFO] Verifying final setup...")
            user_roles = UserRole.query.filter_by(
                user_id=department_head.id,
                is_approved=True
            ).all()
            
            # Verify password
            if User.verify_hash("Test@1234", department_head.password):
                print("[OK] Password verification successful - 'Test@1234' works!")
            else:
                print("[WARNING] Password verification failed - please check the hash")
            
            if user_roles:
                print(f"[OK] User has {len(user_roles)} approved role(s):")
                for ur in user_roles:
                    role_obj = Role.query.get(ur.role_id)
                    if role_obj:
                        print(f"  - {role_obj.name} (ID: {role_obj.id})")
            else:
                print("[WARNING] User has no approved roles!")
            
            print("\n" + "=" * 70)
            print("SUCCESS")
            print("=" * 70)
            print(f"\n[OK] department_head user setup complete:")
            print(f"  - Username: {department_head.username}")
            print(f"  - Password: Test@1234")
            print(f"  - Email: {department_head.email}")
            print(f"  - ID: {department_head.id}")
            if user_roles:
                print(f"  - Role: {role.name} (ID: {role.id})")
            print(f"\n[OK] User can now login successfully.")
            print("=" * 70)
            
    except Exception as e:
        print(f"\n[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    check_and_setup_department_head()

