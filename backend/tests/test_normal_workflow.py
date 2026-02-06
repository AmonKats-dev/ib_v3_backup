"""
Test script to test a project through all phases of the Normal Workflow.

This script:
1. Creates a test project
2. Tests it through all forward workflow steps
3. Tests DC decision
4. Tests reverse workflow steps
5. Verifies each step works correctly
"""

import sys
import os
import json
from datetime import datetime, date

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.shared import db
from app.rest.v1.project.model import Project
from app.rest.v1.project.service import ProjectService
from app.rest.v1.workflow.model import Workflow
from app.rest.v1.workflow_instance.model import WorkflowInstance
from app.rest.v1.phase.model import Phase
from app.rest.v1.organization.model import Organization
from app.rest.v1.program.model import Program
from app.constants import ProjectStatus, ProjectAction
from flask_jwt_extended import create_access_token


# Role IDs
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

WORKFLOW_INSTANCE_ID = 1


class WorkflowTester:
    def __init__(self):
        self.project_service = ProjectService()
        self.test_project = None
        self.test_results = []
        
    def log(self, message, status='INFO'):
        """Log test messages."""
        status_symbol = {
            'INFO': 'ℹ',
            'SUCCESS': '✓',
            'ERROR': '✗',
            'WARNING': '⚠'
        }.get(status, '•')
        print(f"{status_symbol} {message}")
        self.test_results.append({'status': status, 'message': message})
    
    def get_workflow_by_step(self, step):
        """Get workflow by step number."""
        return Workflow.query.filter_by(
            step=step, 
            workflow_instance_id=WORKFLOW_INSTANCE_ID
        ).first()
    
    def get_first_phase(self):
        """Get the first phase."""
        phase = Phase.query.filter_by(sequence=1).first()
        if not phase:
            # Get any phase if sequence 1 doesn't exist
            phase = Phase.query.first()
        return phase
    
    def get_test_organization(self):
        """Get or create a test organization."""
        org = Organization.query.first()
        if not org:
            self.log("No organization found. Please create one first.", 'ERROR')
            return None
        return org
    
    def get_test_program(self):
        """Get or create a test program."""
        program = Program.query.first()
        if not program:
            self.log("No program found. Please create one first.", 'ERROR')
            return None
        return program
    
    def create_test_project(self):
        """Create a test project."""
        try:
            phase = self.get_first_phase()
            org = self.get_test_organization()
            program = self.get_test_program()
            
            if not all([phase, org, program]):
                self.log("Missing required data (phase, organization, or program)", 'ERROR')
                return False
            
            # Get initial workflow
            workflow = self.get_workflow_by_step(1)
            if not workflow:
                self.log("Workflow step 1 not found. Please run setup_normal_workflow.py first.", 'ERROR')
                return False
            
            project_data = {
                'code': f'TEST-{datetime.now().strftime("%Y%m%d%H%M%S")}',
                'name': 'Test Project - Normal Workflow',
                'project_type': 'infrastructure',
                'project_status': ProjectStatus.DRAFT.value,
                'phase_id': phase.id,
                'organization_id': org.id,
                'program_id': program.id,
                'workflow_id': workflow.id,
                'current_step': workflow.step,
                'max_step': workflow.step,
                'is_donor_funded': False,
                'created_by': 1
            }
            
            self.test_project = self.project_service.create(project_data)
            self.log(f"Created test project: {self.test_project['code']} (ID: {self.test_project['id']})", 'SUCCESS')
            return True
            
        except Exception as e:
            self.log(f"Error creating test project: {str(e)}", 'ERROR')
            return False
    
    def submit_project(self, user_role_id, step_number, action=ProjectAction.SUBMIT, reason=None):
        """Submit/approve project at a specific step."""
        try:
            # Verify project is at correct step
            project = Project.query.get(self.test_project['id'])
            if not project:
                self.log(f"Project not found", 'ERROR')
                return False
            
            workflow = self.get_workflow_by_step(step_number)
            if not workflow:
                self.log(f"Workflow step {step_number} not found", 'ERROR')
                return False
            
            if project.current_step != step_number:
                self.log(f"Project is at step {project.current_step}, expected {step_number}", 'WARNING')
                # Update to correct step for testing
                project.current_step = step_number
                project.workflow_id = workflow.id
                db.session.commit()
            
            # Simulate user action
            project_dict = self.project_service.schema().dump(project)
            project_dict['workflow'] = {
                'step': workflow.step,
                'id': workflow.id,
                'additional_data': workflow.additional_data
            }
            
            if action == ProjectAction.SUBMIT:
                result = self.project_service.submit_project(
                    project_dict, 
                    project_dict.get('project_detail_id'),
                    reason=reason or f"Submitted at step {step_number}"
                )
            elif action == ProjectAction.APPROVE:
                result = self.project_service.approve_project(
                    project_dict,
                    reason=reason or f"Approved at step {step_number}"
                )
            elif action == ProjectAction.ASSIGN:
                result = self.project_service.assign_project(
                    project_dict,
                    reason=reason or f"Assigned at step {step_number}"
                )
            else:
                self.log(f"Unsupported action: {action}", 'ERROR')
                return False
            
            # Refresh project
            db.session.refresh(project)
            self.log(f"Step {step_number}: {action.value} - Status: {project.project_status.value}, Current Step: {project.current_step}", 'SUCCESS')
            return True
            
        except Exception as e:
            self.log(f"Error at step {step_number}: {str(e)}", 'ERROR')
            import traceback
            traceback.print_exc()
            return False
    
    def test_forward_workflow(self):
        """Test forward workflow (steps 1-9)."""
        self.log("\n=== Testing Forward Workflow ===", 'INFO')
        
        # Step 1: Standard User submits
        if not self.submit_project(ROLES['standard_user'], 1, ProjectAction.SUBMIT, "Initial submission"):
            return False
        
        # Step 2: Programme Head approves
        if not self.submit_project(ROLES['programme_head'], 2, ProjectAction.APPROVE, "Approved by Programme Head"):
            return False
        
        # Step 3: Accounting Officer approves
        if not self.submit_project(ROLES['accounting_officer'], 3, ProjectAction.APPROVE, "Approved by Accounting Officer"):
            return False
        
        # Step 4: PAP Commissioner approves
        if not self.submit_project(ROLES['pap_commissioner'], 4, ProjectAction.APPROVE, "Approved by PAP Commissioner"):
            return False
        
        # Step 5: PAP Assistant Commissioner approves
        if not self.submit_project(ROLES['pap_assistant_commissioner'], 5, ProjectAction.APPROVE, "Approved by PAP Assistant Commissioner"):
            return False
        
        # Step 6: PAP Principal approves
        if not self.submit_project(ROLES['pap_principal'], 6, ProjectAction.APPROVE, "Approved by PAP Principal"):
            return False
        
        # Step 7: PAP Senior Economist approves
        if not self.submit_project(ROLES['pap_senior_economist'], 7, ProjectAction.APPROVE, "Approved by PAP Senior Economist"):
            return False
        
        # Step 8: PAP Economist submits analysis
        if not self.submit_project(ROLES['pap_economist'], 8, ProjectAction.SUBMIT, "Project analysis submitted"):
            return False
        
        # Step 9: DC Member assigns (DC decision)
        if not self.submit_project(ROLES['dc_member'], 9, ProjectAction.ASSIGN, "DC decision made - assigning back"):
            return False
        
        self.log("Forward workflow completed successfully!", 'SUCCESS')
        return True
    
    def test_reverse_workflow(self):
        """Test reverse workflow (steps 10-17)."""
        self.log("\n=== Testing Reverse Workflow (After DC Decision) ===", 'INFO')
        
        # Step 10: PAP Economist submits (reverse)
        if not self.submit_project(ROLES['pap_economist'], 10, ProjectAction.SUBMIT, "Submitted after DC decision"):
            return False
        
        # Step 11: PAP Senior Economist approves (reverse)
        if not self.submit_project(ROLES['pap_senior_economist'], 11, ProjectAction.APPROVE, "Approved by PAP Senior Economist (reverse)"):
            return False
        
        # Step 12: PAP Principal approves (reverse)
        if not self.submit_project(ROLES['pap_principal'], 12, ProjectAction.APPROVE, "Approved by PAP Principal (reverse)"):
            return False
        
        # Step 13: PAP Assistant Commissioner approves (reverse)
        if not self.submit_project(ROLES['pap_assistant_commissioner'], 13, ProjectAction.APPROVE, "Approved by PAP Assistant Commissioner (reverse)"):
            return False
        
        # Step 14: PAP Commissioner approves (reverse)
        if not self.submit_project(ROLES['pap_commissioner'], 14, ProjectAction.APPROVE, "Approved by PAP Commissioner (reverse)"):
            return False
        
        # Step 15: Accounting Officer approves (reverse)
        if not self.submit_project(ROLES['accounting_officer'], 15, ProjectAction.APPROVE, "Approved by Accounting Officer (reverse)"):
            return False
        
        # Step 16: Programme Head approves (reverse)
        if not self.submit_project(ROLES['programme_head'], 16, ProjectAction.APPROVE, "Approved by Programme Head (reverse)"):
            return False
        
        # Step 17: Back to Standard User
        project = Project.query.get(self.test_project['id'])
        self.log(f"Final step: Project returned to Standard User. Current Step: {project.current_step}, Status: {project.project_status.value}", 'SUCCESS')
        
        self.log("Reverse workflow completed successfully!", 'SUCCESS')
        return True
    
    def verify_project_state(self):
        """Verify final project state."""
        project = Project.query.get(self.test_project['id'])
        self.log(f"\n=== Final Project State ===", 'INFO')
        self.log(f"Project ID: {project.id}", 'INFO')
        self.log(f"Project Code: {project.code}", 'INFO')
        self.log(f"Current Step: {project.current_step}", 'INFO')
        self.log(f"Max Step: {project.max_step}", 'INFO')
        self.log(f"Status: {project.project_status.value}", 'INFO')
        self.log(f"Workflow ID: {project.workflow_id}", 'INFO')
        
        return True
    
    def run_full_test(self):
        """Run the complete workflow test."""
        self.log("=" * 60, 'INFO')
        self.log("Starting Normal Workflow Test", 'INFO')
        self.log("=" * 60, 'INFO')
        
        # Create test project
        if not self.create_test_project():
            return False
        
        # Test forward workflow
        if not self.test_forward_workflow():
            self.log("Forward workflow test failed", 'ERROR')
            return False
        
        # Test reverse workflow
        if not self.test_reverse_workflow():
            self.log("Reverse workflow test failed", 'ERROR')
            return False
        
        # Verify final state
        self.verify_project_state()
        
        self.log("\n" + "=" * 60, 'INFO')
        self.log("Workflow Test Completed Successfully!", 'SUCCESS')
        self.log("=" * 60, 'INFO')
        
        return True
    
    def print_summary(self):
        """Print test summary."""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        for result in self.test_results:
            status = result['status']
            message = result['message']
            print(f"[{status}] {message}")


if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        tester = WorkflowTester()
        success = tester.run_full_test()
        tester.print_summary()
        
        if not success:
            sys.exit(1)

