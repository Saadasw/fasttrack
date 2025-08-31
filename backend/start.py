#!/usr/bin/env python3
"""
FastTrack Courier Service - FastAPI Backend
Startup script for development and production
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("ENVIRONMENT", "development") == "development"
    
    print("🚀 Starting FastTrack Courier API...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🔄 Reload: {reload}")
    print(f"🌐 Supabase URL: {os.getenv('SUPABASE_URL', 'Not configured')}")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
