#!/usr/bin/env python3
"""
Create test projects directly in database for implementation module
"""

import os
import sys
import logging
from datetime import datetime, timedelta

# Set environment
os.environ['APP_ENV'] = 'local'

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def create_projects_direct():
    """Create test projects directly in database"""
    try:
        print("🚀 Creating test projects directly in database...")
        
        # Import and create app
        from app import create_app
        from app.shared import db
        
        app = create_app()
        
        with app.app_context():
            # Check if projects already exist
            result = db.session.execute("SELECT COUNT(*) FROM project WHERE phase_id = 7 AND project_status = 'APPROVED'")
            existing_count = result.scalar()
            
            if existing_count > 0:
                print(f"✅ Found {existing_count} projects already exist!")
                return True
            
            print("📋 Creating test projects directly...")
            start_date = datetime.now()
            end_date = start_date + timedelta(days=365)
            
            # Insert projects directly using SQL
            from sqlalchemy import text
            
            projects_data = [
                (1, '00001-MOH', 'Rural Health Center Construction', 2, 1),
                (2, '00002-MOE', 'School Building Renovation', 3, 2),
                (3, '00003-MOF', 'Road Infrastructure Development', 1, 3),
            ]
            
            for project_id, code, name, org_id, program_id in projects_data:
                sql = text("""
                    INSERT INTO project (
                        id, code, name, project_type, project_status, phase_id, 
                        organization_id, program_id, workflow_id, current_step, max_step,
                        is_donor_funded, start_date, end_date, created_by, modified_by,
                        created_on, modified_on
                    ) VALUES (
                        :project_id, :code, :name, 'Infrastructure', 'APPROVED', 7,
                        :org_id, :program_id, 1, 1, 5,
                        false, :start_date, :end_date, 1, 1,
                        now(), now()
                    )
                """)
                db.session.execute(sql, {
                    'project_id': project_id,
                    'code': code,
                    'name': name,
                    'org_id': org_id,
                    'program_id': program_id,
                    'start_date': start_date,
                    'end_date': end_date
                })
            
            # Insert project details directly
            details_data = [
                (1, 1, 'Construction of a new rural health center to serve the local community',
                 'Lack of adequate healthcare facilities in rural areas',
                 'Improve healthcare access for rural communities'),
                (2, 2, 'Renovation and modernization of existing school buildings',
                 'Deteriorating school infrastructure affecting education quality',
                 'Provide modern learning environment for students'),
                (3, 3, 'Development of road infrastructure to improve connectivity',
                 'Poor road conditions limiting economic development',
                 'Improve transportation infrastructure and connectivity'),
            ]
            
            for detail_id, project_id, summary, problem, goal in details_data:
                sql = text("""
                    INSERT INTO project_detail (
                        id, project_id, phase_id, start_date, end_date,
                        summary, problem_statement, goal, created_by, modified_by,
                        created_on, modified_on
                    ) VALUES (
                        :detail_id, :project_id, 7, :start_date, :end_date,
                        :summary, :problem, :goal, 1, 1,
                        now(), now()
                    )
                """)
                db.session.execute(sql, {
                    'detail_id': detail_id,
                    'project_id': project_id,
                    'summary': summary,
                    'problem': problem,
                    'goal': goal,
                    'start_date': start_date,
                    'end_date': end_date
                })
            
            # Commit all data
            db.session.commit()
            
            print("✅ Test projects created successfully!")
            print("📋 Projects created:")
            print("   - 00001-MOH: Rural Health Center Construction")
            print("   - 00002-MOE: School Building Renovation") 
            print("   - 00003-MOF: Road Infrastructure Development")
            print("\n🎯 Implementation module should now show 3 projects!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = create_projects_direct()
    if success:
        print("\n🎉 Test projects creation complete!")
        print("🌐 You can now navigate to: http://localhost:3000/#/implementation-module")
    else:
        print("\n💥 Test projects creation failed.")
        sys.exit(1)
