"""
Script to insert data into the coa_function table
This will help ensure functions have valid organization_id values
"""
import sys
import os

# Fix Windows console encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from app.rest.v1.function.model import Function
from app.rest.v1.organization.model import Organization

def get_organizations(app):
    """Get list of available organizations"""
    with app.app_context():
        organizations = Organization.query.filter_by(is_deleted=False).all()
        return organizations

def list_organizations(app):
    """List all available organizations"""
    print("\n" + "=" * 80)
    print("AVAILABLE ORGANIZATIONS")
    print("=" * 80)
    organizations = get_organizations(app)
    if not organizations:
        print("\nNo organizations found in database!")
        print("Please create at least one organization first.")
        return []
    
    print(f"\nFound {len(organizations)} organization(s):\n")
    for org in organizations:
        print(f"  ID: {org.id}, Name: {org.name}, Code: {org.code}")
    print()
    return organizations

def insert_function(app, name, code, organization_id, parent_id=None, user_id=1):
    """Insert a function into the coa_function table"""
    with app.app_context():
        try:
            # Check if function with same code already exists
            existing = Function.query.filter_by(code=code, is_deleted=False).first()
            if existing:
                print(f"WARNING: Function with code '{code}' already exists (ID: {existing.id})")
                return existing
            
            # Validate organization exists
            org = Organization.query.filter_by(id=organization_id, is_deleted=False).first()
            if not org:
                print(f"ERROR: Organization with ID {organization_id} does not exist!")
                return None
            
            # Validate parent function exists if provided
            if parent_id is not None:
                parent = Function.query.filter_by(id=parent_id, is_deleted=False).first()
                if not parent:
                    print(f"ERROR: Parent function with ID {parent_id} does not exist!")
                    print("Available parent functions:")
                    parents = Function.query.filter_by(is_deleted=False).all()
                    for p in parents:
                        print(f"  ID: {p.id}, Code: {p.code}, Name: {p.name}")
                    return None
            
            # Create new function (level will be calculated automatically by the event listener)
            function = Function(
                name=name,
                code=code,
                organization_id=organization_id,
                parent_id=parent_id
                # Don't set level - it will be calculated automatically
                # created_by and modified_by will be set before save()
            )
            
            # Set created_by and modified_by before saving
            # These are required fields and must be set before commit
            function.created_by = user_id
            function.modified_by = user_id
            
            # Add to session and commit directly (bypassing save() which tries to get JWT)
            db.session.add(function)
            db.session.commit()
            db.session.refresh(function)
            
            print(f"SUCCESS: Successfully created function:")
            print(f"   ID: {function.id}")
            print(f"   Name: {function.name}")
            print(f"   Code: {function.code}")
            print(f"   Organization ID: {function.organization_id}")
            print(f"   Organization Name: {org.name}")
            print(f"   Parent ID: {function.parent_id}")
            print(f"   Level: {function.level}")
            
            return function
            
        except Exception as e:
            db.session.rollback()
            print(f"ERROR creating function: {e}")
            import traceback
            traceback.print_exc()
            return None

def update_function_organization(app, function_id, organization_id, user_id=1):
    """Update an existing function's organization_id"""
    with app.app_context():
        try:
            function = Function.query.filter_by(id=function_id, is_deleted=False).first()
            if not function:
                print(f"ERROR: Function with ID {function_id} does not exist!")
                return False
            
            # Validate organization exists
            org = Organization.query.filter_by(id=organization_id, is_deleted=False).first()
            if not org:
                print(f"ERROR: Organization with ID {organization_id} does not exist!")
                return False
            
            old_org_id = function.organization_id
            function.organization_id = organization_id
            function.modified_by = user_id  # Update modified_by for audit trail
            function.save()  # Use save() method which handles audit fields properly
            
            print(f"SUCCESS: Successfully updated function ID {function_id}:")
            print(f"   Name: {function.name}")
            print(f"   Code: {function.code}")
            print(f"   Old Organization ID: {old_org_id}")
            print(f"   New Organization ID: {function.organization_id}")
            print(f"   Organization Name: {org.name}")
            
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"ERROR updating function: {e}")
            import traceback
            traceback.print_exc()
            return False

