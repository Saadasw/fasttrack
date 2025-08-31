@echo off
echo 🚀 Starting FastTrack Courier API...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Start the server
echo 🚀 Starting FastAPI server...
echo 📍 API will be available at: http://localhost:8000
echo 📚 Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python start.py

pause
