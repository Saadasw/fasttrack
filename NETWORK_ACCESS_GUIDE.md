# 🌐 Network Access Guide

## ✅ Current Status
- **Backend**: ✅ Running and accessible at `http://192.168.31.124:8000`
- **Frontend**: ✅ Should be accessible at `http://192.168.31.124:3000`
- **API Configuration**: ✅ Updated to use network IP

## 🔧 Troubleshooting Steps

### Step 1: Verify Backend Access
From another machine, test if the backend is accessible:
```
http://192.168.31.124:8000/health
```
**Expected Response**: `{"status":"healthy","timestamp":"..."}`

### Step 2: Verify Frontend Access
From another machine, test if the frontend is accessible:
```
http://192.168.31.124:3000
```
**Expected Response**: The login page should load

### Step 3: Check Windows Firewall (if Step 1 fails)

#### Option A: Allow Python through Firewall
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Find "Python" in the list
4. Make sure both "Private" and "Public" are checked
5. If Python is not in the list, click "Change settings" → "Allow another app" → Browse to your Python executable

#### Option B: Create Specific Rule for Port 8000
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" → Specific local ports: 8000 → Next
6. Select "Allow the connection" → Next
7. Check all profiles (Domain, Private, Public) → Next
8. Name: "FastTrack Backend" → Finish

### Step 4: Check Network Configuration

#### Verify IP Address
Run this command on the host machine:
```powershell
ipconfig
```
Look for your network adapter and confirm the IP is `192.168.31.124`

#### Test from Another Machine
From another machine on the same network:
```bash
# Test backend
curl http://192.168.31.124:8000/health

# Test frontend (if using curl)
curl http://192.168.31.124:3000
```

### Step 5: Frontend Configuration

The frontend is already configured to use the network IP. If you need to change it:

1. Edit `fasttrack-frontend/lib/api.ts`
2. Change line 9 from:
   ```typescript
   constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.31.124:8000') {
   ```
   To your actual IP address if different.

## 🚨 Common Issues & Solutions

### Issue: "Connection Refused"
**Solution**: Backend not running or firewall blocking
- Start backend: `cd backend && python start.py`
- Check firewall settings (Step 3)

### Issue: "This site can't be reached"
**Solution**: Wrong IP address or network issue
- Verify IP address with `ipconfig`
- Ensure both machines are on same network
- Try pinging: `ping 192.168.31.124`

### Issue: Frontend loads but login fails
**Solution**: API configuration issue
- Check browser developer tools (F12) → Network tab
- Look for failed API calls
- Verify API URL in `fasttrack-frontend/lib/api.ts`

### Issue: CORS errors
**Solution**: Backend CORS is already configured to allow all origins
- Check if backend is running
- Verify backend URL in frontend

## 📱 Mobile/Tablet Access

To access from mobile devices on the same network:
1. Find your computer's IP address: `ipconfig`
2. Access: `http://[YOUR_IP]:3000`
3. Make sure mobile device is on same WiFi network

## 🔒 Security Note

This configuration is for development only. For production:
- Use proper authentication
- Configure specific CORS origins
- Use HTTPS
- Set up proper firewall rules

## 📞 Quick Test Commands

```bash
# Test backend health
curl http://192.168.31.124:8000/health

# Test login (replace with real credentials)
curl -X POST http://192.168.31.124:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

# Test frontend
curl http://192.168.31.124:3000
```

## 🎯 Expected Results

- **Backend Health**: `{"status":"healthy","timestamp":"..."}`
- **Login Response**: `{"access_token":"eyJ..."}`
- **Frontend**: Login page loads successfully
- **Cross-machine**: All functionality works from other devices