def list_functions(app):
    """List all functions"""
    with app.app_context():
        functions = Function.query.filter_by(is_deleted=False).all()
        print("\n" + "=" * 80)
        print("EXISTING FUNCTIONS")
        print("=" * 80)
        
        if not functions:
            print("\nNo functions found in database!")
            return []
        
        print(f"\nFound {len(functions)} function(s):\n")
        for func in functions:
            org_info = f"Org ID: {func.organization_id}" if func.organization_id else "No Organization"
            print(f"  ID: {func.id}, Code: {func.code}, Name: {func.name}, {org_info}")
        print()
        return functions

def main():
    print("\n" + "=" * 80)
    print("FUNCTION DATA INSERTION SCRIPT")
    print("=" * 80)
    print("\nThis script helps you:")
    print("1. List existing functions")
    print("2. List available organizations")
    print("3. Insert new functions with organization_id")
    print("4. Update existing functions' organization_id")
    print("\n" + "=" * 80)
    
    # Create app context
    app = create_app()
    
    # List existing functions
    list_functions(app)
    
    # List available organizations
    organizations = list_organizations(app)
    
    if not organizations:
        print("Cannot proceed without organizations. Please create organizations first.")
        return
    
    print("\n" + "=" * 80)
    print("OPTIONS")
    print("=" * 80)
    print("\n1. Insert a new function")
    print("2. Update an existing function's organization_id")
    print("3. Exit")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        print("\n" + "=" * 80)
        print("INSERT NEW FUNCTION")
        print("=" * 80)
        
        name = input("\nEnter function name: ").strip()
        code = input("Enter function code: ").strip()
        
        print("\nSelect organization:")
        for org in organizations:
            print(f"  {org.id}. {org.name} (Code: {org.code})")
        
        try:
            org_id = int(input("\nEnter organization ID: ").strip())
            if not any(org.id == org_id for org in organizations):
                print("❌ Invalid organization ID!")
                return
        except ValueError:
            print("❌ Invalid input! Please enter a number.")
            return
        
        # Show available parent functions
        print("\nAvailable parent functions (optional):")
        with app.app_context():
            parents = Function.query.filter_by(is_deleted=False).all()
            if parents:
                for p in parents:
                    print(f"  ID: {p.id}, Code: {p.code}, Name: {p.name}")
            else:
                print("  (No parent functions available)")
        
        parent_id_input = input("\nEnter parent function ID (optional, press Enter to skip): ").strip()
        parent_id = int(parent_id_input) if parent_id_input else None
        
        # Get user ID for audit fields (default to 1 if not specified)
        user_id_input = input("\nEnter user ID for created_by/modified_by (default: 1, press Enter for default): ").strip()
        user_id = int(user_id_input) if user_id_input else 1
        
        # Level will be calculated automatically, so we don't need to ask for it
        insert_function(app, name, code, org_id, parent_id, user_id)
        
    elif choice == "2":
        print("\n" + "=" * 80)
        print("UPDATE FUNCTION ORGANIZATION")
        print("=" * 80)
        
        functions = list_functions(app)
        if not functions:
            print("No functions to update!")
            return
        
        try:
            func_id = int(input("\nEnter function ID to update: ").strip())
            if not any(func.id == func_id for func in functions):
                print("ERROR: Invalid function ID!")
                return
        except ValueError:
            print("ERROR: Invalid input! Please enter a number.")
            return
        
        print("\nSelect new organization:")
        for org in organizations:
            print(f"  {org.id}. {org.name} (Code: {org.code})")
        
        try:
            org_id = int(input("\nEnter organization ID: ").strip())
            if not any(org.id == org_id for org in organizations):
                print("ERROR: Invalid organization ID!")
                return
        except ValueError:
            print("ERROR: Invalid input! Please enter a number.")
            return
        
        # Get user ID for audit fields (default to 1 if not specified)
        user_id_input = input("\nEnter user ID for modified_by (default: 1, press Enter for default): ").strip()
        user_id = int(user_id_input) if user_id_input else 1
        
        update_function_organization(app, func_id, org_id, user_id)
        
    elif choice == "3":
        print("\nExiting...")
        return
    else:
        print("ERROR: Invalid choice!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nExiting...")
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()

