#!/usr/bin/env python3
"""
Simple Connection Test - Fresh Script
"""
import os
import httpx
import asyncio
from dotenv import load_dotenv

# Force reload environment variables
load_dotenv(override=True)

async def test_connection():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    print("🔍 Simple Connection Test")
    print("=" * 50)
    print(f"URL: {supabase_url}")
    print(f"Key: {supabase_key[:20] if supabase_key else 'None'}...")
    print("-" * 50)
    
    if not supabase_url or not supabase_key:
        print("❌ Environment variables not loaded!")
        return
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Test basic connection
            print("1️⃣ Testing basic connection...")
            response = await client.get(f"{supabase_url}/rest/v1/", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Supabase REST API accessible")
            else:
                print(f"   ❌ Error: {response.text}")
                return
            
            # Test profiles table
            print("\n2️⃣ Testing profiles table...")
            response = await client.get(f"{supabase_url}/rest/v1/profiles", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Profiles table exists!")
                data = response.json()
                print(f"   📊 Records: {len(data)}")
            elif response.status_code == 404:
                print("   ❌ Profiles table not found (404)")
                print("   💡 You need to run the SQL setup script!")
            else:
                print(f"   ❌ Error: {response.text}")
            
            print("\n" + "=" * 50)
            print("🎯 Test Complete!")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")

def main():
    print("🚀 FastTrack Simple Connection Test")
    print("=" * 50)
    asyncio.run(test_connection())

if __name__ == "__main__":
    main()
