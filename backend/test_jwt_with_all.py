"""Test if JWT token creation works with 'all' in allowed_organization_ids"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from flask_jwt_extended import create_access_token
import json

app = create_app()

with app.app_context():
    print("\n" + "="*80)
    print("TESTING JWT TOKEN CREATION WITH 'all' VALUE")
    print("="*80 + "\n")
    
    # Test 1: Simple integer identity (like login does)
    print("Test 1: Integer identity (like normal login)")
    try:
        token = create_access_token(identity=1993)
        print(f"  [OK] Token created successfully")
        print(f"  Token length: {len(token)}\n")
    except Exception as e:
        print(f"  [ERROR] Failed: {e}\n")
    
    # Test 2: Dict with 'all' in allowed_organization_ids (like switch role does)
    print("Test 2: Dict identity with ['all'] in allowed_organization_ids")
    test_identity = {
        'id': 1993,
        'username': 'dmugabe',
        'current_role': {
            'role_id': 11,
            'role': {
                'id': 11,
                'name': 'Global Viewer',
                'phase_ids': [1, 2, 3]
            },
            'allowed_organization_ids': ['all'],
            'allowed_project_ids': None
        }
    }
    
    print(f"  Testing identity: {json.dumps(test_identity, indent=2)}")
    
    try:
        token = create_access_token(identity=test_identity)
        print(f"\n  [OK] Token created successfully")
        print(f"  Token length: {len(token)}\n")
    except Exception as e:
        print(f"\n  [ERROR] Failed: {e}\n")
        import traceback
        traceback.print_exc()
    
    # Test 3: Dict with integer in allowed_organization_ids (old way)
    print("Test 3: Dict identity with [2975] in allowed_organization_ids")
    test_identity_old = {
        'id': 1993,
        'username': 'dmugabe',
        'current_role': {
            'role_id': 11,
            'role': {
                'id': 11,
                'name': 'Global Viewer',
                'phase_ids': [1, 2, 3]
            },
            'allowed_organization_ids': [2975],
            'allowed_project_ids': None
        }
    }
    
    try:
        token = create_access_token(identity=test_identity_old)
        print(f"  [OK] Token created successfully")
        print(f"  Token length: {len(token)}\n")
    except Exception as e:
        print(f"  [ERROR] Failed: {e}\n")
        import traceback
        traceback.print_exc()
    
    print("="*80)
    print("TEST COMPLETE")
    print("="*80 + "\n")
