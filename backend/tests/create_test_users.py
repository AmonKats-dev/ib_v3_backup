"""
Script to create test users for workflow testing.

Creates users with different roles for testing the Normal Workflow:
- Standard User
- Programme Head
- Accounting Officer
- PAP Commissioner
- PAP Assistant Commissioner
- PAP Principal
- PAP Senior Economist
- PAP Economist
- DC Member

All users have the same password for easy testing: Test@1234
"""

import sys
import os
from datetime import datetime, date

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.shared import db
from app.rest.v1.user.model import User
from app.rest.v1.user_role.model import UserRole
from app.rest.v1.role.model import Role
from app.rest.v1.organization.model import Organization

# Role IDs (from dump.sql)
ROLES = {
    'standard_user': 7,
    'programme_head': 8,
    'accounting_officer': 22,
    'pap_commissioner': 19,
    'pap_assistant_commissioner': 23,
    'pap_principal': 24,
    'pap_senior_economist': 25,
    'pap_economist': 26,
    'dc_member': 32
}

# Default password for all test users (meets password requirements)
DEFAULT_PASSWORD = "Test@1234"

# Test users configuration
TEST_USERS = [
    {
        'username': 'standard_user',
        'full_name': 'Standard User Test',
        'email': 'standard.user@test.com',
        'phone': '1111111111',
        'role_id': ROLES['standard_user'],
        'role_name': 'Standard User'
    },
    {
        'username': 'programme_head',
        'full_name': 'Programme Head Test',
        'email': 'programme.head@test.com',
        'phone': '2222222222',
        'role_id': ROLES['programme_head'],
        'role_name': 'Programme Head'
    },
    {
        'username': 'accounting_officer',
        'full_name': 'Accounting Officer Test',
        'email': 'accounting.officer@test.com',
        'phone': '3333333333',
        'role_id': ROLES['accounting_officer'],
        'role_name': 'Accounting Officer'
    },
    {
        'username': 'pap_commissioner',
        'full_name': 'PAP Commissioner Test',
        'email': 'pap.commissioner@test.com',
        'phone': '4444444444',
        'role_id': ROLES['pap_commissioner'],
        'role_name': 'PAP Commissioner'
    },
    {
        'username': 'pap_assistant_commissioner',
        'full_name': 'PAP Assistant Commissioner Test',
        'email': 'pap.assistant@test.com',
        'phone': '5555555555',
        'role_id': ROLES['pap_assistant_commissioner'],
        'role_name': 'PAP Assistant Commissioner'
    },
    {
        'username': 'pap_principal',
        'full_name': 'PAP Principal Test',
        'email': 'pap.principal@test.com',
        'phone': '6666666666',
        'role_id': ROLES['pap_principal'],
        'role_name': 'PAP Principal'
    },
    {
        'username': 'pap_senior_economist',
        'full_name': 'PAP Senior Economist Test',
        'email': 'pap.senior.economist@test.com',
        'phone': '7777777777',
        'role_id': ROLES['pap_senior_economist'],
        'role_name': 'PAP Senior Economist'
    },
    {
        'username': 'pap_economist',
        'full_name': 'PAP Economist Test',
        'email': 'pap.economist@test.com',
        'phone': '8888888888',
        'role_id': ROLES['pap_economist'],
        'role_name': 'PAP Economist'
    },
    {
        'username': 'dc_member',
        'full_name': 'DC Member Test',
        'email': 'dc.member@test.com',
        'phone': '9999999999',
        'role_id': ROLES['dc_member'],
        'role_name': 'DC member'
    }
]


def get_or_create_organization():
    """Get the first organization or create a default one."""
    org = Organization.query.first()
    if not org:
        # Create a default organization if none exists
        org = Organization(
            name='Test Organization',
            code='TEST-ORG',
            created_by=1,
            created_on=datetime.now()
        )
        db.session.add(org)
        db.session.commit()
        db.session.refresh(org)
        print(f"✓ Created default organization: {org.name} (ID: {org.id})")
    return org


def verify_role_exists(role_id, role_name):
    """Verify that a role exists."""
    role = Role.query.get(role_id)
    if not role:
        print(f"✗ Warning: Role '{role_name}' (ID: {role_id}) not found in database")
        return False
    return True


