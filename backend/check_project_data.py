"""
Script to check project creation data and verify organizations exist
This helps debug "Organization not found" errors
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
from app.rest.v1.organization.model import Organization
from app.rest.v1.function.model import Function
from app.rest.v1.program.model import Program
from app.rest.v1.project.model import Project


def check_organization(org_id):
    """Check if organization exists and has required data"""
    print(f"\n{'='*80}")
    print(f"CHECKING ORGANIZATION ID: {org_id}")
    print(f"{'='*80}")
    
    org = Organization.query.filter_by(id=org_id).first()
    
    if not org:
        print(f"❌ Organization {org_id} does NOT exist in database")
        return False
    
    print(f"✓ Organization exists:")
    print(f"   ID: {org.id}")
    print(f"   Name: {org.name}")
    print(f"   Code: {org.code if hasattr(org, 'code') and org.code else '❌ MISSING CODE'}")
    print(f"   Parent ID: {org.parent_id if hasattr(org, 'parent_id') else 'N/A'}")
    print(f"   Level: {org.level if hasattr(org, 'level') else 'N/A'}")
    print(f"   Is Deleted: {org.is_deleted if hasattr(org, 'is_deleted') else 'N/A'}")
    
    if not hasattr(org, 'code') or not org.code:
        print(f"\n❌ PROBLEM: Organization {org_id} has no code! This will cause project creation to fail.")
        print(f"   The organization needs a 'code' field to generate project codes.")
        return False
    
    # Check parents
    from app.utils import get_all_parents
    parents = get_all_parents(org)
    print(f"\n   Parents: {len(parents)} parent(s)")
    if len(parents) > 0:
        for i, parent in enumerate(parents):
            print(f"      Parent {i+1}: ID={parent.id}, Code={parent.code}, Level={parent.level}")
    else:
        print(f"      (No parents - this is a top-level organization)")
        print(f"      ✓ This is OK - the code will use the organization's own code")
    
    return True


def check_function(func_id):
    """Check if function exists and has organization_id"""
    print(f"\n{'='*80}")
    print(f"CHECKING FUNCTION ID: {func_id}")
    print(f"{'='*80}")
    
    func = Function.query.filter_by(id=func_id).first()
    
    if not func:
        print(f"❌ Function {func_id} does NOT exist in database")
        return False
    
    print(f"✓ Function exists:")
    print(f"   ID: {func.id}")
    print(f"   Name: {func.name}")
    print(f"   Code: {func.code}")
    print(f"   Organization ID: {func.organization_id if hasattr(func, 'organization_id') and func.organization_id else '❌ MISSING'}")
    print(f"   Is Deleted: {func.is_deleted if hasattr(func, 'is_deleted') else 'N/A'}")
    
    if not hasattr(func, 'organization_id') or not func.organization_id:
        print(f"\n❌ PROBLEM: Function {func_id} has no organization_id!")
        print(f"   This will prevent deriving organization_id from function_id when creating projects.")
        return False
    
    return True


def check_program(prog_id):
    """Check if program exists"""
    print(f"\n{'='*80}")
    print(f"CHECKING PROGRAM ID: {prog_id}")
    print(f"{'='*80}")
    
    prog = Program.query.filter_by(id=prog_id).first()
    
    if not prog:
        print(f"❌ Program {prog_id} does NOT exist in database")
        return False
    
    print(f"✓ Program exists:")
    print(f"   ID: {prog.id}")
    print(f"   Name: {prog.name}")
    print(f"   Code: {prog.code}")
    print(f"   Organization IDs: {prog.organization_ids if hasattr(prog, 'organization_ids') else 'N/A'}")
    print(f"   Is Deleted: {prog.is_deleted if hasattr(prog, 'is_deleted') else 'N/A'}")
    
    return True


def check_existing_projects():
    """Check existing projects in the database"""
    print(f"\n{'='*80}")
    print(f"EXISTING PROJECTS IN DATABASE")
    print(f"{'='*80}")
    
    projects = Project.query.filter_by(is_deleted=False).limit(10).all()
    
    if not projects:
        print("No projects found in database")
        return
    
    print(f"\nFound {len(projects)} project(s) (showing first 10):\n")
    for proj in projects:
        print(f"   ID: {proj.id}, Code: {proj.code}, Name: {proj.name}")
        print(f"      Organization ID: {proj.organization_id}, Function ID: {proj.function_id}, Program ID: {proj.program_id}")


def main():
    print("\n" + "=" * 80)
    print("PROJECT DATA CHECKER")
    print("=" * 80)
    print("\nThis script checks:")
    print("1. If organizations exist and have required data (code field)")
    print("2. If functions exist and have organization_id")
    print("3. If programs exist")
    print("4. Existing projects in the database")
    print("\n" + "=" * 80)
    
    app = create_app()
    
    with app.app_context():
        # Check specific organization IDs from the error
        print("\n" + "=" * 80)
        print("CHECKING ORGANIZATIONS FROM ERROR LOGS")
        print("=" * 80)
        
        org_ids_to_check = [2975, 2976]
        for org_id in org_ids_to_check:
            check_organization(org_id)
        
        # Check functions
        print("\n" + "=" * 80)
        print("CHECKING FUNCTIONS FROM ERROR LOGS")
        print("=" * 80)
        
        func_ids_to_check = [5, 7]
        for func_id in func_ids_to_check:
            check_function(func_id)
        
        # Check programs
        print("\n" + "=" * 80)
        print("CHECKING PROGRAMS FROM ERROR LOGS")
        print("=" * 80)
        
        prog_ids_to_check = [28, 32]
        for prog_id in prog_ids_to_check:
            check_program(prog_id)
        
        # Check existing projects
        check_existing_projects()
        
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print("\nProjects are stored in the 'project' table.")
        print("When creating a project, the data goes through:")
        print("1. ProjectService.create() - validates and prepares data")
        print("2. Project model validation")
        print("3. before_insert event - generates project code (this is where the error occurs)")
        print("4. Database insert into 'project' table")
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

