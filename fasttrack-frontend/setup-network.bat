@echo off
echo 🌐 FastTrack Frontend Network Access Setup
echo ==========================================

:: Get current IP address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr "IPv4 Address" ^| findstr "192.168"') do (
    set "CURRENT_IP=%%i"
    goto :found
)

:found
:: Remove leading/trailing spaces
for /f "tokens=* delims= " %%a in ("%CURRENT_IP%") do set CURRENT_IP=%%a

if "%CURRENT_IP%"=="" (
    echo ❌ Could not detect IP address. Please check your network connection.
    pause
    exit /b 1
)

echo 📍 Detected IP Address: %CURRENT_IP%

:: Update .env.local with current IP
echo 🔧 Updating .env.local with current IP address...
(
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=https://yuomspmrlzwbgaoeeomc.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b21zcG1ybHp3Ymdhb2Vlb21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzQ5MzgsImV4cCI6MjA3MTgxMDkzOH0._OBPBbBVyvD_Oi3JRF_5Dgh4I62SXiJl_LOk5mGrZwc
echo.
echo # API Configuration - Auto-detected IP
echo NEXT_PUBLIC_API_URL=http://%CURRENT_IP%:8000
) > .env.local

echo ✅ Environment file updated!

:: Test backend connection
echo 🔍 Testing backend connection on port 8000...
curl -f -s "http://%CURRENT_IP%:8000/health" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend is running and accessible!
) else (
    echo ⚠️  Backend not accessible. Make sure it's running on port 8000.
    echo    You can start the backend with: python -m uvicorn main:app --host 0.0.0.0 --port 8000
)

echo.
echo 🚀 Starting frontend with network access...
echo    Frontend will be accessible at:
echo    - Local: http://localhost:3000
echo    - Network: http://%CURRENT_IP%:3000
echo.
echo 📱 Other devices on your network can access:
echo    http://%CURRENT_IP%:3000
echo.

:: Start the development server
npm run dev:network
