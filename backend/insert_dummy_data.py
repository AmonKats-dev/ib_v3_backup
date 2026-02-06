"""
Script to insert dummy data for testing:
- Organizations (if needed)
- Functions (Directorates) with organization_id
- Programs with organization_ids matching functions

This helps test the directorate -> program filtering functionality
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
from app.rest.v1.program.model import Program


def get_or_create_organization(app, name, code, parent_id=None, user_id=1):
    """Get existing organization or create a new one"""
    with app.app_context():
        org = Organization.query.filter_by(code=code, is_deleted=False).first()
        if org:
            print(f"Organization '{name}' (code: {code}) already exists (ID: {org.id})")
            return org
        
        org = Organization(
            name=name,
            code=code,
            parent_id=parent_id
        )
        org.created_by = user_id
        org.modified_by = user_id
        db.session.add(org)
        db.session.commit()
        db.session.refresh(org)
        print(f"✓ Created organization: {name} (ID: {org.id}, Code: {code})")
        return org


def create_dummy_function(app, name, code, organization_id, parent_id=None, user_id=1):
    """Create a dummy function (directorate)"""
    with app.app_context():
        existing = Function.query.filter_by(code=code, is_deleted=False).first()
        if existing:
            print(f"Function '{name}' (code: {code}) already exists (ID: {existing.id})")
            # Update organization_id if it's missing
            if not existing.organization_id and organization_id:
                existing.organization_id = organization_id
                existing.modified_by = user_id
                existing.save()
                print(f"  ✓ Updated organization_id to {organization_id}")
            return existing
        
        function = Function(
            name=name,
            code=code,
            organization_id=organization_id,
            parent_id=parent_id
        )
        function.created_by = user_id
        function.modified_by = user_id
        db.session.add(function)
        db.session.commit()
        db.session.refresh(function)
        print(f"✓ Created function: {name} (ID: {function.id}, Code: {code}, Org ID: {organization_id})")
        return function


def create_dummy_program(app, name, code, organization_ids, parent_id=None, function_id=None, user_id=1):
    """Create a dummy program"""
    with app.app_context():
        existing = Program.query.filter_by(code=code, is_deleted=False).first()
        if existing:
            print(f"Program '{name}' (code: {code}) already exists (ID: {existing.id})")
            # Update organization_ids if provided
            if organization_ids:
                org_ids_str = ','.join(map(str, organization_ids))
                if existing.organization_ids != org_ids_str:
                    existing.organization_ids = org_ids_str
                    existing.modified_by = user_id
                    existing.save()
                    print(f"  ✓ Updated organization_ids to {org_ids_str}")
            # Update function_id if provided and column exists
            if function_id:
                try:
                    if hasattr(existing, 'function_id'):
                        existing.function_id = function_id
                        existing.modified_by = user_id
                        existing.save()
                        print(f"  ✓ Updated function_id to {function_id}")
                except Exception as e:
                    print(f"  ⚠ Could not update function_id (column may not exist): {e}")
            return existing
        
        org_ids_str = ','.join(map(str, organization_ids)) if organization_ids else None
        
        program = Program(
            name=name,
            code=code,
            organization_ids=org_ids_str,
            parent_id=parent_id
        )
        program.created_by = user_id
        program.modified_by = user_id
        
        # Set function_id if column exists
        if function_id:
            try:
                if hasattr(Program, 'function_id'):
                    program.function_id = function_id
            except Exception:
                pass  # Column doesn't exist yet
        
        db.session.add(program)
        db.session.commit()
        db.session.refresh(program)
        print(f"✓ Created program: {name} (ID: {program.id}, Code: {code}, Org IDs: {org_ids_str})")
        return program


def main():
    print("\n" + "=" * 80)
    print("DUMMY DATA INSERTION SCRIPT")
    print("=" * 80)
    print("\nThis script will create:")
    print("1. Organizations (if they don't exist)")
    print("2. Functions (Directorates) with organization_id")
    print("3. Programs with organization_ids matching the functions")
    print("\n" + "=" * 80)
    
    app = create_app()
    
    with app.app_context():
        # Create organizations
        print("\n" + "=" * 80)
        print("STEP 1: Creating Organizations")
        print("=" * 80)
        
        org1 = get_or_create_organization(app, "Ministry of Health", "MOH", None, 1)
        org2 = get_or_create_organization(app, "Ministry of Education", "MOE", None, 1)
        org3 = get_or_create_organization(app, "Ministry of Infrastructure", "MOI", None, 1)
        
        # Create functions (directorates)
        print("\n" + "=" * 80)
        print("STEP 2: Creating Functions (Directorates)")
        print("=" * 80)
        
        func1 = create_dummy_function(app, "Health Services Directorate", "HSD", org1.id, None, 1)
        func2 = create_dummy_function(app, "Public Health Directorate", "PHD", org1.id, None, 1)
        func3 = create_dummy_function(app, "Primary Education Directorate", "PED", org2.id, None, 1)
        func4 = create_dummy_function(app, "Secondary Education Directorate", "SED", org2.id, None, 1)
        func5 = create_dummy_function(app, "Road Infrastructure Directorate", "RID", org3.id, None, 1)
        
        # Create programs
        print("\n" + "=" * 80)
        print("STEP 3: Creating Programs")
        print("=" * 80)
        
        # Programs for Health Services Directorate (func1)
        create_dummy_program(app, "Rural Health Centers Program", "RHC001", [org1.id], None, func1.id, 1)
        create_dummy_program(app, "Hospital Equipment Program", "HEP001", [org1.id], None, func1.id, 1)
        create_dummy_program(app, "Medical Supplies Program", "MSP001", [org1.id], None, func1.id, 1)
        
        # Programs for Public Health Directorate (func2)
        create_dummy_program(app, "Immunization Program", "IMP001", [org1.id], None, func2.id, 1)
        create_dummy_program(app, "Disease Prevention Program", "DPP001", [org1.id], None, func2.id, 1)
        create_dummy_program(app, "Health Education Program", "HEP002", [org1.id], None, func2.id, 1)
        
        # Programs for Primary Education Directorate (func3)
        create_dummy_program(app, "Primary School Construction", "PSC001", [org2.id], None, func3.id, 1)
        create_dummy_program(app, "Teacher Training Program", "TTP001", [org2.id], None, func3.id, 1)
        create_dummy_program(app, "Textbook Distribution", "TBD001", [org2.id], None, func3.id, 1)
        
        # Programs for Secondary Education Directorate (func4)
        create_dummy_program(app, "Secondary School Infrastructure", "SSI001", [org2.id], None, func4.id, 1)
        create_dummy_program(app, "Vocational Training Program", "VTP001", [org2.id], None, func4.id, 1)
        
        # Programs for Road Infrastructure Directorate (func5)
        create_dummy_program(app, "Rural Road Development", "RRD001", [org3.id], None, func5.id, 1)
        create_dummy_program(app, "Highway Maintenance Program", "HMP001", [org3.id], None, func5.id, 1)
        create_dummy_program(app, "Bridge Construction Program", "BCP001", [org3.id], None, func5.id, 1)
        
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"\n✓ Created/Updated {3} organizations")
        print(f"✓ Created/Updated {5} functions (directorates)")
        print(f"✓ Created/Updated {12} programs")
        print("\n" + "=" * 80)
        print("TESTING INSTRUCTIONS")
        print("=" * 80)
        print("\n1. Go to http://localhost:3000/#/projects/create")
        print("2. Select a Directorate (Function):")
        print("   - Health Services Directorate (should show 3 programs)")
        print("   - Public Health Directorate (should show 3 programs)")
        print("   - Primary Education Directorate (should show 3 programs)")
        print("   - Secondary Education Directorate (should show 2 programs)")
        print("   - Road Infrastructure Directorate (should show 3 programs)")
        print("3. Verify that only programs linked to the selected directorate are displayed")
        print("\n" + "=" * 80)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nExiting...")
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()

