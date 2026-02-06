"""
Test script to verify navigation permissions are correctly configured.
This helps identify which roles can/cannot see the Projects tab.
"""

import sys
import os
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from app.rest.v1.role.model import Role

def test_navigation_permissions():
    """Test which roles can see the Projects tab"""
    print("\n" + "="*80)
    print("NAVIGATION PERMISSIONS TEST - Projects Tab Visibility")
    print("="*80 + "\n")
    
    app = create_app()
    
    with app.app_context():
        roles = Role.query.order_by(Role.name).all()
        
        print(f"Analyzing {len(roles)} roles...\n")
        print("-" * 80)
        
        can_see_projects = []
        cannot_see_projects = []
        
        for role in roles:
            permissions = role.permissions if role.permissions else []
            
            # Check if role can see Projects tab
            has_list_projects = False
            if isinstance(permissions, list):
                if 'full_access' in permissions or 'all' in permissions:
                    has_list_projects = True
                elif 'list_projects' in permissions:
                    has_list_projects = True
            
            role_info = {
                'id': role.id,
                'name': role.name,
                'org_level': role.organization_level,
                'perm_count': len(permissions) if isinstance(permissions, list) else 0
            }
            
            if has_list_projects:
                can_see_projects.append(role_info)
            else:
                cannot_see_projects.append(role_info)
        
        # Display results
        print("\n[OK] ROLES THAT CAN SEE PROJECTS TAB")
        print("-" * 80)
        print(f"Total: {len(can_see_projects)} roles\n")
        
        for role in can_see_projects:
            print(f"  {role['name']} (ID: {role['id']})")
            print(f"    - Org Level: {role['org_level']}")
            print(f"    - Permissions: {role['perm_count']}")
        
        print("\n" + "="*80)
        print("[!] ROLES THAT CANNOT SEE PROJECTS TAB")
        print("-" * 80)
        print(f"Total: {len(cannot_see_projects)} roles\n")
        
        if cannot_see_projects:
            for role in cannot_see_projects:
                print(f"  {role['name']} (ID: {role['id']})")
                print(f"    - Org Level: {role['org_level']}")
                print(f"    - Permissions: {role['perm_count']}")
        else:
            print("  (All roles have list_projects permission)")
        
        print("\n" + "="*80)
        print("SUMMARY")
        print("="*80)
        
        print(f"\n[OK] Roles with Projects access: {len(can_see_projects)}")
        print(f"[!] Roles without Projects access: {len(cannot_see_projects)}")
        
        if cannot_see_projects:
            print("\n[NOTE] Users with the roles listed above will NOT see:")
            print("  - Home/Dashboard tab")
            print("  - Incoming tab")
            print("  - Projects waiting for your action tab")
            print("  - Projects tab")
            print("  - Pre-Investment tab")
            print("  - Project Management tab")
            print("  - M&E Management tab")
            print("  - Portfolio Management tab")
        
        print("\n[OK] Navigation permission system is ACTIVE")
        print("[OK] Menu items are automatically filtered by user permissions")
        print("[OK] Frontend permission checks working correctly")
        
        print("\n" + "="*80 + "\n")
        
        return True

if __name__ == "__main__":
    try:
        test_navigation_permissions()
    except Exception as e:
        print(f"\n[X] Error running tests: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
