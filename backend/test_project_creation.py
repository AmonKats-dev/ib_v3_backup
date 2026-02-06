"""
Test script to create a project via the API
This will help debug the organization_id issue
"""
import requests
import json
import sys
import os

# Fix Windows console encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuration
API_BASE_URL = "http://localhost:5000/api/v1"
PROJECTS_ENDPOINT = f"{API_BASE_URL}/projects"

# You'll need to get a valid token from your login
# For now, we'll try without auth or you can add it
headers = {
    "Content-Type": "application/json",
    # "Authorization": "Bearer YOUR_TOKEN_HERE"  # Uncomment and add your token
}

# Test data - minimal project data
test_project_data = {
    "name": "Test Project - API Creation",
    "function_id": 3,  # The function_id from your error
    "program_id": 22,  # The program_id from your error
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "duration": 12,
    "summary": "Test project created via script",
    "is_dlp": False,
    "is_omp": False,
    "is_evaluation": False,
    "revenue_source": [],
    "om_costs": [],
    # organization_id will be derived by backend
}

def test_project_creation():
    print("=" * 80)
    print("TESTING PROJECT CREATION VIA API")
    print("=" * 80)
    print(f"\nEndpoint: {PROJECTS_ENDPOINT}")
    print(f"\nTest Data:")
    print(json.dumps(test_project_data, indent=2))
    print("\n" + "=" * 80)
    
    try:
        print("\nSending POST request...")
        response = requests.post(
            PROJECTS_ENDPOINT,
            headers=headers,
            json=test_project_data,
            timeout=30
        )
        
        print(f"\nResponse Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"\nResponse JSON:")
            print(json.dumps(response_data, indent=2))
        except:
            print(f"\nResponse Text:")
            print(response.text)
        
        if response.status_code == 201:
            print("\nSUCCESS: Project created successfully!")
            return True
        elif response.status_code == 422:
            print("\nVALIDATION ERROR: Check the error message above")
            if isinstance(response_data, dict) and 'error' in response_data:
                print(f"\nError: {response_data['error']}")
            return False
        elif response.status_code == 401:
            print("\nAUTHENTICATION ERROR: You need to add a valid token")
            print("   Get a token by logging in and check the Authorization header")
            return False
        else:
            print(f"\nERROR: Unexpected status code {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\nCONNECTION ERROR: Could not connect to the API")
        print("   Make sure your backend server is running on http://localhost:5000")
        return False
    except Exception as e:
        print(f"\nEXCEPTION: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

def check_function_and_program():
    """Check if function_id=3 and program_id=22 exist and have organization_id"""
    print("\n" + "=" * 80)
    print("CHECKING FUNCTION AND PROGRAM DATA")
    print("=" * 80)
    
    # Check function
    try:
        print(f"\nChecking function_id=3...")
        func_response = requests.get(f"{API_BASE_URL}/functions/3", headers=headers, timeout=10)
        if func_response.status_code == 200:
            func_data = func_response.json()
            print(f"Function found:")
            print(f"   ID: {func_data.get('id')}")
            print(f"   Name: {func_data.get('name')}")
            print(f"   organization_id: {func_data.get('organization_id')}")
            if not func_data.get('organization_id'):
                print("   WARNING: Function has no organization_id!")
        else:
            print(f"ERROR: Function not found (status: {func_response.status_code})")
    except Exception as e:
        print(f"ERROR: Error checking function: {e}")
    
    # Check program
    try:
        print(f"\nChecking program_id=22...")
        prog_response = requests.get(f"{API_BASE_URL}/programs/22", headers=headers, timeout=10)
        if prog_response.status_code == 200:
            prog_data = prog_response.json()
            print(f"Program found:")
            print(f"   ID: {prog_data.get('id')}")
            print(f"   Name: {prog_data.get('name')}")
            print(f"   organization_ids: {prog_data.get('organization_ids')}")
            if not prog_data.get('organization_ids'):
                print("   WARNING: Program has no organization_ids!")
        else:
            print(f"ERROR: Program not found (status: {prog_response.status_code})")
    except Exception as e:
        print(f"ERROR: Error checking program: {e}")

if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("PROJECT CREATION TEST SCRIPT")
    print("=" * 80)
    print("\nThis script will:")
    print("1. Check if function_id=3 and program_id=22 exist and have organization data")
    print("2. Attempt to create a project via the API")
    print("\nNOTE: You may need to add an Authorization token to the headers")
    print("      Get it by logging in through the frontend and checking the browser's")
    print("      Network tab for the Authorization header in API requests.")
    print("\n" + "=" * 80)
    
    # First check the function and program
    check_function_and_program()
    
    # Then try to create the project
    print("\n")
    print("=" * 80)
    print("NOTE: Authentication required. To get a token:")
    print("1. Open http://localhost:3000 in your browser")
    print("2. Log in to the application")
    print("3. Open browser DevTools (F12) -> Network tab")
    print("4. Make any API request and check the 'Authorization' header")
    print("5. Copy the token and update the script's headers variable")
    print("=" * 80)
    print("\nAttempting project creation (will fail without auth token)...\n")
    success = test_project_creation()
    
    sys.exit(0 if success else 1)

