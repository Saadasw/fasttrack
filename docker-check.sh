#!/bin/bash

# FastTrack Docker Setup Validation Script
# This script checks if all necessary files are in place before running docker-compose

echo "🔍 FastTrack Docker Setup Validation"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found directory: $1"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Missing directory: $1 (will be created)"
        return 1
    fi
}

# Check Docker installation
echo "Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is installed: $(docker --version)"
else
    echo -e "${RED}✗${NC} Docker is NOT installed. Please install Docker Desktop."
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is installed: $(docker-compose --version)"
else
    echo -e "${RED}✗${NC} Docker Compose is NOT installed."
    exit 1
fi

echo ""
echo "Checking Dockerfiles..."
check_file "backend/Dockerfile"
check_file "chat_bot_backend/fasttrack_agent/Dockerfile"
check_file "fasttrack-frontend/Dockerfile"
check_file "docker-compose.yml"

echo ""
echo "Checking .dockerignore files..."
check_file "backend/.dockerignore"
check_file "chat_bot_backend/fasttrack_agent/.dockerignore"
check_file "fasttrack-frontend/.dockerignore"

echo ""
echo "Checking environment files..."
ENV_ERRORS=0

if ! check_file "backend/.env"; then
    ENV_ERRORS=$((ENV_ERRORS + 1))
    echo -e "${YELLOW}  → Copy from backend/env.txt and update with your credentials${NC}"
fi

# For chatbot, just show a warning if .env is missing (may not be used)
if [ ! -f "chat_bot_backend/fasttrack_agent/.env" ]; then
    echo -e "${YELLOW}⚠${NC} Optional: chat_bot_backend/fasttrack_agent/.env"
    echo -e "${YELLOW}  → Create this if using the AI chatbot${NC}"
fi

echo ""
echo "Checking application directories..."
check_dir "backend/venv"
check_dir "fasttrack-frontend/node_modules"
check_dir "chat_bot_backend/fasttrack_agent/vector_store"
check_dir "chat_bot_backend/fasttrack_agent/kb"
check_dir "chat_bot_backend/fasttrack_agent/uploads"

echo ""
echo "Checking required ports..."
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠${NC} Port $1 is already in use"
        echo "   Process using it: $(lsof -i :$1 | tail -n 1 | awk '{print $1}')"
        return 1
    else
        echo -e "${GREEN}✓${NC} Port $1 is available"
        return 0
    fi
}

check_port 3000
check_port 8000
check_port 8010

echo ""
echo "======================================"

if [ $ENV_ERRORS -gt 0 ]; then
    echo -e "${RED}⚠ Missing environment files!${NC}"
    echo ""
    echo "Please create the following files with your credentials:"
    echo "  1. backend/.env (copy from backend/env.txt)"
    echo ""
    echo "Example for backend/.env:"
    echo "---"
    echo "SUPABASE_URL=https://your-project.supabase.co"
    echo "SUPABASE_ANON_KEY=your_key"
    echo "SUPABASE_SERVICE_KEY=your_key"
    echo "SUPABASE_JWT_SECRET=your_secret"
    echo "SECRET_KEY=your-secret-key"
    echo "---"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "You can now run:"
echo "  docker-compose up --build -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To access services:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend:  http://localhost:8000/docs"
echo "  • Chatbot:  http://localhost:8010"

