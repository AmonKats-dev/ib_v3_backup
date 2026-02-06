#!/usr/bin/env python3
"""
Load comprehensive test data into the database for IBP implementation module
"""

import os
import sys
import logging
from datetime import datetime, timedelta

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def load_comprehensive_test_data():
    """Load comprehensive test data into the database"""
    try:
        print("🚀 Loading comprehensive test data into IBP Database...")
        
        # Import and create app
        from app import create_app
        from app.shared import db
        from app.rest.v1.user.model import User
        from app.rest.v1.role.model import Role
        from app.rest.v1.user_role.model import UserRole
        from app.rest.v1.phase.model import Phase
        from app.rest.v1.organization.model import Organization
        from app.rest.v1.program.model import Program
        from app.rest.v1.project.model import Project
        from app.rest.v1.project_detail.model import ProjectDetail
        from app.rest.v1.workflow.model import Workflow
        from app.constants import ProjectStatus
        
        app = create_app()
        
        with app.app_context():
            print("📊 Loading comprehensive test data...")
            
            # Check if projects already exist
            existing_projects = Project.query.filter_by(phase_id=7, project_status='APPROVED').count()
            if existing_projects > 0:
                print(f"⚠️  Found {existing_projects} projects already exist. Skipping...")
                return True
            
            # Create phases
            print("📋 Creating phases...")
            phases = [
                Phase(id=1, name="Concept", description="Project concept phase", created_by=1, modified_by=1),
                Phase(id=2, name="Design", description="Project design phase", created_by=1, modified_by=1),
                Phase(id=3, name="Planning", description="Project planning phase", created_by=1, modified_by=1),
                Phase(id=4, name="Approval", description="Project approval phase", created_by=1, modified_by=1),
                Phase(id=5, name="Implementation", description="Project implementation phase", created_by=1, modified_by=1),
                Phase(id=6, name="Monitoring", description="Project monitoring phase", created_by=1, modified_by=1),
                Phase(id=7, name="Pipeline", description="Project pipeline phase", created_by=1, modified_by=1),
                Phase(id=8, name="Completion", description="Project completion phase", created_by=1, modified_by=1),
            ]
            
            for phase in phases:
                db.session.add(phase)
            
            # Create organizations
            print("🏢 Creating organizations...")
            organizations = [
                Organization(
                    id=1, 
                    name="Ministry of Finance", 
                    code="MOF", 
                    level=1, 
                    parent_id=None,
                    created_by=1, 
                    modified_by=1
                ),
                Organization(
                    id=2, 
                    name="Ministry of Health", 
                    code="MOH", 
                    level=1, 
                    parent_id=None,
                    created_by=1, 
                    modified_by=1
                ),
                Organization(
                    id=3, 
                    name="Ministry of Education", 
                    code="MOE", 
                    level=1, 
                    parent_id=None,
                    created_by=1, 
                    modified_by=1
                ),
            ]
            
            for org in organizations:
                db.session.add(org)
            
            # Create programs
            print("📚 Creating programs...")
            programs = [
                Program(
                    id=1, 
                    name="Health Sector Development Program", 
                    code="HSDP",
                    organization_id=2,
                    created_by=1, 
                    modified_by=1
                ),
                Program(
                    id=2, 
                    name="Education Enhancement Program", 
                    code="EEP",
                    organization_id=3,
                    created_by=1, 
                    modified_by=1
                ),
                Program(
                    id=3, 
                    name="Infrastructure Development Program", 
                    code="IDP",
                    organization_id=1,
                    created_by=1, 
                    modified_by=1
                ),
            ]
            
            for program in programs:
                db.session.add(program)
            
            # Create users if they don't exist
            print("👥 Creating users...")
            existing_user = User.query.filter_by(username='test').first()
            if not existing_user:
                test_user1 = User(
                    id=1,
                    username='test',
                    password='$pbkdf2-sha256$29000$y/lf6/0/p3TOmZMyxthbyw$EDo/LNVEXi9bmqnSrao.Lz4J0x5jhcV7ECbn3HYpd0k',  # password: 'test'
                    full_name='John Doe',
                    email='test@test.com',
                    phone='11111',
                    is_blocked=False,
                    created_by=1,
                    modified_by=1
                )
                db.session.add(test_user1)
            
            # Create roles if they don't exist
            print("🔐 Creating roles...")
            existing_role = Role.query.filter_by(name='admin').first()
            if not existing_role:
                admin_role = Role(
                    id=1,
                    name='admin',
                    is_deleted=False,
                    permissions='["full_access"]',
                    phase_ids='[1,2,3,4,5,6,7,8]',
                    created_by=1,
                    modified_by=1
                )
                db.session.add(admin_role)
            
            # Create user-role relationship if it doesn't exist
            print("🔗 Creating user-role relationships...")
            existing_user_role = UserRole.query.filter_by(user_id=1, role_id=1).first()
            if not existing_user_role:
                user_role = UserRole(
                    id=1,
                    user_id=1,
                    role_id=1,
                    is_approved=True,
                    is_delegated=False,
                    created_by=1,
                    modified_by=1
                )
                db.session.add(user_role)
            
            # Commit the basic data first
            db.session.commit()
            
            # Create workflows (after roles are created)
            print("🔄 Creating workflows...")
            workflows = [
                Workflow(
                    id=1, 
                    role_id=1,  # Admin role
                    step=1,
                    status_msg="Submitted",
                    phases='[1,2,3,4,5,6,7,8]',  # All phases
                    project_status=ProjectStatus.DRAFT,
                    created_by=1, 
                    modified_by=1
                ),
            ]
            
            for workflow in workflows:
                db.session.add(workflow)
            
            # Commit workflow data
            db.session.commit()
            
            # Create projects
            print("📋 Creating projects...")
            start_date = datetime.now()
            end_date = start_date + timedelta(days=365)
            
            projects = [
                Project(
                    id=1,
                    code="PROJ-001",
                    name="Rural Health Center Construction",
                    project_type="Infrastructure",
                    project_status=ProjectStatus.APPROVED,
                    phase_id=7,  # Pipeline phase - this is what the implementation module looks for
                    organization_id=2,
                    program_id=1,
                    workflow_id=1,
                    current_step=1,
                    max_step=5,
                    is_donor_funded=False,
                    start_date=start_date,
                    end_date=end_date,
                    created_by=1,
                    modified_by=1
                ),
                Project(
                    id=2,
                    code="PROJ-002", 
                    name="School Building Renovation",
                    project_type="Infrastructure",
                    project_status=ProjectStatus.APPROVED,
                    phase_id=7,  # Pipeline phase
                    organization_id=3,
                    program_id=2,
                    workflow_id=1,
                    current_step=1,
                    max_step=5,
                    is_donor_funded=False,
                    start_date=start_date,
                    end_date=end_date,
                    created_by=1,
                    modified_by=1
                ),
                Project(
                    id=3,
                    code="PROJ-003",
                    name="Road Infrastructure Development",
                    project_type="Infrastructure", 
                    project_status=ProjectStatus.APPROVED,
                    phase_id=7,  # Pipeline phase
                    organization_id=1,
                    program_id=3,
                    workflow_id=1,
                    current_step=1,
                    max_step=5,
                    is_donor_funded=False,
                    start_date=start_date,
                    end_date=end_date,
                    created_by=1,
                    modified_by=1
                ),
            ]
            
            for project in projects:
                db.session.add(project)
            
            # Create project details
            print("📝 Creating project details...")
            project_details = [
                ProjectDetail(
                    id=1,
                    project_id=1,
                    phase_id=7,
                    start_date=start_date,
                    end_date=end_date,
                    summary="Construction of a new rural health center to serve the local community",
                    problem_statement="Lack of adequate healthcare facilities in rural areas",
                    goal="Improve healthcare access for rural communities",
                    created_by=1,
                    modified_by=1
                ),
                ProjectDetail(
                    id=2,
                    project_id=2,
                    phase_id=7,
                    start_date=start_date,
                    end_date=end_date,
                    summary="Renovation and modernization of existing school buildings",
                    problem_statement="Deteriorating school infrastructure affecting education quality",
                    goal="Provide modern learning environment for students",
                    created_by=1,
                    modified_by=1
                ),
                ProjectDetail(
                    id=3,
                    project_id=3,
                    phase_id=7,
                    start_date=start_date,
                    end_date=end_date,
                    summary="Development of road infrastructure to improve connectivity",
                    problem_statement="Poor road conditions limiting economic development",
                    goal="Improve transportation infrastructure and connectivity",
                    created_by=1,
                    modified_by=1
                ),
            ]
            
            for detail in project_details:
                db.session.add(detail)
            
            # Commit all data
            db.session.commit()
            
            print("✅ Comprehensive test data loaded successfully!")
            print("📋 Data created:")
            print("   - 8 Phases (including Pipeline phase ID 7)")
            print("   - 3 Organizations")
            print("   - 3 Programs")
            print("   - 1 Workflow")
            print("   - 3 Projects with APPROVED status and phase_id=7")
            print("   - 3 Project Details")
            print("   - Users and roles")
            print("\n🎯 Implementation module should now show 3 projects!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = load_comprehensive_test_data()
    if success:
        print("\n🎉 Comprehensive test data loading complete!")
        print("🌐 You can now navigate to: http://localhost:3000/#/implementation-module")
    else:
        print("\n💥 Test data loading failed.")
        sys.exit(1)
