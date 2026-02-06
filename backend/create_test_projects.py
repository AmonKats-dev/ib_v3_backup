#!/usr/bin/env python3
"""
Create test projects for implementation module
"""

import os
import sys
import logging
from datetime import datetime, timedelta

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def create_test_projects():
    """Create test projects for implementation module"""
    try:
        print("🚀 Creating test projects for implementation module...")
        
        # Import and create app
        from app import create_app
        from app.shared import db
        from app.rest.v1.project.model import Project
        from app.rest.v1.project_detail.model import ProjectDetail
        from app.constants import ProjectStatus
        
        app = create_app()
        
        with app.app_context():
            # Check if projects already exist
            existing_projects = Project.query.filter_by(phase_id=7, project_status='APPROVED').count()
            if existing_projects > 0:
                print(f"✅ Found {existing_projects} projects already exist!")
                return True
            
            print("📋 Creating test projects...")
            start_date = datetime.now()
            end_date = start_date + timedelta(days=365)
            
            projects = [
                Project(
                    id=1,
                    code="00001-MOH",
                    name="Rural Health Center Construction",
                    project_type="Infrastructure",
                    project_status=ProjectStatus.APPROVED,
                    phase_id=7,  # Pipeline phase - this is what the implementation module looks for
                    organization_id=2,  # Ministry of Health
                    program_id=1,  # Health Sector Development Program
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
                    code="00002-MOE", 
                    name="School Building Renovation",
                    project_type="Infrastructure",
                    project_status=ProjectStatus.APPROVED,
                    phase_id=7,  # Pipeline phase
                    organization_id=3,  # Ministry of Education
                    program_id=2,  # Education Enhancement Program
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
                    code="00003-MOF",
                    name="Road Infrastructure Development",
                    project_type="Infrastructure", 
                    project_status=ProjectStatus.APPROVED,
                    phase_id=7,  # Pipeline phase
                    organization_id=1,  # Ministry of Finance
                    program_id=3,  # Infrastructure Development Program
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
            
            print("✅ Test projects created successfully!")
            print("📋 Projects created:")
            print("   - PROJ-001: Rural Health Center Construction")
            print("   - PROJ-002: School Building Renovation") 
            print("   - PROJ-003: Road Infrastructure Development")
            print("\n🎯 Implementation module should now show 3 projects!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = create_test_projects()
    if success:
        print("\n🎉 Test projects creation complete!")
        print("🌐 You can now navigate to: http://localhost:3000/#/implementation-module")
    else:
        print("\n💥 Test projects creation failed.")
        sys.exit(1)
