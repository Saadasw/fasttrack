#!/usr/bin/env python3
"""
Simple test for pickup request creation
"""

import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

async def test_pickup_creation():
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
    
    print(f"Testing Supabase connection...")
    print(f"URL: {SUPABASE_URL}")
    if SUPABASE_ANON_KEY:
        print(f"Key: {SUPABASE_ANON_KEY[:20]}...")
    else:
        print("Key: None")
    
    # Test data
    pickup_data = {
        "merchant_id": "073145ab-1351-4fec-b121-7db0dd4bb7f1",  # Test user ID
        "pickup_address": "123 Test Street, Test City",
        "pickup_date": "2025-09-05",
        "pickup_time_slot": "09:00 - 12:00",
        "package_count": 1,
        "special_instructions": "Test pickup",
        "status": "pending"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/pickup_requests"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"\nSending POST request to: {url}")
            print(f"Data: {pickup_data}")
            
            response = await client.post(url, headers=headers, json=pickup_data)
            
            print(f"\nResponse Status: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            print(f"Response Text: {response.text}")
            
            if response.status_code == 201:
                print("✅ Pickup request created successfully!")
                if response.text:
                    result = response.json()
                    print(f"Created record: {result}")
            else:
                print(f"❌ Failed with status {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_pickup_creation())
