#!/usr/bin/env python3
"""
Debug Environment Variables Loading
"""
import os
from dotenv import load_dotenv

print("🔍 Environment Variables Debug")
print("=" * 50)

# Check before loading .env
print("1️⃣ BEFORE load_dotenv():")
print(f"   SUPABASE_URL: {os.getenv('SUPABASE_URL', 'NOT SET')}")
print(f"   SUPABASE_ANON_KEY: {os.getenv('SUPABASE_ANON_KEY', 'NOT SET')[:20] if os.getenv('SUPABASE_ANON_KEY') else 'NOT SET'}...")

# Load .env normally (like main.py does)
print("\n2️⃣ AFTER load_dotenv() (normal):")
load_dotenv()
print(f"   SUPABASE_URL: {os.getenv('SUPABASE_URL', 'NOT SET')}")
print(f"   SUPABASE_ANON_KEY: {os.getenv('SUPABASE_ANON_KEY', 'NOT SET')[:20] if os.getenv('SUPABASE_ANON_KEY') else 'NOT SET'}...")

# Load .env with override
print("\n3️⃣ AFTER load_dotenv(override=True):")
load_dotenv(override=True)
print(f"   SUPABASE_URL: {os.getenv('SUPABASE_URL', 'NOT SET')}")
print(f"   SUPABASE_ANON_KEY: {os.getenv('SUPABASE_ANON_KEY', 'NOT SET')[:20] if os.getenv('SUPABASE_ANON_KEY') else 'NOT SET'}...")

# Check current working directory
print(f"\n4️⃣ Current working directory: {os.getcwd()}")
print(f"   .env file exists: {os.path.exists('.env')}")

# Check if there are multiple .env files
env_files = [f for f in os.listdir('.') if f.endswith('.env')]
print(f"   .env files found: {env_files}")

print("\n" + "=" * 50)
print("�� Debug Complete!")
