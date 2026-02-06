"""Check the actual status of projects in the database"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from app.rest.v1.project.model import Project

app = create_app()

with app.app_context():
    projects = Project.query.filter_by(is_deleted=False).all()
    
    print(f"\n{'='*80}")
    print(f"PROJECTS IN DATABASE: {len(projects)} total")
    print(f"{'='*80}\n")
    
    for p in projects:
        print(f"Project ID: {p.id}")
        print(f"  Name: {p.name}")
        print(f"  Organization ID: {p.organization_id}")
        print(f"  Status: {p.project_status}")
        print(f"  Workflow ID: {p.workflow_id}")
        print(f"  Phase ID: {p.phase_id}")
        print(f"  Created by: {p.created_by}")
        print(f"  Max Step: {p.max_step}")
        print()
    
    print(f"{'='*80}")
    print("STATUS BREAKDOWN:")
    print(f"{'='*80}")
    
    from collections import Counter
    status_counts = Counter([p.project_status.value if hasattr(p.project_status, 'value') else str(p.project_status) for p in projects])
    
    for status, count in status_counts.items():
        print(f"  {status}: {count} project(s)")
    
    print()
