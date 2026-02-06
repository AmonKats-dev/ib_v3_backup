"""
Script to fix existing projects that are using incorrect workflow_id assignments.
After running update_workflow_status_for_incoming.py, some projects may still be
pointing to old workflow_ids that have been moved to different steps.

This script updates projects to use the correct workflow_id based on their current_step.
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
from app.rest.v1.workflow.model import Workflow
from app.rest.v1.project.model import Project

def fix_projects_workflow_assignment():
    """Fix projects that are using incorrect workflow_id based on their current_step."""
    
    print("Fixing Projects Workflow Assignment")
    print("=" * 70)
    print("\nThis script updates projects to use the correct workflow_id")
    print("based on their current_step and phase_id.")
    print("=" * 70)
    
    try:
        # Expected workflow step to role_id mapping
        expected_mapping = {
            1: 7,   # Standard User
            2: 21,  # Department Head
            3: 12,  # Planning Head
            4: 22,  # Accounting Officer
            5: 8,   # Programme Head
        }
        
        # Get all workflows
        all_workflows = Workflow.query.filter(
            Workflow.is_hidden == False
        ).all()
        
        # Create a mapping of (step, role_id) -> workflow_id
        workflow_map = {}
        for wf in all_workflows:
            key = (wf.step, wf.role_id)
            if key not in workflow_map:
                workflow_map[key] = wf.id
            else:
                # If there are duplicates, prefer the one that matches expected mapping
                if wf.step in expected_mapping and wf.role_id == expected_mapping[wf.step]:
                    workflow_map[key] = wf.id
        
        # Get all projects that are not deleted
        projects = Project.query.filter(
            Project.is_deleted == False
        ).all()
        
        print(f"\n[INFO] Found {len(projects)} project(s) to check")
        
        fixed_count = 0
        checked_count = 0
        
        for project in projects:
            checked_count += 1
            current_step = project.current_step
            current_workflow_id = project.workflow_id
            phase_id = project.phase_id
            
            # Check if this project needs fixing
            if current_step in expected_mapping:
                expected_role_id = expected_mapping[current_step]
                key = (current_step, expected_role_id)
                
                if key in workflow_map:
                    expected_workflow_id = workflow_map[key]
                    
                    # Get the current workflow to check its role_id
                    current_workflow = Workflow.query.get(current_workflow_id)
                    
                    if current_workflow:
                        current_role_id = current_workflow.role_id
                        
                        # If the workflow's role_id doesn't match expected, fix it
                        if current_role_id != expected_role_id:
                            print(f"\n[FIX] Project ID {project.id} (Code: {project.code})")
                            print(f"  - Current step: {current_step}")
                            print(f"  - Current workflow_id: {current_workflow_id} (role_id: {current_role_id})")
                            print(f"  - Expected workflow_id: {expected_workflow_id} (role_id: {expected_role_id})")
                            
                            # Verify the expected workflow exists and is correct
                            expected_workflow = Workflow.query.get(expected_workflow_id)
                            if expected_workflow:
                                if expected_workflow.step == current_step and expected_workflow.role_id == expected_role_id:
                                    project.workflow_id = expected_workflow_id
                                    project.modified_on = datetime.now()
                                    fixed_count += 1
                                    print(f"  [UPDATED] Project workflow_id changed to {expected_workflow_id}")
                                else:
                                    print(f"  [ERROR] Expected workflow {expected_workflow_id} has wrong step/role")
                            else:
                                print(f"  [ERROR] Expected workflow {expected_workflow_id} not found")
                    else:
                        print(f"\n[WARNING] Project ID {project.id} has invalid workflow_id {current_workflow_id}")
            
            # Progress indicator
            if checked_count % 100 == 0:
                print(f"[PROGRESS] Checked {checked_count} projects...")
        
        if fixed_count > 0:
            db.session.commit()
            print(f"\n[SUCCESS] Fixed {fixed_count} project(s)")
        else:
            print("\n[INFO] No projects needed fixing - all are using correct workflow_ids")
        
        # Summary
        print("\n" + "=" * 70)
        print("Summary:")
        print("=" * 70)
        print(f"✓ Checked {checked_count} project(s)")
        print(f"✓ Fixed {fixed_count} project(s)")
        print("\nProjects should now be using the correct workflow_id for their current_step")
        
    except Exception as e:
        db.session.rollback()
        print(f"\n[ERROR] Failed to fix projects: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        fix_projects_workflow_assignment()

