"""
Script to check passwords for planning_head and program_head users in the database.
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

def check_user_passwords():
    """Check passwords for planning_head and program_head users."""
    print("=" * 70)
    print("Checking User Passwords for planning_head and program_head")
    print("=" * 70)
    
    try:
        app = create_app()
        with app.app_context():
            # Query for planning_head
            print("\n[INFO] Searching for 'planning_head' user...")
            planning_head = User.query.filter_by(username='planning_head').first()
            
            if planning_head:
                print(f"[FOUND] User: {planning_head.username}")
                print(f"  - ID: {planning_head.id}")
                print(f"  - Full Name: {planning_head.full_name}")
                print(f"  - Email: {planning_head.email}")
                print(f"  - Password Hash: {planning_head.password}")
                print(f"  - Password Hash Length: {len(planning_head.password) if planning_head.password else 0}")
                
                # Get user roles
                user_roles = UserRole.query.filter_by(user_id=planning_head.id).all()
                if user_roles:
                    print(f"  - Roles:")
                    for ur in user_roles:
                        role = Role.query.get(ur.role_id)
                        if role:
                            print(f"    * {role.name} (ID: {role.id})")
            else:
                print("[NOT FOUND] User 'planning_head' does not exist in the database")
            
            # Query for program_head (try different variations)
            print("\n[INFO] Searching for 'program_head' user...")
            program_head = User.query.filter_by(username='program_head').first()
            
            if not program_head:
                # Try programme_head (British spelling)
                print("[INFO] Trying 'programme_head' (British spelling)...")
                program_head = User.query.filter_by(username='programme_head').first()
            
            if program_head:
                print(f"[FOUND] User: {program_head.username}")
                print(f"  - ID: {program_head.id}")
                print(f"  - Full Name: {program_head.full_name}")
                print(f"  - Email: {program_head.email}")
                print(f"  - Password Hash: {program_head.password}")
                print(f"  - Password Hash Length: {len(program_head.password) if program_head.password else 0}")
                
                # Get user roles
                user_roles = UserRole.query.filter_by(user_id=program_head.id).all()
                if user_roles:
                    print(f"  - Roles:")
                    for ur in user_roles:
                        role = Role.query.get(ur.role_id)
                        if role:
                            print(f"    * {role.name} (ID: {role.id})")
            else:
                print("[NOT FOUND] User 'program_head' or 'programme_head' does not exist in the database")
            
            # Check if passwords are hashed (they should be)
            print("\n" + "=" * 70)
            print("Password Information:")
            print("=" * 70)
            print("\n[NOTE] Passwords in the database are stored as hashes (encrypted).")
            print("       The actual plain text passwords cannot be retrieved from the database.")
            print("\n       To find the actual password, you need to:")
            print("       1. Check if there's a default password documented")
            print("       2. Check if these users were created with a known password")
            print("       3. Reset the password if needed")
            
            # Check for any users with similar names
            print("\n" + "=" * 70)
            print("Searching for similar usernames...")
            print("=" * 70)
            
            all_users = User.query.filter(
                User.username.like('%planning%') | 
                User.username.like('%program%') |
                User.username.like('%head%')
            ).all()
            
            if all_users:
                print(f"\n[FOUND] {len(all_users)} user(s) with similar usernames:")
                for user in all_users:
                    print(f"  - {user.username} (ID: {user.id}, Email: {user.email})")
            else:
                print("\n[NOT FOUND] No users with similar usernames found")
            
            print("\n" + "=" * 70)
            
    except Exception as e:
        print(f"\n[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    check_user_passwords()

