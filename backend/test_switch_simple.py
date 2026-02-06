#!/usr/bin/env python
"""
Simple test script for the /api/v1/auth/switch endpoint
Usage: python test_switch_simple.py [token] [role_id]
"""
import requests
import json
import sys

BASE_URL = "http://localhost:5000/api/v1"
SWITCH_URL = f"{BASE_URL}/auth/switch"

def test_switch(token, role_id=1):
    """Test the switch endpoint with provided token and role_id"""
    print(f"Testing {SWITCH_URL}")
    print(f"Token: {token[:30]}..." if token else "No token")
    print(f"Role ID: {role_id}")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    payload = {"role_id": int(role_id)}
    
    try:
        response = requests.post(SWITCH_URL, json=payload, headers=headers, timeout=10)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            data = response.json()
            print(f"Response Body:\n{json.dumps(data, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
        
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error: Could not connect to {SWITCH_URL}")
        print("   Make sure the backend server is running on http://localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    token = sys.argv[1] if len(sys.argv) > 1 else None
    role_id = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    if not token:
        print("Usage: python test_switch_simple.py <token> [role_id]")
        print("\nTo get a token, login via the frontend and check localStorage.getItem('token')")
        print("Or use: python test_switch_simple.py <token>")
        sys.exit(1)
    
    success = test_switch(token, role_id)
    sys.exit(0 if success else 1)

