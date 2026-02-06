"""
Script to insert the 18 strategic programs into the program table.
These are top-level programs (parent_id = None, level = 1).
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
from app.rest.v1.program.model import Program


def create_or_update_program(app, name, code, user_id=1):
    """
    Create a new program or update existing one.
    Returns the program instance.
    """
    with app.app_context():
        # Check if program already exists by code or name
        existing = Program.query.filter_by(code=code, is_deleted=False).first()
        
        if not existing:
            # Also check by name in case code is different
            existing = Program.query.filter_by(name=name, is_deleted=False).first()
        
        if existing:
            print(f"⚠ Program '{name}' (code: {code}) already exists (ID: {existing.id})")
            # Update the name if code matches but name is different
            if existing.name != name:
                existing.name = name
                existing.modified_by = user_id
                existing.save()
                print(f"  ✓ Updated name to '{name}'")
            return existing
        
        # Create new program
        program = Program(
            name=name,
            code=code,
            parent_id=None,  # Top-level program
            organization_ids=None  # Can be set later as needed
        )
        program.created_by = user_id
        program.modified_by = user_id
        
        db.session.add(program)
        db.session.commit()
        db.session.refresh(program)
        print(f"✓ Created program: {name} (ID: {program.id}, Code: {code}, Level: {program.level})")
        return program


def main():
    print("\n" + "=" * 80)
    print("STRATEGIC PROGRAMS INSERTION SCRIPT")
    print("=" * 80)
    print("\nThis script will insert 18 strategic programs into the program table.")
    print("\n" + "=" * 80)
    
    app = create_app()
    
    # Define the 18 programs with their codes and names
    programs = [
        {"code": "PROG-AOJ", "name": "Administration of Justice"},
        {"code": "PROG-AGR", "name": "Agro-Industrialisation"},
        {"code": "PROG-DPI", "name": "Development Plan Implementation"},
        {"code": "PROG-DIG", "name": "Digital Transformation"},
        {"code": "PROG-GOV", "name": "Governance and Security"},
        {"code": "PROG-HCD", "name": "Human Capital Development"},
        {"code": "PROG-INN", "name": "Innovation, Technology Development and Transfer"},
        {"code": "PROG-TRN", "name": "Integrated Transport Infrastructure and Services"},
        {"code": "PROG-LEG", "name": "Legislation, Oversight and Representation"},
        {"code": "PROG-MFG", "name": "Manufacturing"},
        {"code": "PROG-NRM", "name": "Natural Resources, Environment, Climate Change, Land and Water Management"},
        {"code": "PROG-PSD", "name": "Private Sector Development"},
        {"code": "PROG-PST", "name": "Public Sector Transformation"},
        {"code": "PROG-RGD", "name": "Regional Development"},
        {"code": "PROG-ENG", "name": "Sustainable Energy Development"},
        {"code": "PROG-EXT", "name": "Sustainable Extractives Industry Development"},
        {"code": "PROG-URB", "name": "Sustainable Urbanization and Housing"},
        {"code": "PROG-TRS", "name": "Tourism Development"},
    ]
    
    with app.app_context():
        print("\nInserting programs...")
        print("=" * 80)
        
        created_count = 0
        updated_count = 0
        
        for prog_data in programs:
            result = create_or_update_program(app, prog_data["name"], prog_data["code"])
            if result:
                if "already exists" in str(result):
                    updated_count += 1
                else:
                    created_count += 1
        
        # Get final count
        total_programs = Program.query.filter_by(is_deleted=False, parent_id=None).count()
        
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"\n✓ Programs processed: {len(programs)}")
        print(f"✓ Total top-level programs in database: {total_programs}")
        print("\n" + "=" * 80)
        print("VERIFICATION")
        print("=" * 80)
        print("\nTo verify the programs were inserted, you can:")
        print("1. Check the database:")
        print("   SELECT id, code, name, level FROM program WHERE parent_id IS NULL AND is_deleted = 0;")
        print("\n2. Or run this Python code:")
        print("   from app.rest.v1.program.model import Program")
        print("   programs = Program.query.filter_by(is_deleted=False, parent_id=None).all()")
        print("   for p in programs: print(f'{p.code}: {p.name}')")
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
