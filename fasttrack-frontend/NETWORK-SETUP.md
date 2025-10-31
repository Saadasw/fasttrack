# 🔧 FastTrack Frontend Network Access - Troubleshooting Guide

## ✅ What We've Fixed

### 1. Environment Configuration

- ✅ Created `.env.local` with proper environment variables
- ✅ Updated API URL to use current machine IP: `192.168.31.78:8000`
- ✅ Configured Supabase connection

### 2. API Client Improvements

- ✅ Enhanced error handling with timeout (10 seconds)
- ✅ Better error messages for network issues
- ✅ Detailed logging for debugging

### 3. Network Test Components

- ✅ Created `NetworkTest.tsx` component for connection testing
- ✅ Added `ErrorBoundary.tsx` for graceful error handling
- ✅ Updated test-api page with comprehensive testing tools

### 4. Next.js Configuration

- ✅ Updated `next.config.mjs` for network access
- ✅ Added API proxy rewrite rules
- ✅ Fixed configuration warnings

### 5. Package.json Scripts

- ✅ Added `dev:network` script with `-H 0.0.0.0` flag
- ✅ Updated all scripts for network binding

### 6. Setup Scripts

- ✅ Created `setup-network.bat` for Windows
- ✅ Created `setup-network.sh` for Unix systems

## 🌐 Current Network Status

- **Frontend IP**: `192.168.31.78`
- **Frontend URL**: `http://192.168.31.78:3000`
- **Expected Backend URL**: `http://192.168.31.78:8000`
- **Network**: `192.168.31.0/24`

## 🚀 How to Start

### Option 1: Manual Start

```bash
npm run dev:network
```

### Option 2: Auto-Setup (Recommended)

```bash
# Windows
setup-network.bat

# Unix/Linux/MacOS
chmod +x setup-network.sh
./setup-network.sh
```

## 🔍 Verification Steps

### 1. Check Frontend Access

- **Local**: http://localhost:3000
- **Network**: http://192.168.31.78:3000
- **Test Page**: http://192.168.31.78:3000/test-api

### 2. Test API Connection

1. Go to http://192.168.31.78:3000/test-api
2. Click "Test API Connection" in the Network Test component
3. Check browser console for detailed logs

### 3. Test from Another Device

- Connect phone/tablet to same Wi-Fi network
- Open browser and go to http://192.168.31.78:3000
- Should see the FastTrack homepage

## ❌ If Still Not Working

### Backend Issues

```bash
# Check if backend is running
curl http://192.168.31.78:8000/health

# If not running, start backend with:
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Firewall Issues

```powershell
# Windows: Allow Node.js through firewall
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe"

# Or disable Windows Firewall temporarily for testing
```

### IP Address Changes

```bash
# If IP changes, update .env.local:
ipconfig  # Get new IP
# Update NEXT_PUBLIC_API_URL in .env.local
# Restart dev server
```

### Network Connectivity

```bash
# Test network connectivity
ping 192.168.31.78
telnet 192.168.31.78 3000
```

## 🛠️ Advanced Troubleshooting

### Check Environment Variables

Open browser console and run:

```javascript
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
```

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to use the app
4. Look for failed API requests (red entries)

### Test API Directly

```bash
# Test API endpoints directly
curl http://192.168.31.78:8000/
curl http://192.168.31.78:8000/health
curl http://192.168.31.78:8000/docs
```

## 🔗 Useful URLs

- **Frontend**: http://192.168.31.78:3000
- **API Test Page**: http://192.168.31.78:3000/test-api
- **Backend (if running)**: http://192.168.31.78:8000
- **Backend Docs**: http://192.168.31.78:8000/docs
- **Backend Health**: http://192.168.31.78:8000/health

## 📝 Next Steps

1. **Start Backend**: Ensure your FastAPI backend is running on port 8000
2. **Test Connection**: Use the network test component to verify connectivity
3. **Check Firewall**: Ensure Windows Firewall allows Node.js and Python
4. **Test from Mobile**: Try accessing from phone/tablet on same network

## 🆘 Still Need Help?

Check these files for more details:

- `components/NetworkTest.tsx` - Connection testing component
- `components/ErrorBoundary.tsx` - Error handling
- `lib/api.ts` - API client configuration
- `.env.local` - Environment variables
