#!/usr/bin/env python
"""
Test script for the /api/v1/auth/switch endpoint
"""
import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:5000/api/v1"
LOGIN_URL = f"{BASE_URL}/auth/login"
SWITCH_URL = f"{BASE_URL}/auth/switch"

def test_switch_endpoint():
    """Test the switch endpoint"""
    print("=" * 60)
    print("Testing /api/v1/auth/switch endpoint")
    print("=" * 60)
    
    # Step 1: Login to get a token
    print("\n1. Logging in to get authentication token...")
    login_data = {
        "username": input("Enter username (or press Enter to skip login): ").strip(),
        "password": input("Enter password (or press Enter to skip): ").strip()
    }
    
    if not login_data["username"] or not login_data["password"]:
        print("\n⚠️  Skipping login. Please provide a valid token manually.")
        token = input("Enter JWT token (or press Enter to exit): ").strip()
        if not token:
            print("Exiting...")
            return
    else:
        try:
            response = requests.post(LOGIN_URL, json=login_data)
            print(f"   Login response status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"   ❌ Login failed: {response.text}")
                return
            
            data = response.json()
            token = data.get('access_token')
            if not token:
                print(f"   ❌ No token in response: {data}")
                return
            
            print(f"   ✅ Login successful! Token received (length: {len(token)})")
        except Exception as e:
            print(f"   ❌ Login error: {str(e)}")
            return
    
    # Step 2: Test switch endpoint
    print("\n2. Testing switch endpoint...")
    role_id = input("Enter role_id to switch to (or press Enter to use 1): ").strip()
    if not role_id:
        role_id = "1"
    
    try:
        role_id_int = int(role_id)
    except ValueError:
        print(f"   ❌ Invalid role_id: {role_id}")
        return
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    payload = {
        "role_id": role_id_int
    }
    
    print(f"   Request URL: {SWITCH_URL}")
    print(f"   Request payload: {json.dumps(payload, indent=2)}")
    print(f"   Headers: Authorization: Bearer {token[:20]}...")
    
    try:
        response = requests.post(SWITCH_URL, json=payload, headers=headers)
        print(f"\n   Response status: {response.status_code}")
        print(f"   Response headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"   Response body:")
            print(json.dumps(response_data, indent=2))
        except:
            print(f"   Response body (text): {response.text}")
        
        if response.status_code == 200:
            print("\n   ✅ Switch endpoint test PASSED!")
            if 'access_token' in response_data:
                print(f"   ✅ New access token received (length: {len(response_data['access_token'])})")
        else:
            print(f"\n   ❌ Switch endpoint test FAILED with status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection error: Could not connect to {SWITCH_URL}")
        print("   Make sure the backend server is running on http://localhost:5000")
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        import traceback
        print(f"   Traceback: {traceback.format_exc()}")

if __name__ == "__main__":
    test_switch_endpoint()

