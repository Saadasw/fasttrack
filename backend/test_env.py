#!/usr/bin/env python3
"""
Simple Environment Variables Test
"""

import os
from dotenv import load_dotenv

print("🔍 Testing Environment Variables Loading")
print("=" * 50)

# Force reload of .env file
load_dotenv(override=True)

# Check current directory
print(f"Current directory: {os.getcwd()}")
print(f".env file exists: {os.path.exists('.env')}")

# Load and display environment variables
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

print(f"\nSUPABASE_URL: {supabase_url}")
print(f"SUPABASE_ANON_KEY: {supabase_key[:20] if supabase_key else 'None'}...")

if supabase_url and "yuomspmrlzwbgaoeeomc" in supabase_url:
    print("✅ Correct project URL loaded!")
else:
    print("❌ Wrong project URL or not loaded")

print("\n🎯 Environment test complete!")
