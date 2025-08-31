#!/usr/bin/env python3
"""
Simple Database Connection Test
This script connects to Supabase and checks which tables exist
"""

import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_supabase_connection():
    """Test Supabase connection and list available tables"""
    
    # Get environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Environment variables not loaded!")
        print(f"SUPABASE_URL: {supabase_url}")
        print(f"SUPABASE_ANON_KEY: {supabase_key[:20] if supabase_key else 'None'}...")
        return
    
    print("🔗 Testing Supabase Connection...")
    print(f"URL: {supabase_url}")
    print(f"Key: {supabase_key[:20]}...")
    print("-" * 50)
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Test 1: Basic connection
            print("1️⃣ Testing basic connection...")
            response = await client.get(f"{supabase_url}/rest/v1/", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Supabase REST API accessible")
            else:
                print(f"   ❌ Error: {response.text}")
                return
            
            # Test 2: Check if profiles table exists
            print("\n2️⃣ Checking profiles table...")
            response = await client.get(f"{supabase_url}/rest/v1/profiles", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Profiles table exists and accessible")
                data = response.json()
                print(f"   📊 Records found: {len(data)}")
            else:
                print(f"   ❌ Profiles table error: {response.text}")
            
            # Test 3: Check if parcels table exists
            print("\n3️⃣ Checking parcels table...")
            response = await client.get(f"{supabase_url}/rest/v1/parcels", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Parcels table exists and accessible")
                data = response.json()
                print(f"   📊 Records found: {len(data)}")
            else:
                print(f"   ❌ Parcels table error: {response.text}")
            
            # Test 4: Check if pickup_requests table exists
            print("\n4️⃣ Checking pickup_requests table...")
            response = await client.get(f"{supabase_url}/rest/v1/pickup_requests", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Pickup requests table exists and accessible")
                data = response.json()
                print(f"   📊 Records found: {len(data)}")
            else:
                print(f"   ❌ Pickup requests table error: {response.text}")
            
            # Test 5: Try to create a test profile
            print("\n5️⃣ Testing profile creation...")
            test_data = {
                "email": "test@example.com",
                "business_name": "Test Company",
                "full_name": "Test User",
                "role": "merchant",
                "status": "active"
            }
            
            response = await client.post(
                f"{supabase_url}/rest/v1/profiles",
                headers=headers,
                json=test_data
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 201:
                print("   ✅ Profile creation successful!")
                created_profile = response.json()
                print(f"   📝 Created profile ID: {created_profile.get('id', 'Unknown')}")
                
                # Clean up - delete the test profile
                print("   🧹 Cleaning up test profile...")
                profile_id = created_profile.get('id')
                if profile_id:
                    delete_response = await client.delete(
                        f"{supabase_url}/rest/v1/profiles?id=eq.{profile_id}",
                        headers=headers
                    )
                    if delete_response.status_code == 204:
                        print("   ✅ Test profile cleaned up")
                    else:
                        print(f"   ⚠️ Cleanup failed: {delete_response.status_code}")
            else:
                print(f"   ❌ Profile creation failed: {response.text}")
            
            print("\n" + "=" * 50)
            print("🎯 Database Connection Test Complete!")
            
        except Exception as e:
            print(f"❌ Connection error: {str(e)}")

def main():
    """Main function"""
    print("🚀 FastTrack Database Connection Test")
    print("=" * 50)
    
    # Run the async test
    asyncio.run(test_supabase_connection())

if __name__ == "__main__":
    main()
