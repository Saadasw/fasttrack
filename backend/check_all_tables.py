#!/usr/bin/env python3
"""
Comprehensive Database Table Checker
This script checks ALL available tables and schemas in Supabase
"""

import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def check_all_tables():
    """Check all available tables and schemas"""
    
    # Get environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Environment variables not loaded!")
        return
    
    print("🔍 Comprehensive Database Table Check")
    print("=" * 60)
    print(f"URL: {supabase_url}")
    print(f"Key: {supabase_key[:20]}...")
    print("-" * 60)
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Test 1: Check what's available at root
            print("1️⃣ Checking root REST API...")
            response = await client.get(f"{supabase_url}/rest/v1/", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Root accessible")
                # Try to see what endpoints are available
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"   📋 Available endpoints: {len(data)}")
                        for item in data[:5]:  # Show first 5
                            print(f"      - {item}")
                        if len(data) > 5:
                            print(f"      ... and {len(data) - 5} more")
                    else:
                        print(f"   📋 Response type: {type(data)}")
                        print(f"   📋 Content: {str(data)[:100]}...")
                except:
                    print("   📋 Could not parse response as JSON")
            else:
                print(f"   ❌ Root error: {response.text}")
                return
            
            # Test 2: Check common table names
            print("\n2️⃣ Checking common table names...")
            common_tables = [
                "profiles", "users", "user_profiles", "accounts",
                "parcels", "packages", "shipments",
                "pickup_requests", "pickups", "requests",
                "couriers", "drivers", "delivery_people",
                "hubs", "warehouses", "locations",
                "payments", "transactions",
                "tracking", "tracking_updates", "status_updates"
            ]
            
            found_tables = []
            for table in common_tables:
                response = await client.get(f"{supabase_url}/rest/v1/{table}", headers=headers)
                if response.status_code == 200:
                    found_tables.append(table)
                    print(f"   ✅ {table} - exists")
                else:
                    print(f"   ❌ {table} - not found")
            
            # Test 3: Check if any tables exist by trying system tables
            print("\n3️⃣ Checking system information...")
            try:
                # Try to get table list from information_schema
                response = await client.get(
                    f"{supabase_url}/rest/v1/rpc/get_tables", 
                    headers=headers
                )
                if response.status_code == 200:
                    print("   ✅ get_tables function available")
                    data = response.json()
                    print(f"   📋 Tables found: {data}")
                else:
                    print(f"   ❌ get_tables function not available: {response.status_code}")
            except:
                print("   ❌ get_tables function failed")
            
            # Test 4: Try to create a simple test table
            print("\n4️⃣ Testing table creation capability...")
            test_table_name = "test_table_123"
            test_data = {
                "id": 1,
                "name": "test",
                "created_at": "2024-01-01T00:00:00Z"
            }
            
            # Try to create a test record (this will fail if table doesn't exist)
            response = await client.post(
                f"{supabase_url}/rest/v1/{test_table_name}",
                headers=headers,
                json=test_data
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 201:
                print("   ✅ Test table creation successful!")
                # Clean up
                await client.delete(f"{supabase_url}/rest/v1/{test_table_name}?id=eq.1", headers=headers)
                print("   🧹 Test table cleaned up")
            else:
                print(f"   ❌ Test table creation failed: {response.text}")
            
            # Test 5: Summary
            print("\n" + "=" * 60)
            print("🎯 COMPREHENSIVE CHECK COMPLETE")
            print("=" * 60)
            
            if found_tables:
                print(f"✅ Found {len(found_tables)} tables:")
                for table in found_tables:
                    print(f"   - {table}")
            else:
                print("❌ NO TABLES FOUND!")
                print("   This means the SQL setup script was not executed properly.")
                print("   You need to run the supabase_setup.sql script in Supabase SQL Editor.")
            
            print("\n🔧 NEXT STEPS:")
            if not found_tables:
                print("   1. Go to Supabase Dashboard")
                print("   2. Click 'SQL Editor' (left sidebar)")
                print("   3. Copy the ENTIRE content from backend/supabase_setup.sql")
                print("   4. Paste and click 'Run'")
                print("   5. Run this test again")
            else:
                print("   ✅ Database is partially set up")
                print("   🔍 Check which specific tables you need")
            
        except Exception as e:
            print(f"❌ Connection error: {str(e)}")

def main():
    """Main function"""
    print("🚀 FastTrack Comprehensive Database Check")
    print("=" * 60)
    
    # Run the async check
    asyncio.run(check_all_tables())

if __name__ == "__main__":
    main()
