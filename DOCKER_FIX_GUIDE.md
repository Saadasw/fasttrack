# Docker Add Parcel Fix Guide

## Problem
The "Add Parcel" feature wasn't working because the frontend was hardcoded to use a specific IP address that only works on one network.

## What Was Fixed

### 1. Hardcoded IP Addresses Removed
- **File**: `fasttrack-frontend/components/parcel/parcel-create-form.tsx`
  - Changed from hardcoded `http://192.168.31.124:8000` to use environment variable
  
- **File**: `fasttrack-frontend/lib/api.ts`
  - Changed default from `http://192.168.31.78:8000` to `http://localhost:8000`

### 2. Docker Compose Configuration Updated
- **File**: `docker-compose.yml`
  - Changed `NEXT_PUBLIC_API_URL` from `http://backend:8000` to `http://localhost:8000`
  - This allows the browser to connect to the backend properly

## How to Use

### For Docker Deployment:

1. **Stop existing containers:**
   ```bash
   docker-compose down
   ```

2. **Rebuild the frontend (required after code changes):**
   ```bash
   docker-compose build frontend
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Chatbot: http://localhost:8010

### For Different Networks:

If you're on a different network and need to access from other devices:

1. **Find your machine's IP address:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Linux/Mac: `ifconfig` or `ip addr`

2. **Update the `.env` file in the root directory:**
   ```env
   NEXT_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:8000
   NEXT_PUBLIC_CHATBOT_URL=http://YOUR_IP_ADDRESS:8010
   ```

3. **Rebuild and restart:**
   ```bash
   docker-compose down
   docker-compose build frontend
   docker-compose up -d
   ```

## Testing the Fix

1. Open http://localhost:3000
2. Login as a merchant
3. Go to "Add Parcel" or "Create Parcel"
4. Fill in the form and submit
5. You should see a success message and the parcel should appear in your list

## Troubleshooting

### If "Add Parcel" still doesn't work:

1. **Check browser console** (F12 → Console tab):
   - Look for network errors
   - Check what URL it's trying to connect to

2. **Verify backend is running:**
   ```bash
   docker ps
   ```
   All three containers should show "Up" status

3. **Check backend logs:**
   ```bash
   docker logs fasttrack_backend
   ```

4. **Test backend directly:**
   Open http://localhost:8000/health in your browser
   Should return: `{"status":"healthy","timestamp":"..."}`

5. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload the page

### If accessing from another device on the network:

1. Make sure your firewall allows connections on ports 3000, 8000, and 8010
2. Use your machine's IP address instead of localhost
3. Update the `.env` file as described above

## Summary

The issue was that the frontend code had hardcoded IP addresses that only worked on one specific network. Now it uses environment variables that can be configured for any network, and defaults to `localhost` which works for Docker deployments.
