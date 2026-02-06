"""
Script to check why "Malaria Transmission Project" is not appearing in Incoming view
for Department Head role of Ministry of Health
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

def check_malaria_project():
    """Check the Malaria Transmission Project and why it's not appearing in Incoming"""
    
    print("=" * 80)
    print("CHECKING MALARIA TRANSMISSION PROJECT")
    print("=" * 80)
    
    app = create_app()
    with app.app_context():
        # Find the project
        project = Project.query.filter(
            Project.name.ilike('%Malaria Transmission%'),
            Project.is_deleted == False
        ).first()
        
        if not project:
            print("\n[ERROR] Project 'Malaria Transmission Project' not found!")
            print("Searching for similar projects...")
            similar = Project.query.filter(
                Project.name.ilike('%Malaria%'),
                Project.is_deleted == False
            ).all()
            if similar:
                print(f"\nFound {len(similar)} project(s) with 'Malaria' in name:")
                for p in similar:
                    print(f"  - ID: {p.id}, Name: {p.name}, Code: {p.code}")
            return
        
        print(f"\n[FOUND] Project: {project.name}")
        print(f"  - ID: {project.id}")
        print(f"  - Code: {project.code}")
        print(f"  - Organization ID: {project.organization_id}")
        print(f"  - Project Status: {project.project_status.value if project.project_status else 'None'}")
        print(f"  - Workflow ID: {project.workflow_id}")
        print(f"  - Current Step: {project.current_step}")
        print(f"  - Max Step: {project.max_step}")
        
        # Get organization details
        org = Organization.query.get(project.organization_id)
        if org:
            print(f"\n[ORGANIZATION] {org.name}")
            print(f"  - ID: {org.id}")
            print(f"  - Code: {org.code}")
            print(f"  - Level: {org.level}")
            if org.parent_id:
                parent_org = Organization.query.get(org.parent_id)
                if parent_org:
                    print(f"  - Parent: {parent_org.name} (ID: {parent_org.id})")
        
        # Get workflow details
        workflow = Workflow.query.get(project.workflow_id)
        if workflow:
            print(f"\n[WORKFLOW] Step {workflow.step}")
            print(f"  - ID: {workflow.id}")
            print(f"  - Role ID: {workflow.role_id}")
            print(f"  - Status Message: {workflow.status_msg}")
            print(f"  - Project Status: {workflow.project_status.value if workflow.project_status else 'None'}")
        
        # Check if project should appear in Incoming
        print(f"\n[INCOMING CHECK]")
        print(f"  - Project Status is SUBMITTED: {project.project_status == ProjectStatus.SUBMITTED}")
        print(f"  - Workflow Role ID: {workflow.role_id if workflow else 'N/A'}")
        
        # Find Department Head users in Ministry of Health
        print(f"\n[DEPARTMENT HEADS IN MINISTRY OF HEALTH]")
        
        # First, find Ministry of Health organization
        ministry_health = Organization.query.filter(
            Organization.name.ilike('%Ministry of Health%'),
            Organization.is_deleted == False
        ).first()
        
        if not ministry_health:
            print("  [ERROR] Ministry of Health organization not found!")
            return
        
        print(f"  Found: {ministry_health.name} (ID: {ministry_health.id}, Level: {ministry_health.level})")
        
        # Find all departments under Ministry of Health
        departments = Organization.query.filter(
            Organization.parent_id == ministry_health.id,
            Organization.is_deleted == False
        ).all()
        
        print(f"  Found {len(departments)} department(s) under Ministry of Health:")
        for dept in departments:
            print(f"    - {dept.name} (ID: {dept.id}, Code: {dept.code})")
        
        # Find Department Head role (role_id 21)
        print(f"\n[DEPARTMENT HEAD USERS]")
        dept_head_user_roles = UserRole.query.filter(
            UserRole.role_id == 21,  # Department Head
            UserRole.is_approved == True
        ).all()
        
        print(f"  Found {len(dept_head_user_roles)} Department Head user role(s) in system")
        
        # Check which ones are in Ministry of Health departments
        matching_users = []
        for user_role in dept_head_user_roles:
            user = User.query.get(user_role.user_id)
            if user and user.organization_id:
                user_org = Organization.query.get(user.organization_id)
                if user_org:
                    # Check if user's org is a department under Ministry of Health
                    if user_org.parent_id == ministry_health.id:
                        matching_users.append({
                            'user_id': user.id,
                            'username': user.username,
                            'full_name': user.full_name,
                            'organization_id': user.organization_id,
                            'organization_name': user_org.name
                        })
        
        print(f"  Found {len(matching_users)} Department Head(s) in Ministry of Health departments:")
        for u in matching_users:
            print(f"    - {u['full_name']} ({u['username']})")
            print(f"      Organization: {u['organization_name']} (ID: {u['organization_id']})")
            print(f"      Should see project: {u['organization_id'] == project.organization_id}")
        
        # Check if project's organization matches any Department Head
        project_org = Organization.query.get(project.organization_id)
        if project_org:
            print(f"\n[PROJECT ORGANIZATION CHECK]")
            print(f"  Project Organization: {project_org.name} (ID: {project_org.id})")
            print(f"  Parent ID: {project_org.parent_id}")
            
            if project_org.parent_id:
                parent = Organization.query.get(project_org.parent_id)
                if parent:
                    print(f"  Parent: {parent.name} (ID: {parent.id})")
                    print(f"  Is under Ministry of Health: {parent.id == ministry_health.id}")
        
        # Summary
        print(f"\n[SUMMARY]")
        print(f"  Project Status: {project.project_status.value}")
        print(f"  Project Organization ID: {project.organization_id}")
        print(f"  Workflow Role ID: {workflow.role_id if workflow else 'N/A'}")
        print(f"  Should appear in Incoming: {project.project_status == ProjectStatus.SUBMITTED and workflow and workflow.role_id == 21}")
        
        # Check if any Department Head in Ministry of Health should see it
        if matching_users:
            for u in matching_users:
                if u['organization_id'] == project.organization_id:
                    print(f"\n  [MATCH] {u['full_name']} should see this project in Incoming!")
                    print(f"    BUT: Project status is {project.project_status.value}, needs to be SUBMITTED")
                    print(f"    AND: Project is at step {project.current_step}, needs to be at step 2 (Department Head)")
                else:
                    print(f"\n  [NO MATCH] {u['full_name']} (org_id={u['organization_id']}) != Project (org_id={project.organization_id})")
        else:
            print(f"\n  [WARNING] No Department Head users found in Ministry of Health departments!")
        
        # Check what needs to happen for it to appear
        print(f"\n[REQUIREMENTS FOR INCOMING VIEW]")
        print(f"  Current Status: {project.project_status.value}")
        print(f"  Required Status: SUBMITTED")
        print(f"  Current Step: {project.current_step}")
        print(f"  Required Step: 2 (Department Head)")
        print(f"  Current Workflow Role: {workflow.role_id if workflow else 'N/A'}")
        print(f"  Required Workflow Role: 21 (Department Head)")
        
        if project.project_status != ProjectStatus.SUBMITTED:
            print(f"\n  [ACTION NEEDED] Project must be SUBMITTED by Standard User to appear in Incoming")
        if project.current_step != 2:
            print(f"  [ACTION NEEDED] Project must be at step 2 (Department Head workflow)")
        if workflow and workflow.role_id != 21:
            print(f"  [ACTION NEEDED] Project workflow must be for role_id 21 (Department Head)")

if __name__ == '__main__':
    check_malaria_project()
