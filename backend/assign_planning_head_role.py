"""
Script to assign the "Head Planning" role to planning_head user.
"""

import sys
import os
from datetime import datetime, date

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

# Role ID for "Head Planning" (from workflow step 3)
PLANNING_HEAD_ROLE_ID = 12

def assign_planning_head_role():
    """Assign Head Planning role to planning_head user."""
    print("=" * 70)
    print("Assigning Head Planning Role to planning_head User")
    print("=" * 70)
    
    try:
        app = create_app()
        with app.app_context():
            # Find planning_head user
            print("\n[INFO] Searching for 'planning_head' user...")
            planning_head = User.query.filter_by(username='planning_head').first()
            
            if not planning_head:
                print("[ERROR] User 'planning_head' not found in the database.")
                print("[INFO] Please create the user first using update_planning_head_password.py")
                sys.exit(1)
            
            print(f"[FOUND] User: {planning_head.username} (ID: {planning_head.id})")
            
            # Find Head Planning role
            print(f"\n[INFO] Searching for role with ID {PLANNING_HEAD_ROLE_ID}...")
            role = Role.query.get(PLANNING_HEAD_ROLE_ID)
            
            if not role:
                print(f"[ERROR] Role with ID {PLANNING_HEAD_ROLE_ID} not found.")
                print("[INFO] Searching for roles with 'Planning' in the name...")
                roles = Role.query.filter(Role.name.like('%Planning%')).all()
                if roles:
                    print("[FOUND] Roles with 'Planning' in name:")
                    for r in roles:
                        print(f"  - {r.name} (ID: {r.id})")
                    if len(roles) == 1:
                        role = roles[0]
                        print(f"[INFO] Using role: {role.name} (ID: {role.id})")
                    else:
                        print("[ERROR] Multiple planning roles found. Please specify which one to use.")
                        sys.exit(1)
                else:
                    print("[ERROR] No planning roles found in database.")
                    sys.exit(1)
            else:
                print(f"[FOUND] Role: {role.name} (ID: {role.id})")
            
            # Check if user_role already exists
            print(f"\n[INFO] Checking for existing user_role assignment...")
            existing_user_role = UserRole.query.filter_by(
                user_id=planning_head.id,
                role_id=role.id
            ).first()
            
            if existing_user_role:
                print(f"[FOUND] User role already exists (ID: {existing_user_role.id})")
                
                # Update to ensure it's approved
                if not existing_user_role.is_approved:
                    print("[INFO] Updating user_role to be approved...")
                    existing_user_role.is_approved = True
                    existing_user_role.approved_by = planning_head.id
                    db.session.commit()
                    print("[OK] User role updated and approved")
                else:
                    print("[OK] User role is already approved")
            else:
                # Create new user_role
                print("[INFO] Creating new user_role assignment...")
                
                # Get first user for approved_by
                first_user = User.query.first()
                approved_by = first_user.id if first_user else planning_head.id
                
                user_role = UserRole(
                    user_id=planning_head.id,
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
            print("\n[INFO] Verifying role assignment...")
            user_roles = UserRole.query.filter_by(
                user_id=planning_head.id,
                is_approved=True
            ).all()
            
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
            print(f"\n[OK] planning_head user now has the '{role.name}' role assigned.")
            print(f"[OK] User can now login successfully.")
            print("=" * 70)
            
    except Exception as e:
        print(f"\n[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    assign_planning_head_role()

