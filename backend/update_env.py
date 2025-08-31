#!/usr/bin/env python3
"""
Environment Variables Update Helper
This script helps update the backend to use the correct Supabase project
"""

import os
from dotenv import load_dotenv

def show_current_env():
    """Show current environment variables"""
    load_dotenv()
    
    print("🔍 Current Environment Variables")
    print("=" * 50)
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    print(f"SUPABASE_URL: {supabase_url}")
    print(f"SUPABASE_ANON_KEY: {supabase_key[:20] if supabase_key else 'None'}...")
    
    if supabase_url and "yuomspmrlzwbgaoeeomc" in supabase_url:
        print("✅ This matches your dashboard project!")
    elif supabase_url and "cxpplkqmjutdcelainet" in supabase_url:
        print("❌ This is a different project than your dashboard!")
        print("   Your dashboard shows: yuomspmrlzwbgaoeeomc")
        print("   Backend is using: cxpplkqmjutdcelainet")
    else:
        print("❓ Unknown project URL")

def create_new_env_template():
    """Create a template for the correct project"""
    print("\n🔧 Environment Variables Template")
    print("=" * 50)
    print("Update your backend/.env file with these values:")
    print("-" * 50)
    print("SUPABASE_URL=https://yuomspmrlzwbgaoeeomc.supabase.co")
    print("SUPABASE_ANON_KEY=YOUR_ANON_KEY_FROM_DASHBOARD")
    print("SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_FROM_DASHBOARD")
    print("SUPABASE_JWT_SECRET=YOUR_JWT_SECRET_FROM_DASHBOARD")
    print("-" * 50)
    print("\n📋 Steps to get these values:")
    print("1. Go to your Supabase Dashboard")
    print("2. Click 'Settings' (gear icon) in left sidebar")
    print("3. Click 'API'")
    print("4. Copy the values from there")

def main():
    """Main function"""
    print("🚀 FastTrack Environment Variables Helper")
    print("=" * 50)
    
    show_current_env()
    create_new_env_template()
    
    print("\n🎯 NEXT STEPS:")
    print("1. Update backend/.env with correct project credentials")
    print("2. Run the SQL setup script in yuomspmrlzwbgaoeeomc project")
    print("3. Test the connection again")

if __name__ == "__main__":
    main()
