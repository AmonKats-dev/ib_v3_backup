"""
Script to fix projects with incorrect organization_id.
This script updates projects to use the correct organization_id based on:
1. User's department (user's organization_id) from the project creator
2. User department from additional_data if available
3. Falls back to program's organization_ids only if user has no organization_id

Usage:
    python fix_project_organization_id.py [--dry-run] [--project-id PROJECT_ID]
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
import argparse

def fix_project_organization_id(dry_run=True, project_id=None):
    """
    Fix projects with incorrect organization_id.
    
    Args:
        dry_run: If True, only report what would be changed without making changes
        project_id: If provided, only fix this specific project
    """
    app = create_app()
    
    with app.app_context():
        print("=" * 70)
        print("Fix Project Organization ID")
        print("=" * 70)
        print(f"\nMode: {'DRY RUN (no changes will be made)' if dry_run else 'LIVE (changes will be saved)'}")
        if project_id:
            print(f"Target Project ID: {project_id}")
        print("=" * 70)
        
        try:
            # Get projects to fix
            if project_id:
                projects = Project.query.filter(
                    Project.id == project_id,
                    Project.is_deleted == False
                ).all()
            else:
                projects = Project.query.filter(Project.is_deleted == False).all()
            
            print(f"\n[INFO] Found {len(projects)} project(s) to check")
            
            if len(projects) == 0:
                print("[WARNING] No projects found.")
                return
            
            fixed_count = 0
            skipped_count = 0
            error_count = 0
            issues = []
            
            for project in projects:
                try:
                    # Get project creator
                    creator = User.query.get(project.created_by) if project.created_by else None
                    
                    if not creator:
                        issues.append(f"Project {project.code} (ID: {project.id}): No creator found")
                        error_count += 1
                        continue
                    
                    # Get current project organization
                    current_org = Organization.query.get(project.organization_id) if project.organization_id else None
                    
                    # Get additional_data
                    additional_data = project.additional_data if project.additional_data else {}
                    user_department_id = additional_data.get('user_department_id')
                    user_vote_id = additional_data.get('user_vote_id')
                    
                    # Determine correct organization_id
                    correct_org_id = None
                    source = None
                    
                    # Priority 1: Use user_department_id from additional_data (most reliable)
                    if user_department_id:
                        user_dept_org = Organization.query.get(user_department_id)
                        if user_dept_org:
                            correct_org_id = user_department_id
                            source = "additional_data.user_department_id"
                    
                    # Priority 2: Use creator's organization_id
                    if not correct_org_id and creator.organization_id:
                        creator_org = Organization.query.get(creator.organization_id)
                        if creator_org:
                            correct_org_id = creator.organization_id
                            source = "creator.organization_id"
                    
                    # Priority 3: Try to get from program (last resort)
                    if not correct_org_id and project.program_id:
                        from app.rest.v1.program.model import Program
                        program = Program.query.get(project.program_id)
                        if program and hasattr(program, 'organization_ids') and program.organization_ids:
                            org_ids = [int(x.strip()) for x in program.organization_ids.split(',') if x.strip()]
                            if org_ids:
                                # Try to find one that matches user's vote if available
                                if user_vote_id:
                                    for org_id in org_ids:
                                        org = Organization.query.get(org_id)
                                        if org:
                                            # Check if this org or its parents match user_vote_id
                                            current_org_check = org
                                            while current_org_check:
                                                if current_org_check.id == user_vote_id:
                                                    correct_org_id = org_id
                                                    source = f"program.organization_ids (matched vote {user_vote_id})"
                                                    break
                                                current_org_check = Organization.query.get(current_org_check.parent_id) if current_org_check.parent_id else None
                                            if correct_org_id:
                                                break
                                
                                # If no match, use first one
                                if not correct_org_id:
                                    correct_org_id = org_ids[0]
                                    source = f"program.organization_ids (first org, may not match user vote)"
                    
                    # Check if fix is needed
                    if not correct_org_id:
                        issues.append(f"Project {project.code} (ID: {project.id}): Could not determine correct organization_id")
                        error_count += 1
                        continue
                    
                    if project.organization_id == correct_org_id:
                        skipped_count += 1
                        continue
                    
                    # Get organization names for display
                    current_org_name = current_org.name if current_org else "N/A"
                    correct_org = Organization.query.get(correct_org_id)
                    correct_org_name = correct_org.name if correct_org else "N/A"
                    
                    print(f"\n[FIX] Project {project.code} (ID: {project.id}): '{project.name}'")
                    print(f"  Current organization_id: {project.organization_id} ({current_org_name})")
                    print(f"  Correct organization_id: {correct_org_id} ({correct_org_name})")
                    print(f"  Source: {source}")
                    print(f"  Creator: {creator.full_name} (ID: {creator.id}, org_id: {creator.organization_id})")
                    
                    if not dry_run:
                        # Update the project
                        project.organization_id = correct_org_id
                        
                        # Also update additional_data if needed
                        if not user_department_id and correct_org:
                            if not project.additional_data:
                                project.additional_data = {}
                            elif not isinstance(project.additional_data, dict):
                                project.additional_data = {}
                            
                            project.additional_data['user_department_id'] = correct_org.id
                            project.additional_data['user_department_name'] = correct_org.name
                            project.additional_data['user_department_code'] = correct_org.code
                            
                            # Update user vote if available
                            if correct_org.parent_id:
                                parent_org = Organization.query.get(correct_org.parent_id)
                                if parent_org:
                                    project.additional_data['user_vote_id'] = parent_org.id
                                    project.additional_data['user_vote_name'] = parent_org.name
                                    project.additional_data['user_vote_code'] = parent_org.code
                        
                        db.session.add(project)
                        print(f"  ✓ Updated project organization_id")
                    
                    fixed_count += 1
                    
                except Exception as e:
                    error_msg = f"Project {project.code} (ID: {project.id}): Error - {str(e)}"
                    issues.append(error_msg)
                    error_count += 1
                    print(f"\n[ERROR] {error_msg}")
                    import traceback
                    traceback.print_exc()
            
            # Commit changes if not dry run
            if not dry_run and fixed_count > 0:
                try:
                    db.session.commit()
                    print(f"\n[SUCCESS] Committed {fixed_count} project update(s)")
                except Exception as e:
                    db.session.rollback()
                    print(f"\n[ERROR] Failed to commit changes: {e}")
                    import traceback
                    traceback.print_exc()
            
            # Print summary
            print("\n" + "=" * 70)
            print("Summary:")
            print("=" * 70)
            print(f"Total Projects Checked: {len(projects)}")
            print(f"Projects Fixed: {fixed_count}")
            print(f"Projects Skipped (already correct): {skipped_count}")
            print(f"Projects with Errors: {error_count}")
            
            if issues:
                print(f"\nIssues Found ({len(issues)}):")
                for issue in issues[:20]:  # Show first 20 issues
                    print(f"  - {issue}")
                if len(issues) > 20:
                    print(f"  ... and {len(issues) - 20} more issues")
            
            if dry_run and fixed_count > 0:
                print(f"\n[INFO] This was a DRY RUN. Run without --dry-run to apply changes.")
            
        except Exception as e:
            print(f"\n[ERROR] Fatal error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Fix project organization_id')
    parser.add_argument('--dry-run', action='store_true', help='Run without making changes')
    parser.add_argument('--project-id', type=int, help='Fix only this specific project ID')
    args = parser.parse_args()
    
    fix_project_organization_id(dry_run=args.dry_run, project_id=args.project_id)
