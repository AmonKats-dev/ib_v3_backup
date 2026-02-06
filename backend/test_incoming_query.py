"""
Test script to verify INCOMING query filters projects correctly by organization
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
from app.rest.v1.organization.model import Organization
from flask_jwt_extended import create_access_token
from sqlalchemy.orm import Query

def test_incoming_query():
    """Test that INCOMING query correctly filters by organization"""
    
    print("=" * 80)
    print("TESTING INCOMING QUERY FILTERING")
    print("=" * 80)
    
    app = create_app()
    with app.app_context():
        # Find a Department Head user from Ministry of Health
        ministry_health = Organization.query.filter(
            Organization.name.ilike('%Ministry of Health%'),
            Organization.is_deleted == False
        ).first()
        
        if not ministry_health:
            print("\n[ERROR] Ministry of Health not found!")
            return
        
        # Find a department under Ministry of Health
        dept_health = Organization.query.filter(
            Organization.parent_id == ministry_health.id,
            Organization.is_deleted == False
        ).first()
        
        if not dept_health:
            print("\n[ERROR] No department found under Ministry of Health!")
            return
        
        # Find a Department Head user in this department
        from app.rest.v1.user_role.model import UserRole
        dept_head = UserRole.query.filter(
            UserRole.role_id == 21,  # Department Head
            UserRole.is_approved == True
        ).join(User).filter(
            User.organization_id == dept_health.id
        ).first()
        
        if not dept_head:
            print(f"\n[ERROR] No Department Head found in {dept_health.name}!")
            return
        
        user = User.query.get(dept_head.user_id)
        print(f"\n[TEST USER]")
        print(f"  Name: {user.full_name}")
        print(f"  ID: {user.id}")
        print(f"  Organization: {dept_health.name} (ID: {dept_health.id})")
        
        # Create a JWT token for this user
        from flask_jwt_extended import create_access_token
        from app.rest.v1.user.service import UserService
        
        user_service = UserService()
        user_data = user_service.get_one(user.id)
        
        # Create token with user's current role
        token = create_access_token(identity={
            'id': user.id,
            'original_id': user.id,
            'username': user.username,
            'current_role': user_data.get('current_role') if user_data else None
        })
        
        print(f"\n[TOKEN CREATED]")
        
        # Now test the query with INCOMING filter
        # We need to simulate the request context
        from flask import Flask
        test_app = Flask(__name__)
        test_app.config['JWT_SECRET_KEY'] = app.config['JWT_SECRET_KEY']
        
        with test_app.test_request_context():
            from flask_jwt_extended import set_access_cookies
            # Set the JWT in the request context
            with test_app.test_client() as client:
                # Make a request with the token
                headers = {'Authorization': f'Bearer {token}'}
                
                # Test the filter
                filter_dict = {'action': 'INCOMING'}
                
                # Get filters
                access_filters = Project.get_access_filters(Project, filter=filter_dict)
                regular_filters = Project.get_filters(Project, filter_dict)
                
                print(f"\n[FILTERS GENERATED]")
                print(f"  Access filters count: {len(access_filters)}")
                print(f"  Regular filters count: {len(regular_filters)}")
                
                # Try to build the query
                query = Project.query
                query = query.filter(*access_filters)
                query = query.filter(*regular_filters)
                
                # Print the SQL
                print(f"\n[SQL QUERY]")
                print(str(query))
                
                # Count results
                count = query.count()
                print(f"\n[RESULTS]")
                print(f"  Total projects matching: {count}")
                
                # Get a few projects
                projects = query.limit(5).all()
                for project in projects:
                    project_org = Organization.query.get(project.organization_id)
                    print(f"  - {project.name} (org_id: {project.organization_id}, org: {project_org.name if project_org else 'N/A'})")
                    if project.organization_id != user.organization_id:
                        print(f"    [WARNING] Organization mismatch! Project org: {project.organization_id}, User org: {user.organization_id}")

if __name__ == '__main__':
    test_incoming_query()
