"""
Script to update workflow status messages and step order to reflect the correct workflow:
1. Standard User -> Department Head
2. Department Head -> Planning Head  
3. Planning Head -> Accounting Officer
4. Accounting Officer -> Program Head
5. Program Head -> Commissioner PAP
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

def update_workflow_status_messages():
    """Update workflow status messages and step order to reflect correct order."""
    
    print("Updating Workflow Status Messages and Step Order")
    print("=" * 60)
    
    try:
        # Define the correct workflow order:
        # Step 1: Standard User (role_id: 7)
        # Step 2: Department Head (role_id: 21)
        # Step 3: Planning Head (role_id: 12)  
        # Step 4: Accounting Officer (role_id: 22)
        # Step 5: Programme Head (role_id: 8)
        
        target_config = {
            2: {'role_id': 21, 'status_msg': 'Waiting for decision of Department Head'},
            3: {'role_id': 12, 'status_msg': 'Waiting for decision of Planning Head'},
            4: {'role_id': 22, 'status_msg': 'Waiting for decision of Accounting Officer'},
            5: {'role_id': 8, 'status_msg': 'Waiting for decision of Programme Head'}
        }
        
        # Get all workflows for steps 2-5
        all_workflows = Workflow.query.filter(
            Workflow.step.in_([2, 3, 4, 5]),
            Workflow.is_hidden == False
        ).all()
        
        # Create mappings
        workflows_by_step = {wf.step: wf for wf in all_workflows}
        workflows_by_role = {wf.role_id: wf for wf in all_workflows}
        
        updated_count = 0
        
        # Process each target step
        for target_step, target_data in target_config.items():
            target_role_id = target_data['role_id']
            target_msg = target_data['status_msg']
            
            # Find the workflow that should be at this step
            target_workflow = workflows_by_role.get(target_role_id)
            current_workflow = workflows_by_step.get(target_step)
            
            if target_workflow:
                # Check if it's already at the correct step
                if target_workflow.step == target_step:
                    # Just update the message if needed
                    if target_workflow.status_msg != target_msg:
                        print(f"\n[UPDATING MESSAGE] Step {target_step} (Role ID: {target_role_id})")
                        print(f"  Old: {target_workflow.status_msg}")
                        print(f"  New: {target_msg}")
                        target_workflow.status_msg = target_msg
                        target_workflow.modified_on = datetime.now()
                        updated_count += 1
                    else:
                        print(f"\n[OK] Step {target_step} already correct: {target_msg} (Role ID: {target_role_id})")
                else:
                    # Need to move workflows
                    print(f"\n[MOVING WORKFLOW] Step {target_step} needs Role ID {target_role_id}")
                    print(f"  Current step {target_step} has: Role ID {current_workflow.role_id if current_workflow else 'None'}")
                    print(f"  Role ID {target_role_id} is currently at step {target_workflow.step}")
                    
                    # Use a temporary high step number to avoid conflicts
                    temp_step = 9999
                    
                    # If there's a workflow at the target step that needs to move
                    if current_workflow and current_workflow.role_id != target_role_id:
                        # Move current workflow to temp step
                        old_current_step = current_workflow.step
                        current_workflow.step = temp_step
                        db.session.flush()
                        print(f"  Moved workflow from step {old_current_step} to temp step {temp_step}")
                    
                    # Move target workflow to target step
                    old_target_step = target_workflow.step
                    target_workflow.step = target_step
                    target_workflow.status_msg = target_msg
                    target_workflow.modified_on = datetime.now()
                    db.session.flush()
                    print(f"  Moved workflow from step {old_target_step} to step {target_step}")
                    
                    # If we moved a workflow to temp, find where it should go
                    if current_workflow and current_workflow.step == temp_step:
                        # Find if this role should be at another step
                        for other_step, other_data in target_config.items():
                            if other_data['role_id'] == current_workflow.role_id and other_step != target_step:
                                current_workflow.step = other_step
                                current_workflow.status_msg = other_data['status_msg']
                                current_workflow.modified_on = datetime.now()
                                print(f"  Moved workflow to step {other_step}")
                                break
                        else:
                            # No target step found, move to old target step
                            current_workflow.step = old_target_step
                            print(f"  Moved workflow back to step {old_target_step}")
                    
                    updated_count += 1
            else:
                print(f"\n[WARNING] Workflow with role_id {target_role_id} not found for step {target_step}")
        
        if updated_count > 0:
            db.session.commit()
            print(f"\n[SUCCESS] Updated {updated_count} workflow(s)")
        else:
            print("\n[INFO] No updates needed - all workflows are already correct")
        
        # Verify the workflow order
        print("\n" + "=" * 60)
        print("Current Workflow Order (Steps 1-5):")
        print("=" * 60)
        
        workflows = Workflow.query.filter(
            Workflow.step.in_([1, 2, 3, 4, 5]),
            Workflow.is_hidden == False
        ).order_by(Workflow.step).all()
        
        for wf in workflows:
            print(f"Step {wf.step}: {wf.status_msg} (Role ID: {wf.role_id})")
        
    except Exception as e:
        db.session.rollback()
        print(f"\n[ERROR] Failed to update workflow: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        update_workflow_status_messages()
