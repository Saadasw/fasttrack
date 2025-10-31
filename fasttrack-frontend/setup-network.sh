#!/bin/bash
# 🚀 FastTrack Frontend Network Setup Script

echo "🌐 FastTrack Frontend Network Access Setup"
echo "=========================================="

# Get current IP address
CURRENT_IP=$(ipconfig | grep "IPv4 Address" | head -1 | cut -d: -f2 | sed 's/^ *//' | sed 's/ *$//')

if [ -z "$CURRENT_IP" ]; then
    echo "❌ Could not detect IP address. Please check your network connection."
    exit 1
fi

echo "📍 Detected IP Address: $CURRENT_IP"

# Update .env.local with current IP
echo "🔧 Updating .env.local with current IP address..."
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yuomspmrlzwbgaoeeomc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b21zcG1ybHp3Ymdhb2Vlb21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzQ5MzgsImV4cCI6MjA3MTgxMDkzOH0._OBPBbBVyvD_Oi3JRF_5Dgh4I62SXiJl_LOk5mGrZwc

# API Configuration - Auto-detected IP
NEXT_PUBLIC_API_URL=http://$CURRENT_IP:8000
EOF

echo "✅ Environment file updated!"

# Check if backend is running
echo "🔍 Testing backend connection on port 8000..."
if curl -f -s "http://$CURRENT_IP:8000/health" > /dev/null; then
    echo "✅ Backend is running and accessible!"
else
    echo "⚠️  Backend not accessible. Make sure it's running on port 8000."
    echo "   You can start the backend with: python -m uvicorn main:app --host 0.0.0.0 --port 8000"
fi

echo ""
echo "🚀 Starting frontend with network access..."
echo "   Frontend will be accessible at:"
echo "   - Local: http://localhost:3000"
echo "   - Network: http://$CURRENT_IP:3000"
echo ""
echo "📱 Other devices on your network can access:"
echo "   http://$CURRENT_IP:3000"
echo ""

# Start the development server
npm run dev:network
