"""
Test script to verify INCOMING filter works correctly for different organizations
"""

import sys
import os

# Set environment
os.environ['APP_ENV'] = 'local'

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.shared import db
from app.rest.v1.project.model import Project
from app.rest.v1.user.model import User
from app.rest.v1.user_role.model import UserRole
from app.rest.v1.organization.model import Organization
from app.rest.v1.workflow.model import Workflow
from app.constants import ProjectStatus
from flask_jwt_extended import create_access_token

def test_incoming_filter():
    """Test that INCOMING filter correctly filters by organization"""
    
    print("=" * 80)
    print("TESTING INCOMING FILTER BY ORGANIZATION")
    print("=" * 80)
    
    app = create_app()
    with app.app_context():
        # Find a submitted project from Ministry of Health
        ministry_health = Organization.query.filter(
            Organization.name.ilike('%Ministry of Health%'),
            Organization.is_deleted == False
        ).first()
        
        if not ministry_health:
            print("\n[ERROR] Ministry of Health not found!")
            return
        
        # Find a department under Ministry of Health
        dept = Organization.query.filter(
            Organization.parent_id == ministry_health.id,
            Organization.is_deleted == False
        ).first()
        
        if not dept:
            print("\n[ERROR] No department found under Ministry of Health!")
            return
        
        print(f"\n[TEST SETUP]")
        print(f"  Ministry: {ministry_health.name} (ID: {ministry_health.id})")
        print(f"  Department: {dept.name} (ID: {dept.id})")
        
        # Find a submitted project in this department
        project = Project.query.filter(
            Project.organization_id == dept.id,
            Project.project_status == ProjectStatus.SUBMITTED,
            Project.is_deleted == False
        ).first()
        
        if not project:
            print(f"\n[INFO] No SUBMITTED project found in {dept.name}")
            print("  Looking for any project in this department...")
            project = Project.query.filter(
                Project.organization_id == dept.id,
                Project.is_deleted == False
            ).first()
            if project:
                print(f"  Found project: {project.name} (Status: {project.project_status.value})")
            else:
                print("  No projects found in this department")
                return
        
        print(f"\n[TEST PROJECT]")
        print(f"  Name: {project.name}")
        print(f"  ID: {project.id}")
        print(f"  Organization ID: {project.organization_id}")
        print(f"  Status: {project.project_status.value}")
        print(f"  Workflow ID: {project.workflow_id}")
        print(f"  Step: {project.current_step}")
        
        # Get workflow
        workflow = Workflow.query.get(project.workflow_id)
        if workflow:
            print(f"  Workflow Role ID: {workflow.role_id}")
        
        # Find Department Head users in different organizations
        print(f"\n[TESTING WITH DIFFERENT USERS]")
        
        # Find Department Head in the SAME organization (should see project)
        dept_head_same = UserRole.query.filter(
            UserRole.role_id == 21,  # Department Head
            UserRole.is_approved == True
        ).join(User).filter(
            User.organization_id == project.organization_id
        ).first()
        
        if dept_head_same:
            user_same = User.query.get(dept_head_same.user_id)
            print(f"\n  [SAME ORG] User: {user_same.full_name} (org_id: {user_same.organization_id})")
            print(f"    Should see project: {user_same.organization_id == project.organization_id}")
        
        # Find Department Head in DIFFERENT organization (should NOT see project)
        dept_head_diff = UserRole.query.filter(
            UserRole.role_id == 21,  # Department Head
            UserRole.is_approved == True
        ).join(User).filter(
            User.organization_id != project.organization_id
        ).first()
        
        if dept_head_diff:
            user_diff = User.query.get(dept_head_diff.user_id)
            user_diff_org = Organization.query.get(user_diff.organization_id)
            print(f"\n  [DIFFERENT ORG] User: {user_diff.full_name} (org_id: {user_diff.organization_id})")
            print(f"    Organization: {user_diff_org.name if user_diff_org else 'N/A'}")
            print(f"    Should see project: {user_diff.organization_id == project.organization_id} (FALSE)")
            print(f"    Project org: {project.organization_id}, User org: {user_diff.organization_id}")

if __name__ == '__main__':
    test_incoming_filter()
