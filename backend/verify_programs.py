"""
Script to verify the programs were inserted correctly.
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
from app.rest.v1.program.model import Program


def main():
    print("\n" + "=" * 80)
    print("PROGRAM VERIFICATION")
    print("=" * 80)
    
    app = create_app()
    
    with app.app_context():
        # Query all top-level programs
        programs = Program.query.filter_by(
            is_deleted=False, 
            parent_id=None
        ).order_by(Program.name).all()
        
        print(f"\nTotal top-level programs found: {len(programs)}\n")
        print("-" * 80)
        print(f"{'ID':<5} | {'Code':<12} | {'Level':<6} | {'Name':<50}")
        print("-" * 80)
        
        for program in programs:
            print(f"{program.id:<5} | {program.code:<12} | {program.level:<6} | {program.name:<50}")
        
        print("-" * 80)
        print(f"\n✓ Verification complete! {len(programs)} programs are in the database.")
        print("=" * 80)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nExiting...")
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
