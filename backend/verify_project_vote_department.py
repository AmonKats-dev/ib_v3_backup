"""
Verification script to ensure projects are correctly associated with:
1. User Vote (parent organization)
2. User Department (user's organization)
3. Programs (multiple projects from same vote can share one program)

Hierarchy: User Vote -> User Department -> Projects -> Programs
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
from app.rest.v1.project.model import Project
from app.rest.v1.user.model import User
from app.rest.v1.organization.model import Organization
from app.rest.v1.program.model import Program


def verify_project_vote_department():
    """Verify that projects are correctly associated with user vote and department."""
    
    print("=" * 70)
    print("Project Vote and Department Verification")
    print("=" * 70)
    print("\nExpected Hierarchy:")
    print("  User Vote (parent org)")
    print("    └─ User Department (user's org)")
    print("         └─ Projects")
    print("              └─ Programs (can be shared across projects)")
    print("\n" + "=" * 70)
    
    try:
        # Get all projects
        projects = Project.query.filter(Project.is_deleted == False).all()
        
        print(f"\n[INFO] Found {len(projects)} active project(s)")
        
        if len(projects) == 0:
            print("[WARNING] No projects found. Create some projects first to verify.")
            return
        
        # Statistics
        projects_with_user_vote = 0
        projects_with_user_department = 0
        projects_correctly_linked = 0
        projects_by_vote = {}
        projects_by_department = {}
        programs_by_vote = {}
        issues = []
        
        for project in projects:
            # Get project creator
            creator = User.query.get(project.created_by) if project.created_by else None
            
            # Get project organization (should be user's department)
            project_org = Organization.query.get(project.organization_id) if project.organization_id else None
            
            # Get additional_data
            additional_data = project.additional_data if project.additional_data else {}
            
            # Check user vote and department in additional_data
            user_vote_id = additional_data.get('user_vote_id')
            user_department_id = additional_data.get('user_department_id')
            user_vote_name = additional_data.get('user_vote_name', 'N/A')
            user_department_name = additional_data.get('user_department_name', 'N/A')
            
            # Get user vote and department organizations
            user_vote_org = Organization.query.get(user_vote_id) if user_vote_id else None
            user_department_org = Organization.query.get(user_department_id) if user_department_id else None
            
            # Verify project organization matches user department
            org_matches = False
            if project_org and user_department_org:
                org_matches = project_org.id == user_department_org.id
            elif project_org and creator and creator.organization_id:
                org_matches = project_org.id == creator.organization_id
            
            # Track statistics
            if user_vote_id:
                projects_with_user_vote += 1
                vote_key = f"{user_vote_name} (ID: {user_vote_id})"
                if vote_key not in projects_by_vote:
                    projects_by_vote[vote_key] = []
                projects_by_vote[vote_key].append(project.id)
                
                # Track programs by vote
                if project.program_id:
                    program = Program.query.get(project.program_id)
                    if program:
                        program_key = f"{program.name} (ID: {program.id})"
                        if vote_key not in programs_by_vote:
                            programs_by_vote[vote_key] = {}
                        if program_key not in programs_by_vote[vote_key]:
                            programs_by_vote[vote_key][program_key] = []
                        programs_by_vote[vote_key][program_key].append(project.id)
            
            if user_department_id:
                projects_with_user_department += 1
                dept_key = f"{user_department_name} (ID: {user_department_id})"
                if dept_key not in projects_by_department:
                    projects_by_department[dept_key] = []
                projects_by_department[dept_key].append(project.id)
            
            if org_matches and user_vote_id and user_department_id:
                projects_correctly_linked += 1
            else:
                issue_msg = f"Project {project.code} (ID: {project.id})"
                if not org_matches:
                    issue_msg += f" - organization_id ({project.organization_id}) doesn't match user department ({user_department_id})"
                if not user_vote_id:
                    issue_msg += " - missing user_vote_id in additional_data"
                if not user_department_id:
                    issue_msg += " - missing user_department_id in additional_data"
                issues.append(issue_msg)
        
        # Print statistics
        print("\n" + "=" * 70)
        print("Statistics:")
        print("=" * 70)
        print(f"Total Projects: {len(projects)}")
        print(f"Projects with User Vote: {projects_with_user_vote} ({projects_with_user_vote/len(projects)*100:.1f}%)")
        print(f"Projects with User Department: {projects_with_user_department} ({projects_with_user_department/len(projects)*100:.1f}%)")
        print(f"Projects Correctly Linked: {projects_correctly_linked} ({projects_correctly_linked/len(projects)*100:.1f}%)")
        
        # Print projects by vote
        print("\n" + "=" * 70)
        print("Projects by User Vote:")
        print("=" * 70)
        if projects_by_vote:
            for vote, project_ids in sorted(projects_by_vote.items()):
                print(f"\n{vote}:")
                print(f"  Projects: {len(project_ids)}")
                print(f"  Project IDs: {', '.join(map(str, project_ids[:10]))}{'...' if len(project_ids) > 10 else ''}")
        else:
            print("  No projects with user vote found")
        
        # Print projects by department
        print("\n" + "=" * 70)
        print("Projects by User Department:")
        print("=" * 70)
        if projects_by_department:
            for dept, project_ids in sorted(projects_by_department.items()):
                print(f"\n{dept}:")
                print(f"  Projects: {len(project_ids)}")
                print(f"  Project IDs: {', '.join(map(str, project_ids[:10]))}{'...' if len(project_ids) > 10 else ''}")
        else:
            print("  No projects with user department found")
        
        # Print programs shared by projects within same vote
        print("\n" + "=" * 70)
        print("Programs Shared by Projects within Same Vote:")
        print("=" * 70)
        if programs_by_vote:
            for vote, programs in sorted(programs_by_vote.items()):
                print(f"\n{vote}:")
                for program, project_ids in sorted(programs.items()):
                    if len(project_ids) > 1:
                        print(f"  {program}:")
                        print(f"    Shared by {len(project_ids)} projects")
                        print(f"    Project IDs: {', '.join(map(str, project_ids))}")
        else:
            print("  No programs found")
        
        # Print issues
        if issues:
            print("\n" + "=" * 70)
            print("Issues Found:")
            print("=" * 70)
            for issue in issues:
                print(f"  ⚠ {issue}")
        else:
            print("\n" + "=" * 70)
            print("✓ All projects are correctly linked to user vote and department!")
            print("=" * 70)
        
        # Summary
        print("\n" + "=" * 70)
        print("Summary:")
        print("=" * 70)
        print(f"✓ Projects belong to User Departments (organization_id = user's organization)")
        print(f"✓ User Vote and Department are stored in additional_data")
        print(f"✓ Multiple projects from the same vote can share one program")
        if issues:
            print(f"\n⚠ Found {len(issues)} issue(s) that need attention")
        else:
            print(f"\n✓ All verifications passed!")
        
    except Exception as e:
        print(f"\n[ERROR] Failed to verify projects: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        verify_project_vote_department()
