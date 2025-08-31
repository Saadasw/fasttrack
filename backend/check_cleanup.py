#!/usr/bin/env python3
"""
Check if cleanup was successful
"""

import os
import httpx
import asyncio
from dotenv import load_dotenv

# Force reload environment variables
load_dotenv(override=True)

async def check_cleanup():
    """Check if all tables are removed"""
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    print("🧹 Checking Cleanup Status")
    print("=" * 50)
    print(f"URL: {supabase_url}")
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Test basic connection
            response = await client.get(f"{supabase_url}/rest/v1/", headers=headers)
            print(f"✅ Connection: {response.status_code}")
            
            # Check if profiles table exists (should return 404 if deleted)
            print("\n🔍 Checking if profiles table exists...")
            response = await client.get(f"{supabase_url}/rest/v1/profiles", headers=headers)
            if response.status_code == 404:
                print("✅ Profiles table: DELETED (404)")
            else:
                print(f"❌ Profiles table: STILL EXISTS ({response.status_code})")
                print(f"   Response: {response.text}")
            
            # Check if parcels table exists
            print("\n🔍 Checking if parcels table exists...")
            response = await client.get(f"{supabase_url}/rest/v1/parcels", headers=headers)
            if response.status_code == 404:
                print("✅ Parcels table: DELETED (404)")
            else:
                print(f"❌ Parcels table: STILL EXISTS ({response.status_code})")
                print(f"   Response: {response.text}")
            
            # Check if pickup_requests table exists
            print("\n🔍 Checking if pickup_requests table exists...")
            response = await client.get(f"{supabase_url}/rest/v1/pickup_requests", headers=headers)
            if response.status_code == 404:
                print("✅ Pickup requests table: DELETED (404)")
            else:
                print(f"❌ Pickup requests table: STILL EXISTS ({response.status_code})")
                print(f"   Response: {response.text}")
            
            print("\n" + "=" * 50)
            print("🎯 Cleanup Check Complete!")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")

def main():
    """Main function"""
    print("🚀 FastTrack Cleanup Verification")
    print("=" * 50)
    
    asyncio.run(check_cleanup())

if __name__ == "__main__":
    main()
