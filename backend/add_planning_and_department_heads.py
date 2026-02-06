"""
Script to add planning_head and department_head users to the database.
These users will have the same password as existing users in the user table.
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
from app.rest.v1.organization.model import Organization


def get_existing_user_password():
    """Get the password hash from an existing user."""
    existing_user = User.query.first()
    if not existing_user:
        raise Exception("No existing users found in the database. Cannot determine password hash.")
    return existing_user.password


def get_or_create_organization():
    """Get the first organization or create a default one."""
    org = Organization.query.first()
    if not org:
        # Create a default organization if none exists
        org = Organization(
            name='Default Organization',
            code='DEFAULT-ORG',
            created_by=1,
            created_on=datetime.now()
        )
        db.session.add(org)
        db.session.commit()
        db.session.refresh(org)
        print(f"[OK] Created default organization: {org.name} (ID: {org.id})")
    return org


def create_user(username, full_name, email, phone=None):
    """Create a user with the same password as existing users."""
    # Check if user already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        print(f"[WARNING] User '{username}' already exists (ID: {existing_user.id}). Skipping...")
        return existing_user
    
    # Get password hash from existing user
    password_hash = get_existing_user_password()
    
    # Get organization
    org = get_or_create_organization()
    
    # Get created_by from first user or use 1
    first_user = User.query.first()
    created_by = first_user.id if first_user else 1
    
    # Create user
    user = User(
        username=username,
        password=password_hash,
        full_name=full_name,
        email=email,
        phone=phone,
        organization_id=org.id,
        password_changed_on=datetime.now(),
        is_blocked=False,
        created_by=created_by,
        created_on=datetime.now()
    )
    
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)
    
    print(f"[OK] Created user: {username} (ID: {user.id})")
    return user


def add_planning_and_department_heads():
    """Add planning_head and department_head users."""
    print("=" * 70)
    print("Adding Planning Head and Department Head Users")
    print("=" * 70)
    
    try:
        app = create_app()
        with app.app_context():
            # Create planning_head user
            print("\n[INFO] Creating planning_head user...")
            planning_head = create_user(
                username='planning_head',
                full_name='Planning Head',
                email='planning.head@example.com',
                phone='0000000001'
            )
            
            # Create department_head user
            print("\n[INFO] Creating department_head user...")
            department_head = create_user(
                username='department_head',
                full_name='Department Head',
                email='department.head@example.com',
                phone='0000000002'
            )
            
            print("\n" + "=" * 70)
            print("SUCCESS")
            print("=" * 70)
            print(f"\n[OK] Planning Head user created: {planning_head.username} (ID: {planning_head.id})")
            print(f"[OK] Department Head user created: {department_head.username} (ID: {department_head.id})")
            print("\n[NOTE] These users have the same password as existing users in the database.")
            print("=" * 70)
            
    except Exception as e:
        print(f"\n[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    add_planning_and_department_heads()

