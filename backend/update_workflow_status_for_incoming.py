"""
Script to update workflow steps to ensure proper status transitions:
1. Standard User (step 1) -> submits -> Department Head (step 2) with SUBMITTED status
2. Department Head (step 2) -> approves -> Planning Head (step 3) with SUBMITTED status
3. Planning Head (step 3) -> approves -> Accounting Officer (step 4) with SUBMITTED status
4. Accounting Officer (step 4) -> approves -> Programme Head (step 5) with SUBMITTED status

All steps 2-5 should have project_status = SUBMITTED so projects appear in "Incoming" nav link.
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
from app.constants import ProjectStatus

def update_workflow_status_for_incoming():
    """Update workflow steps 2-5 to have SUBMITTED status for proper Incoming visibility."""
    
    print("Updating Workflow Status for Incoming Visibility")
    print("=" * 70)
    print("\nExpected Workflow Flow:")
    print("1. Standard User (step 1) -> submits -> Department Head (step 2)")
    print("2. Department Head (step 2) -> approves -> Planning Head (step 3)")
    print("3. Planning Head (step 3) -> approves -> Accounting Officer (step 4)")
    print("4. Accounting Officer (step 4) -> approves -> Programme Head (step 5)")
    print("\nAll steps 2-5 should have project_status = SUBMITTED")
    print("=" * 70)
    
    try:
        # Define the correct workflow configuration:
        # Step 1: Standard User (role_id: 7) - DRAFT status
        # Step 2: Department Head (role_id: 21) - SUBMITTED status (appears in Incoming)
        # Step 3: Planning Head (role_id: 12) - SUBMITTED status (appears in Incoming)
        # Step 4: Accounting Officer (role_id: 22) - SUBMITTED status (appears in Incoming)
        # Step 5: Programme Head (role_id: 8) - SUBMITTED status (appears in Incoming)
        
        target_config = {
            2: {
                'role_id': 21, 
                'status_msg': 'Waiting for decision of Department Head',
                'project_status': ProjectStatus.SUBMITTED,
                'actions': ['APPROVE', 'REVISE', 'REJECT']
            },
            3: {
                'role_id': 12, 
                'status_msg': 'Waiting for decision of Planning Head',
                'project_status': ProjectStatus.SUBMITTED,
                'actions': ['APPROVE', 'REVISE', 'REJECT']
            },
            4: {
                'role_id': 22, 
                'status_msg': 'Waiting for decision of Accounting Officer',
                'project_status': ProjectStatus.SUBMITTED,
                'actions': ['APPROVE', 'REVISE', 'REJECT']
            },
            5: {
                'role_id': 8, 
                'status_msg': 'Waiting for decision of Programme Head',
                'project_status': ProjectStatus.SUBMITTED,
                'actions': ['APPROVE', 'REVISE', 'REJECT']
            }
        }
        
        # Get ALL non-hidden workflows to find workflows that might be at wrong steps
        all_workflows = Workflow.query.filter(
            Workflow.is_hidden == False
        ).all()
        
        # Create mappings - include all workflows, not just steps 1-5
        workflows_by_step = {wf.step: wf for wf in all_workflows}
        workflows_by_role = {wf.role_id: wf for wf in all_workflows}
        
        # Also get workflows for steps 1-5 specifically
        workflows_1_to_5 = [wf for wf in all_workflows if wf.step in [1, 2, 3, 4, 5]]
        
        updated_count = 0
        
        # First, identify workflows that are incorrectly at steps 1-5
        # These are workflows with roles that shouldn't be at these steps
        target_role_ids_set = set([21, 12, 22, 8])  # Department Head, Planning Head, Accounting Officer, Programme Head
        workflows_to_relocate = []
        
        print("\n[STEP 1] Identifying incorrectly placed workflows at steps 1-5...")
        for wf in workflows_1_to_5:
            if wf.step in [2, 3, 4, 5] and wf.role_id not in target_role_ids_set:
                workflows_to_relocate.append(wf)
                print(f"  [FOUND] Workflow at step {wf.step} with wrong role_id {wf.role_id} (Workflow ID: {wf.id})")
                print(f"    - Status message: {wf.status_msg}")
        
        # Move incorrectly placed workflows to high step numbers (9000+)
        if workflows_to_relocate:
            print(f"\n[STEP 2] Moving {len(workflows_to_relocate)} incorrectly placed workflow(s) to temporary steps...")
            temp_step_start = 9000
            for idx, wf in enumerate(workflows_to_relocate):
                old_step = wf.step
                wf.step = temp_step_start + idx
                wf.modified_on = datetime.now()
                db.session.flush()
                print(f"  [MOVE] Moved workflow ID {wf.id} (role_id {wf.role_id}) from step {old_step} to step {wf.step}")
                updated_count += 1
            # Refresh mappings after relocation
            all_workflows = Workflow.query.filter(
                Workflow.is_hidden == False
            ).all()
            workflows_by_step = {wf.step: wf for wf in all_workflows}
            workflows_by_role = {wf.role_id: wf for wf in all_workflows}
            workflows_1_to_5 = [wf for wf in all_workflows if wf.step in [1, 2, 3, 4, 5]]
        
        print(f"\n[STEP 3] Processing target workflow steps...")
        
        # Process each target step
        for target_step, target_data in target_config.items():
            target_role_id = target_data['role_id']
            target_msg = target_data['status_msg']
            target_status = target_data['project_status']
            target_actions = target_data['actions']
            
            print(f"\n[PROCESSING] Step {target_step}: Role ID {target_role_id}")
            
            # Find the workflow that should be at this step
            target_workflow = workflows_by_role.get(target_role_id)
            current_workflow = workflows_by_step.get(target_step)
            
            if target_workflow:
                needs_update = False
                updates = []
                
                # Check if it's already at the correct step
                # Refresh target_workflow from database to get latest state
                db.session.refresh(target_workflow)
                
                if target_workflow.step != target_step:
                    print(f"  [MOVE] Workflow needs to move from step {target_workflow.step} to step {target_step}")
                    needs_update = True
                    updates.append(f"step: {target_workflow.step} -> {target_step}")
                    
                    # First, check if target step is occupied and clear it if needed
                    # Query database directly to get current state (not from cache)
                    occupying_workflow = Workflow.query.filter(
                        Workflow.step == target_step,
                        Workflow.is_hidden == False,
                        Workflow.id != target_workflow.id  # Exclude the workflow we're moving
                    ).first()
                    
                    if occupying_workflow:
                        # Find an available temp step (check what's already used)
                        # Query all workflows to get current temp steps
                        all_temp_workflows = Workflow.query.filter(
                            Workflow.step >= 9000,
                            Workflow.is_hidden == False
                        ).all()
                        temp_steps_used = [wf.step for wf in all_temp_workflows]
                        temp_step = 9000
                        while temp_step in temp_steps_used:
                            temp_step += 1
                        
                        # Move occupying workflow to temp step
                        old_occupying_step = occupying_workflow.step
                        occupying_workflow.step = temp_step
                        occupying_workflow.modified_on = datetime.now()
                        db.session.flush()
                        print(f"  [TEMP] Moved occupying workflow ID {occupying_workflow.id} (role_id {occupying_workflow.role_id}) from step {old_occupying_step} to temp step {temp_step}")
                        # Commit the move of occupying workflow
                        db.session.commit()
                    
                    # Refresh target_workflow again after clearing occupying workflow
                    db.session.refresh(target_workflow)
                    
                    # Now move target workflow to target step
                    old_target_step = target_workflow.step
                    target_workflow.step = target_step
                    target_workflow.modified_on = datetime.now()
                    db.session.flush()
                    print(f"  [MOVE] Moved workflow ID {target_workflow.id} from step {old_target_step} to step {target_step}")
                    
                    # Commit after each move to avoid conflicts
                    db.session.commit()
                    
                    # Refresh mappings after moves to avoid stale data
                    all_workflows = Workflow.query.filter(
                        Workflow.is_hidden == False
                    ).all()
                    workflows_by_step = {wf.step: wf for wf in all_workflows}
                    workflows_by_role = {wf.role_id: wf for wf in all_workflows}
                    target_workflow = workflows_by_role.get(target_role_id)
                
                # Now update the workflow at the correct step
                if target_workflow.step == target_step:
                    # Check status message
                    if target_workflow.status_msg != target_msg:
                        print(f"  [UPDATE] Status message: '{target_workflow.status_msg}' -> '{target_msg}'")
                        target_workflow.status_msg = target_msg
                        needs_update = True
                        updates.append(f"status_msg updated")
                    
                    # Check project status
                    if target_workflow.project_status != target_status:
                        old_status = target_workflow.project_status.value if target_workflow.project_status else 'None'
                        new_status = target_status.value
                        print(f"  [UPDATE] Project status: '{old_status}' -> '{new_status}'")
                        target_workflow.project_status = target_status
                        needs_update = True
                        updates.append(f"project_status: {old_status} -> {new_status}")
                    
                    # Check actions (optional - just log if different)
                    if target_workflow.actions != target_actions:
                        print(f"  [INFO] Actions differ: {target_workflow.actions} vs {target_actions}")
                        print(f"  [INFO] Not updating actions automatically - verify manually if needed")
                    
                    if needs_update:
                        target_workflow.modified_on = datetime.now()
                        updated_count += 1
                        print(f"  [SUCCESS] Updated step {target_step}: {', '.join(updates)}")
                    else:
                        print(f"  [OK] Step {target_step} already correct")
                else:
                    print(f"  [WARNING] Workflow not at correct step after move attempt")
            else:
                print(f"  [ERROR] Workflow with role_id {target_role_id} not found for step {target_step}")
                # Try to find if there's a workflow with this role_id at a different step
                all_workflows_check = Workflow.query.filter(
                    Workflow.is_hidden == False
                ).all()
                for wf in all_workflows_check:
                    if wf.role_id == target_role_id:
                        print(f"  [FOUND] Workflow with role_id {target_role_id} exists at step {wf.step} (ID: {wf.id})")
                        print(f"  [INFO] This workflow needs to be moved to step {target_step}")
                        # Move it to the target step
                        if wf.step != target_step:
                            # Check if target step is occupied by querying database directly
                            occupying_wf = Workflow.query.filter(
                                Workflow.step == target_step,
                                Workflow.is_hidden == False
                            ).first()
                            
                            if occupying_wf and occupying_wf.id != wf.id:
                                # Find an available temp step
                                temp_steps_used = [w.step for w in all_workflows_check if w.step >= 9000]
                                temp_step = 9000
                                while temp_step in temp_steps_used:
                                    temp_step += 1
                                
                                # Move occupying workflow to temp step
                                old_occupying_step = occupying_wf.step
                                occupying_wf.step = temp_step
                                occupying_wf.modified_on = datetime.now()
                                db.session.flush()
                                print(f"  [TEMP] Moved occupying workflow ID {occupying_wf.id} from step {old_occupying_step} to temp step {temp_step}")
                            
                            old_step = wf.step
                            wf.step = target_step
                            wf.status_msg = target_msg
                            wf.project_status = target_status
                            wf.modified_on = datetime.now()
                            db.session.flush()
                            print(f"  [MOVE] Moved workflow ID {wf.id} from step {old_step} to step {target_step}")
                            
                            # Commit after move
                            db.session.commit()
                            updated_count += 1
                        break
        
        if updated_count > 0:
            db.session.commit()
            print(f"\n[SUCCESS] Updated {updated_count} workflow(s)")
        else:
            print("\n[INFO] No updates needed - all workflows are already correct")
        
        # Verify the workflow order and status
        print("\n" + "=" * 70)
        print("Current Workflow Configuration (Steps 1-5):")
        print("=" * 70)
        
        # Refresh workflows after all updates
        workflows = Workflow.query.filter(
            Workflow.step.in_([1, 2, 3, 4, 5]),
            Workflow.is_hidden == False
        ).order_by(Workflow.step).all()
        
        # Also show any workflows that might be incorrectly assigned
        print("\n[VERIFICATION] Checking for workflows at wrong steps...")
        all_workflows_final = Workflow.query.filter(
            Workflow.is_hidden == False
        ).all()
        
        # Check for workflows that should be in steps 1-5 but aren't
        target_role_ids = [21, 12, 22, 8]  # Department Head, Planning Head, Accounting Officer, Programme Head
        for wf in all_workflows_final:
            if wf.role_id in target_role_ids and wf.step not in [1, 2, 3, 4, 5]:
                print(f"  [WARNING] Workflow with role_id {wf.role_id} is at step {wf.step} (should be in steps 1-5)")
        
        # Check for wrong roles at steps 1-5
        wrong_roles = []
        for wf in workflows:
            if wf.step == 2 and wf.role_id != 21:
                wrong_roles.append(f"Step 2 has role_id {wf.role_id} (should be 21 - Department Head)")
            elif wf.step == 3 and wf.role_id != 12:
                wrong_roles.append(f"Step 3 has role_id {wf.role_id} (should be 12 - Planning Head)")
            elif wf.step == 4 and wf.role_id != 22:
                wrong_roles.append(f"Step 4 has role_id {wf.role_id} (should be 22 - Accounting Officer)")
            elif wf.step == 5 and wf.role_id != 8:
                wrong_roles.append(f"Step 5 has role_id {wf.role_id} (should be 8 - Programme Head)")
        
        if wrong_roles:
            print(f"\n  [ERROR] Found {len(wrong_roles)} workflow(s) with incorrect role assignments:")
            for error in wrong_roles:
                print(f"    - {error}")
        else:
            print("  [OK] All workflows at steps 1-5 have correct role assignments")
        
        for wf in workflows:
            status_value = wf.project_status.value if wf.project_status else 'None'
            print(f"Step {wf.step}: {wf.status_msg}")
            print(f"  - Role ID: {wf.role_id}")
            print(f"  - Project Status: {status_value}")
            print(f"  - Actions: {wf.actions}")
            print()
        
        # Summary
        print("=" * 70)
        print("Summary:")
        print("=" * 70)
        print("✓ Workflow steps 2-5 should now have project_status = SUBMITTED")
        print("✓ Projects will appear in 'Incoming' nav link for each role")
        print("✓ When a role approves, project moves to next step with SUBMITTED status")
        print("\nWorkflow Flow:")
        print("  Standard User submits → Department Head (Incoming)")
        print("  Department Head approves → Planning Head (Incoming)")
        print("  Planning Head approves → Accounting Officer (Incoming)")
        print("  Accounting Officer approves → Programme Head (Incoming)")
        
        # Final verification - check if any projects might be affected
        print("\n" + "=" * 70)
        print("IMPORTANT NOTES:")
        print("=" * 70)
        print("1. If any projects were using workflows that were moved,")
        print("   they may need to be manually updated to use the correct workflow_id")
        print("2. Projects at step 2 should now use the Department Head workflow")
        print("3. Projects at step 3 should now use the Planning Head workflow")
        print("4. Projects at step 4 should now use the Accounting Officer workflow")
        print("5. Projects at step 5 should now use the Programme Head workflow")
        print("\nTo fix existing projects, you may need to run:")
        print("  UPDATE project SET workflow_id = <correct_workflow_id> WHERE current_step = <step>")
        
    except Exception as e:
        db.session.rollback()
        print(f"\n[ERROR] Failed to update workflow: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        update_workflow_status_for_incoming()

