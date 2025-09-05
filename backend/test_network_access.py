#!/usr/bin/env python3
"""
Test script to verify network access from other machines
"""

import requests
import json
from datetime import datetime

def test_network_access():
    """Test if the backend is accessible from the network"""
    
    # Test URLs
    local_url = "http://localhost:8000"
    network_url = "http://192.168.31.124:8000"
    
    print("🔍 Testing Network Access...")
    print(f"⏰ Time: {datetime.now()}")
    print(f"🌐 Network IP: 192.168.31.124")
    print(f"🔌 Port: 8000")
    print("-" * 50)
    
    # Test local access
    try:
        response = requests.get(f"{local_url}/health", timeout=5)
        print(f"✅ Local access (localhost:8000): {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Local access failed: {e}")
    
    # Test network access
    try:
        response = requests.get(f"{network_url}/health", timeout=5)
        print(f"✅ Network access (192.168.31.124:8000): {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Network access failed: {e}")
    
    # Test login endpoint
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpass"
        }
        response = requests.post(f"{network_url}/auth/login", 
                               json=login_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=5)
        print(f"✅ Login endpoint test: {response.status_code}")
        if response.status_code == 200:
            print(f"   Token received: {len(response.json().get('access_token', ''))} characters")
    except Exception as e:
        print(f"❌ Login endpoint failed: {e}")
    
    print("-" * 50)
    print("📋 Instructions for other machines:")
    print("1. Make sure both machines are on the same network")
    print("2. Try accessing: http://192.168.31.124:8000/health")
    print("3. If that works, try: http://192.168.31.124:3000")
    print("4. Check Windows Firewall if access fails")

if __name__ == "__main__":
    test_network_access()