def create_test_user(user_config):
    """Create a test user with the specified configuration."""
    username = user_config['username']
    full_name = user_config['full_name']
    email = user_config['email']
    phone = user_config.get('phone')
    role_id = user_config['role_id']
    role_name = user_config['role_name']
    
    # Verify role exists
    if not verify_role_exists(role_id, role_name):
        return None
    
    # Check if user already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        print(f"⚠ User '{username}' already exists (ID: {existing_user.id}). Skipping...")
        # Update user role if needed
        existing_user_role = UserRole.query.filter_by(
            user_id=existing_user.id,
            role_id=role_id
        ).first()
        
        if not existing_user_role:
            # Create user role
            user_role = UserRole(
                user_id=existing_user.id,
                role_id=role_id,
                is_approved=True,
                is_delegated=False,
                is_delegator=False,
                approved_by=1,
                created_by=1,
                created_on=datetime.now()
            )
            db.session.add(user_role)
            db.session.commit()
            print(f"  ✓ Added role '{role_name}' to existing user")
        return existing_user
    
    # Get organization
    org = get_or_create_organization()
    
    # Hash password
    password_hash = User.generate_hash(DEFAULT_PASSWORD)
    
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
        created_by=1,
        created_on=datetime.now()
    )
    
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)
    
    # Create user role
    user_role = UserRole(
        user_id=user.id,
        role_id=role_id,
        is_approved=True,
        is_delegated=False,
        is_delegator=False,
        approved_by=1,
        created_by=1,
        created_on=datetime.now()
    )
    
    db.session.add(user_role)
    db.session.commit()
    
    print(f"✓ Created user: {username} (ID: {user.id}) - Role: {role_name}")
    return user


def create_all_test_users():
    """Create all test users."""
    print("=" * 70)
    print("Creating Test Users for Workflow Testing")
    print("=" * 70)
    print(f"\nDefault Password for all users: {DEFAULT_PASSWORD}")
    print("\nUsers to be created:")
    print("-" * 70)
    
    created_users = []
    failed_users = []
    
    for user_config in TEST_USERS:
        try:
            user = create_test_user(user_config)
            if user:
                created_users.append({
                    'username': user_config['username'],
                    'email': user_config['email'],
                    'role': user_config['role_name'],
                    'password': DEFAULT_PASSWORD
                })
            else:
                failed_users.append(user_config['username'])
        except Exception as e:
            print(f"✗ Error creating user '{user_config['username']}': {str(e)}")
            failed_users.append(user_config['username'])
    
    # Print summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"\n✓ Successfully created/updated: {len(created_users)} users")
    
    if failed_users:
        print(f"✗ Failed to create: {len(failed_users)} users")
        for username in failed_users:
            print(f"  - {username}")
    
    # Print login credentials
    print("\n" + "=" * 70)
    print("LOGIN CREDENTIALS")
    print("=" * 70)
    print(f"\nPassword for all users: {DEFAULT_PASSWORD}\n")
    print(f"{'Username':<30} {'Email':<35} {'Role':<30}")
    print("-" * 95)
    
    for user_info in created_users:
        print(f"{user_info['username']:<30} {user_info['email']:<35} {user_info['role']:<30}")
    
    print("\n" + "=" * 70)
    print("TESTING INSTRUCTIONS")
    print("=" * 70)
    print("\n1. Use the credentials above to login to the system")
    print("2. Navigate to http://localhost:3000")
    print("3. Test the workflow by:")
    print("   - Login as 'standard_user' and create/submit a project")
    print("   - Login as each role in sequence to approve the project")
    print("   - Follow the workflow: Standard User -> Programme Head -> Accounting Officer ->")
    print("     PAP Commissioner -> PAP Assistant Commissioner -> PAP Principal ->")
    print("     PAP Senior Economist -> PAP Economist -> DC Member")
    print("   - After DC decision, reverse the flow back to Standard User")
    print("\n" + "=" * 70)
    
    return len(created_users), len(failed_users)


if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        try:
            created, failed = create_all_test_users()
            if failed > 0:
                sys.exit(1)
        except Exception as e:
            print(f"\n✗ Fatal error: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

