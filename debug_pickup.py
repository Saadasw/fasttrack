#!/usr/bin/env python3
"""
Debug script for pickup request functionality
"""

import requests
import json

# Backend URL
BASE_URL = "http://localhost:8000"

def debug_pickup():
    print("🔍 Debugging Pickup Request")
    print("=" * 40)
    
    # Login first
    login_data = {
        "email": "test@example.com",
        "password": "testpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            user_info = response.json()
            token = user_info.get("access_token")
            print(f"✅ Login successful, token: {token[:20]}...")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Test pickup request creation with minimal data
    pickup_data = {
        "pickup_address": "123 Test Street",
        "pickup_date": "2025-09-05"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"\n📤 Sending pickup request:")
    print(f"Data: {json.dumps(pickup_data, indent=2)}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.post(f"{BASE_URL}/pickup-requests", json=pickup_data, headers=headers)
        print(f"\n📥 Response:")
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Content: {response.text}")
        
        if response.status_code == 200:
            print("✅ Pickup request created successfully!")
        else:
            print("❌ Pickup request failed")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

if __name__ == "__main__":
    debug_pickup()
