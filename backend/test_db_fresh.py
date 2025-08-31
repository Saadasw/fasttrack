#!/usr/bin/env python3
"""
Fresh Database Connection Test
This script tests the connection to the correct Supabase project
"""

import os
import httpx
import asyncio
from dotenv import load_dotenv

# Force reload environment variables
load_dotenv(override=True)

async def test_supabase_connection():
    """Test Supabase connection to the correct project"""
    
    # Get environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    print("🔍 Fresh Database Connection Test")
    print("=" * 60)
    print(f"URL: {supabase_url}")
    print(f"Key: {supabase_key[:20] if supabase_key else 'None'}...")
    print("-" * 60)
    
    if not supabase_url or not supabase_key:
        print("❌ Environment variables not loaded!")
        return
    
    if "yuomspmrlzwbgaoeeomc" not in supabase_url:
        print("❌ Wrong project URL! Expected yuomspmrlzwbgaoeeomc")
        return
    
    print("✅ Correct project URL detected!")
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Test 1: Basic connection
            print("\n1️⃣ Testing basic connection...")
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
            
            print("\n" + "=" * 60)
            print("🎯 Fresh Database Test Complete!")
            
        except Exception as e:
            print(f"❌ Connection error: {str(e)}")

def main():
    """Main function"""
    print("🚀 FastTrack Fresh Database Test")
    print("=" * 60)
    
    # Run the async test
    asyncio.run(test_supabase_connection())

if __name__ == "__main__":
    main()
