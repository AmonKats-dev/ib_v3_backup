"""
Script to set up the Normal Workflow for project approval.

Workflow Flow:
Forward: Standard User -> Programme Head -> Accounting Officer -> PAP Commissioner -> 
         PAP Assistant Commissioner -> PAP Principal -> PAP Senior Economist -> PAP Economist -> DC Decision
         
Reverse (after DC): PAP Economist -> PAP Senior Economist -> PAP Principal -> 
                    PAP Assistant Commissioner -> PAP Commissioner -> Accounting Officer -> 
                    Programme Head -> Standard User

This script creates all workflow steps with proper sequencing.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.shared import db
from app.rest.v1.workflow.model import Workflow
from app.rest.v1.workflow_instance.model import WorkflowInstance
from app.constants import ProjectStatus
from datetime import datetime

# Role IDs (from dump.sql)
ROLES = {
    'standard_user': 7,
    'programme_head': 8,
    'accounting_officer': 22,
    'pap_commissioner': 19,
    'pap_assistant_commissioner': 23,
    'pap_principal': 24,
    'pap_senior_economist': 25,
    'pap_economist': 26,
    'dc_member': 32
}

# Workflow Instance ID (Main Workflow = 1)
WORKFLOW_INSTANCE_ID = 1

# Phases (all phases: 1-5)
ALL_PHASES = [1, 2, 3, 4, 5]

def create_workflow(step, role_id, status_msg, actions, project_status, phases, 
                   revise_to_workflow_id=None, is_hidden=False, additional_data=None):
    """Create a workflow step."""
    workflow = Workflow(
        step=step,
        role_id=role_id,
        status_msg=status_msg,
        actions=actions,
        project_status=project_status,
        phases=phases,
        revise_to_workflow_id=revise_to_workflow_id,
        is_hidden=is_hidden,
        workflow_instance_id=WORKFLOW_INSTANCE_ID,
        created_by=1,
        created_on=datetime.now(),
        modified_by=1,
        modified_on=datetime.now()
    )
    
    if additional_data:
        workflow.additional_data = additional_data
    
    return workflow


def setup_normal_workflow():
    """Set up the complete normal workflow."""
    
    workflows = []
    
    # Forward Flow Steps
    # Step 1: Standard User - Initial submission
    workflows.append(create_workflow(
        step=1,
        role_id=ROLES['standard_user'],
        status_msg='Project waiting for Standard User submission',
        actions=['SUBMIT'],
        project_status=ProjectStatus.DRAFT,
        phases=ALL_PHASES
    ))
    
    # Step 2: Programme Head
    workflows.append(create_workflow(
        step=2,
        role_id=ROLES['programme_head'],
        status_msg='Waiting for decision of Programme Head',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.SUBMITTED,
        phases=ALL_PHASES,
        revise_to_workflow_id=None  # Will be set after creation
    ))
    
    # Step 3: Accounting Officer
    workflows.append(create_workflow(
        step=3,
        role_id=ROLES['accounting_officer'],
        status_msg='Waiting for decision of Accounting Officer',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 4: PAP Commissioner
    workflows.append(create_workflow(
        step=4,
        role_id=ROLES['pap_commissioner'],
        status_msg='Waiting for decision of PAP Commissioner',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 5: PAP Assistant Commissioner
    workflows.append(create_workflow(
        step=5,
        role_id=ROLES['pap_assistant_commissioner'],
        status_msg='Waiting for decision of PAP Assistant Commissioner',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 6: PAP Principal
    workflows.append(create_workflow(
        step=6,
        role_id=ROLES['pap_principal'],
        status_msg='Waiting for decision of PAP Principal',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 7: PAP Senior Economist
    workflows.append(create_workflow(
        step=7,
        role_id=ROLES['pap_senior_economist'],
        status_msg='Waiting for decision of PAP Senior Economist',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 8: PAP Economist
    workflows.append(create_workflow(
        step=8,
        role_id=ROLES['pap_economist'],
        status_msg='Waiting for project analysis by PAP Economist',
        actions=['SUBMIT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES,
        additional_data={'submit_project_analysis': True}
    ))
    
    # Step 9: DC Member - Waiting for DC Decision
    workflows.append(create_workflow(
        step=9,
        role_id=ROLES['dc_member'],
        status_msg='Waiting for Development Committee (DC) decision',
        actions=['ASSIGN'],  # DC assigns back after decision
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES,
        is_hidden=False
    ))
    
    # Reverse Flow Steps (after DC decision)
    # Step 10: PAP Economist (reverse)
    workflows.append(create_workflow(
        step=10,
        role_id=ROLES['pap_economist'],
        status_msg='Waiting for submission by PAP Economist (after DC decision)',
        actions=['SUBMIT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 11: PAP Senior Economist (reverse)
    workflows.append(create_workflow(
        step=11,
        role_id=ROLES['pap_senior_economist'],
        status_msg='Waiting for decision of PAP Senior Economist (after DC decision)',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.SUBMITTED,
        phases=ALL_PHASES
    ))
    
    # Step 12: PAP Principal (reverse)
    workflows.append(create_workflow(
        step=12,
        role_id=ROLES['pap_principal'],
        status_msg='Waiting for decision of PAP Principal (after DC decision)',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 13: PAP Assistant Commissioner (reverse)
    workflows.append(create_workflow(
        step=13,
        role_id=ROLES['pap_assistant_commissioner'],
        status_msg='Waiting for decision of PAP Assistant Commissioner (after DC decision)',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 14: PAP Commissioner (reverse)
    workflows.append(create_workflow(
        step=14,
        role_id=ROLES['pap_commissioner'],
        status_msg='Waiting for decision of PAP Commissioner (after DC decision)',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 15: Accounting Officer (reverse)
    workflows.append(create_workflow(
        step=15,
        role_id=ROLES['accounting_officer'],
        status_msg='Waiting for decision of Accounting Officer (after DC decision)',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 16: Programme Head (reverse)
    workflows.append(create_workflow(
        step=16,
        role_id=ROLES['programme_head'],
        status_msg='Waiting for decision of Programme Head (after DC decision)',
        actions=['APPROVE', 'REVISE', 'REJECT'],
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Step 17: Standard User (final - back to creator)
    workflows.append(create_workflow(
        step=17,
        role_id=ROLES['standard_user'],
        status_msg='Project returned to Standard User (after DC decision)',
        actions=['SUBMIT'],  # Can resubmit if needed
        project_status=ProjectStatus.APPROVED,
        phases=ALL_PHASES
    ))
    
    # Set revise_to_workflow_id for step 2 (Programme Head can revise back to step 1)
    # We need to save workflows first to get IDs, then update
    try:
        # Delete existing workflows for this instance (optional - comment out if you want to keep existing)
        # Workflow.query.filter_by(workflow_instance_id=WORKFLOW_INSTANCE_ID).delete()
        
        # Save all workflows
        for workflow in workflows:
            db.session.add(workflow)
        
        db.session.commit()
        
        # Now update revise_to_workflow_id for workflows that need it
        # Get the workflow IDs
        workflow_1 = Workflow.query.filter_by(step=1, workflow_instance_id=WORKFLOW_INSTANCE_ID).first()
        workflow_2 = Workflow.query.filter_by(step=2, workflow_instance_id=WORKFLOW_INSTANCE_ID).first()
        
        if workflow_1 and workflow_2:
            workflow_2.revise_to_workflow_id = workflow_1.id
            db.session.commit()
        
        print("✓ Normal workflow setup completed successfully!")
        print(f"✓ Created {len(workflows)} workflow steps")
        print("\nWorkflow Steps:")
        for wf in workflows:
            print(f"  Step {wf.step}: {wf.status_msg} (Role ID: {wf.role_id})")
        
    except Exception as e:
        db.session.rollback()
        print(f"✗ Error setting up workflow: {str(e)}")
        raise


if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        setup_normal_workflow()

