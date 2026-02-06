"""
Script to verify and fix workflow steps 1-10 to ensure correct flow:
1. Standard User (step 1) -> submits -> Department Head (step 2)
2. Department Head (step 2) -> approves -> Planning Head (step 3)
3. Planning Head (step 3) -> approves -> Accounting Officer (step 4)
4. Accounting Officer (step 4) -> approves -> Programme Head (step 5)
5. Programme Head (step 5) -> approves -> Commissioner PAP (step 6)
6. Commissioner PAP (step 6) -> approves -> Assistant Commissioner PAP (step 7)
7. Assistant Commissioner PAP (step 7) -> approves -> PAP Principal (step 8)
8. PAP Principal (step 8) -> approves -> PAP Senior Economist (step 9)
9. PAP Senior Economist (step 9) -> approves -> PAP Economist (step 10)

This script ensures:
- All steps 1-10 exist
- Each step has the correct role_id
- Each step has all phases (1, 2, 3, 4, 5) in its phases array
- Steps 2-10 have project_status = SUBMITTED (so they appear in "Incoming")
- No steps are hidden
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
from app.rest.v1.workflow_instance.model import WorkflowInstance
from app.rest.v1.user.model import User
from app.constants import ProjectStatus

# Expected configuration
EXPECTED_CONFIG = {
    1: {
        'role_id': 7,   # Standard User
        'status_msg': 'Project waiting for Standard User submission',
        'project_status': ProjectStatus.DRAFT,
        'actions': ['SUBMIT'],
        'phases': [1, 2, 3, 4, 5]
    },
    2: {
        'role_id': 21,  # Department Head
        'status_msg': 'Waiting for decision of Department Head',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    3: {
        'role_id': 12,  # Planning Head
        'status_msg': 'Waiting for decision of Planning Head',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    4: {
        'role_id': 22,  # Accounting Officer
        'status_msg': 'Waiting for decision of Accounting Officer',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    5: {
        'role_id': 8,   # Programme Head
        'status_msg': 'Waiting for decision of Programme Head',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    6: {
        'role_id': 19,  # Commissioner PAP
        'status_msg': 'Waiting for decision of PAP Commissioner',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    7: {
        'role_id': 23,  # Assistant Commissioner PAP
        'status_msg': 'Waiting for decision of PAP Assistant Commissioner',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    8: {
        'role_id': 24,  # PAP Principal
        'status_msg': 'Waiting for decision of PAP Principal',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    9: {
        'role_id': 25,  # PAP Senior Economist
        'status_msg': 'Waiting for decision of PAP Senior Economist',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['APPROVE', 'REVISE', 'REJECT'],
        'phases': [1, 2, 3, 4, 5]
    },
    10: {
        'role_id': 26,  # PAP Economist
        'status_msg': 'Waiting for project analysis by PAP Economist',
        'project_status': ProjectStatus.SUBMITTED,
        'actions': ['SUBMIT'],
        'phases': [1, 2, 3, 4, 5],
        'additional_data': {'submit_project_analysis': True}
    }
}

WORKFLOW_INSTANCE_ID = 1  # Main workflow instance

def verify_and_fix_workflow_steps():
    """Verify and fix workflow steps 1-5."""
    
    print("Verifying and Fixing Workflow Steps 1-10")
    print("=" * 70)
    print("\nExpected Configuration:")
    for step, config in EXPECTED_CONFIG.items():
        print(f"  Step {step}: Role ID {config['role_id']} - {config['status_msg']}")
    print("=" * 70)
    
    try:
        # Get workflow instance
        workflow_instance = WorkflowInstance.query.get(WORKFLOW_INSTANCE_ID)
        if not workflow_instance:
            print(f"\n[ERROR] Workflow instance {WORKFLOW_INSTANCE_ID} not found!")
            return
        
        # Get a user ID for created_by/modified_by (use first user or default to 1)
        first_user = User.query.first()
        user_id = first_user.id if first_user else 1
        
        # Get all workflows
        all_workflows = Workflow.query.filter(
            Workflow.is_hidden == False
        ).all()
        
        workflows_by_step = {wf.step: wf for wf in all_workflows}
        # Note: workflows_by_role might have duplicates if same role appears at multiple steps
        # We'll handle this by checking step numbers
        workflows_by_role = {}
        for wf in all_workflows:
            if wf.role_id not in workflows_by_role:
                workflows_by_role[wf.role_id] = []
            workflows_by_role[wf.role_id].append(wf)
        
        fixed_count = 0
        created_count = 0
        
        # Process each expected step
        for step, expected_config in EXPECTED_CONFIG.items():
            print(f"\n[PROCESSING] Step {step}")
            expected_role_id = expected_config['role_id']
            
            # Check if step exists
            workflow_at_step = workflows_by_step.get(step)
            # Get workflows with this role_id (might be multiple if role appears at different steps)
            workflows_with_role_list = workflows_by_role.get(expected_role_id, [])
            # Find the one that should be at this step (or any if none match)
            workflow_with_role = None
            for wf in workflows_with_role_list:
                if wf.step == step:
                    workflow_with_role = wf
                    break
            if not workflow_with_role and workflows_with_role_list:
                workflow_with_role = workflows_with_role_list[0]  # Use first one found
            
            needs_fix = False
            needs_create = False
            
            if workflow_at_step:
                # Step exists - check if it's correct
                if workflow_at_step.role_id != expected_role_id:
                    print(f"  [FIX NEEDED] Step {step} has wrong role_id: {workflow_at_step.role_id} (expected: {expected_role_id})")
                    
                    # Need to swap workflows - find the correct workflow
                    if workflow_with_role:
                        print(f"  [SWAP] Found correct workflow at step {workflow_with_role.step}, will swap with workflow at step {step}")
                        
                        # Find available temp step
                        temp_steps_used = [w.step for w in all_workflows if w.step >= 9000]
                        temp_step = 9000
                        while temp_step in temp_steps_used:
                            temp_step += 1
                        
                        # Move wrong workflow to temp step
                        wrong_wf_old_step = workflow_at_step.step
                        workflow_at_step.step = temp_step
                        workflow_at_step.modified_by = user_id
                        workflow_at_step.modified_on = datetime.now()
                        db.session.flush()
                        print(f"  [TEMP] Moved wrong workflow (role_id {workflow_at_step.role_id}) from step {wrong_wf_old_step} to temp step {temp_step}")
                        
                        # Move correct workflow to target step
                        correct_wf_old_step = workflow_with_role.step
                        workflow_with_role.step = step
                        workflow_with_role.status_msg = expected_config['status_msg']
                        workflow_with_role.project_status = expected_config['project_status']
                        workflow_with_role.phases = expected_config['phases']
                        workflow_with_role.actions = expected_config['actions']
                        workflow_with_role.is_hidden = False
                        if 'additional_data' in expected_config:
                            workflow_with_role.additional_data = expected_config['additional_data']
                        workflow_with_role.modified_by = user_id
                        workflow_with_role.modified_on = datetime.now()
                        db.session.flush()
                        print(f"  [MOVE] Moved correct workflow (role_id {expected_role_id}) from step {correct_wf_old_step} to step {step}")
                        
                        # Commit and refresh mappings
                        db.session.commit()
                        all_workflows = Workflow.query.filter(
                            Workflow.is_hidden == False
                        ).all()
                        workflows_by_step = {wf.step: wf for wf in all_workflows}
                        workflows_by_role = {}
                        for wf in all_workflows:
                            if wf.role_id not in workflows_by_role:
                                workflows_by_role[wf.role_id] = []
                            workflows_by_role[wf.role_id].append(wf)
                        
                        fixed_count += 1
                    else:
                        print(f"  [ERROR] Cannot find workflow with role_id {expected_role_id} to move to step {step}")
                else:
                    print(f"  [OK] Step {step} has correct role_id: {expected_role_id}")
                    # Check other properties
                    if workflow_at_step.status_msg != expected_config['status_msg']:
                        print(f"  [FIX NEEDED] Status message mismatch")
                        needs_fix = True
                    if workflow_at_step.project_status != expected_config['project_status']:
                        print(f"  [FIX NEEDED] Project status mismatch")
                        needs_fix = True
                    if set(workflow_at_step.phases) != set(expected_config['phases']):
                        print(f"  [FIX NEEDED] Phases mismatch: {workflow_at_step.phases} vs {expected_config['phases']}")
                        needs_fix = True
                    if workflow_at_step.is_hidden:
                        print(f"  [FIX NEEDED] Workflow is hidden")
                        needs_fix = True
                    
                    if needs_fix:
                        # Update existing workflow
                        workflow_at_step.status_msg = expected_config['status_msg']
                        workflow_at_step.project_status = expected_config['project_status']
                        workflow_at_step.phases = expected_config['phases']
                        workflow_at_step.actions = expected_config['actions']
                        workflow_at_step.is_hidden = False
                        if 'additional_data' in expected_config:
                            workflow_at_step.additional_data = expected_config['additional_data']
                        workflow_at_step.modified_by = user_id
                        workflow_at_step.modified_on = datetime.now()
                        db.session.flush()
                        print(f"  [FIXED] Updated workflow at step {step}")
                        fixed_count += 1
            else:
                # Step doesn't exist - check if workflow with role exists elsewhere
                if workflow_with_role:
                    print(f"  [FIX NEEDED] Workflow with role_id {expected_role_id} exists at step {workflow_with_role.step}, needs to move to step {step}")
                    # Move it to correct step
                    # First, clear target step if occupied
                    if step in workflows_by_step:
                        occupying_wf = workflows_by_step[step]
                        # Move occupying workflow to temp step
                        temp_steps_used = [w.step for w in all_workflows if w.step >= 9000]
                        temp_step = 9000
                        while temp_step in temp_steps_used:
                            temp_step += 1
                        occupying_wf.step = temp_step
                        occupying_wf.modified_on = datetime.now()
                        db.session.flush()
                        print(f"  [TEMP] Moved occupying workflow to step {temp_step}")
                    
                    # Move workflow to correct step
                    old_step = workflow_with_role.step
                    workflow_with_role.step = step
                    workflow_with_role.status_msg = expected_config['status_msg']
                    workflow_with_role.project_status = expected_config['project_status']
                    workflow_with_role.phases = expected_config['phases']
                    workflow_with_role.actions = expected_config['actions']
                    workflow_with_role.is_hidden = False
                    if 'additional_data' in expected_config:
                        workflow_with_role.additional_data = expected_config['additional_data']
                    workflow_with_role.modified_by = user_id
                    workflow_with_role.modified_on = datetime.now()
                    db.session.flush()
                    print(f"  [MOVED] Moved workflow from step {old_step} to step {step}")
                    fixed_count += 1
                    # Refresh mappings
                    db.session.commit()
                    all_workflows = Workflow.query.filter(
                        Workflow.is_hidden == False
                    ).all()
                    workflows_by_step = {wf.step: wf for wf in all_workflows}
                    workflows_by_role = {wf.role_id: wf for wf in all_workflows}
                else:
                    # Create new workflow
                    print(f"  [CREATE] Creating new workflow for step {step}")
                    needs_create = True
                    new_workflow = Workflow(
                        role_id=expected_role_id,
                        step=step,
                        status_msg=expected_config['status_msg'],
                        project_status=expected_config['project_status'],
                        actions=expected_config['actions'],
                        phases=expected_config['phases'],
                        is_hidden=False,
                        workflow_instance_id=WORKFLOW_INSTANCE_ID,
                        created_by=user_id,
                        created_on=datetime.now(),
                        modified_by=user_id,
                        modified_on=datetime.now()
                    )
                    # Add additional_data if specified
                    if 'additional_data' in expected_config:
                        new_workflow.additional_data = expected_config['additional_data']
                    db.session.add(new_workflow)
                    db.session.flush()
                    print(f"  [CREATED] Created workflow for step {step} (ID: {new_workflow.id})")
                    created_count += 1
                    # Refresh mappings
                    all_workflows = Workflow.query.filter(
                        Workflow.is_hidden == False
                    ).all()
                    workflows_by_step = {wf.step: wf for wf in all_workflows}
                    workflows_by_role = {wf.role_id: wf for wf in all_workflows}
        
        if fixed_count > 0 or created_count > 0:
            db.session.commit()
            print(f"\n[SUCCESS] Fixed {fixed_count} workflow(s), created {created_count} workflow(s)")
        else:
            print("\n[INFO] All workflows are correct - no fixes needed")
        
        # Final verification
        print("\n" + "=" * 70)
        print("Final Verification (Steps 1-10):")
        print("=" * 70)
        
        workflows = Workflow.query.filter(
            Workflow.step.in_([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
            Workflow.is_hidden == False
        ).order_by(Workflow.step).all()
        
        all_correct = True
        for wf in workflows:
            expected = EXPECTED_CONFIG.get(wf.step)
            if expected:
                status = "✓" if (wf.role_id == expected['role_id'] and 
                                set(wf.phases) == set(expected['phases']) and
                                wf.project_status == expected['project_status']) else "✗"
                print(f"{status} Step {wf.step}: Role ID {wf.role_id} - {wf.status_msg}")
                print(f"    Phases: {wf.phases}, Status: {wf.project_status.value if wf.project_status else 'None'}")
                if wf.role_id != expected['role_id']:
                    all_correct = False
                    print(f"    [ERROR] Wrong role_id! Expected {expected['role_id']}")
                if set(wf.phases) != set(expected['phases']):
                    all_correct = False
                    print(f"    [ERROR] Wrong phases! Expected {expected['phases']}")
            else:
                print(f"✗ Step {wf.step}: Unexpected workflow - {wf.status_msg}")
                all_correct = False
        
        if all_correct:
            print("\n[SUCCESS] All workflow steps are correctly configured!")
        else:
            print("\n[WARNING] Some workflow steps may need manual adjustment")
        
    except Exception as e:
        db.session.rollback()
        print(f"\n[ERROR] Failed to verify/fix workflows: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        verify_and_fix_workflow_steps()

