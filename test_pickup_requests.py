#!/usr/bin/env python3
"""
Test script for pickup request functionality
"""

import requests
import json
from datetime import datetime, timedelta

# Backend URL
BASE_URL = "http://localhost:8000"

def test_pickup_requests():
    print("🧪 Testing Pickup Request Functionality")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is healthy")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return
    
    # Test 2: Login with test user
    print("\n2. Logging in with test user...")
    login_data = {
        "email": "test@example.com",
        "password": "testpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            print("✅ Test user logged in successfully")
            user_info = response.json()
            token = user_info.get("access_token")
            if not token:
                print("❌ No access token received")
                return
        else:
            print(f"❌ User login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Test 3: Create a pickup request
    print("\n3. Creating pickup request...")
    pickup_data = {
        "pickup_address": "123 Test Street, Test City",
        "pickup_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "pickup_time_slot": "09:00 - 12:00",
        "package_count": 2,
        "special_instructions": "Please ring the doorbell twice"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/pickup-requests", json=pickup_data, headers=headers)
        if response.status_code == 200:
            print("✅ Pickup request created successfully")
            pickup_info = response.json()
            print(f"   Request ID: {pickup_info.get('id')}")
            print(f"   Status: {pickup_info.get('status')}")
        else:
            print(f"❌ Pickup request creation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
    except Exception as e:
        print(f"❌ Pickup request error: {e}")
        return
    
    # Test 4: Get pickup requests
    print("\n4. Retrieving pickup requests...")
    try:
        response = requests.get(f"{BASE_URL}/pickup-requests", headers=headers)
        if response.status_code == 200:
            requests_list = response.json()
            print(f"✅ Retrieved {len(requests_list)} pickup requests")
            for req in requests_list:
                print(f"   - ID: {req.get('id')}, Status: {req.get('status')}, Date: {req.get('pickup_date')}")
        else:
            print(f"❌ Failed to retrieve pickup requests: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Get pickup requests error: {e}")
    
    print("\n🎉 Pickup request functionality test completed!")

if __name__ == "__main__":
    test_pickup_requests()
