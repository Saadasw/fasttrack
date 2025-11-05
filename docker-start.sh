#!/bin/bash

# FastTrack Docker Quick Start Script
# This script builds and starts all Docker containers

echo "🚀 FastTrack Docker Quick Start"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Run validation first
echo -e "${BLUE}Step 1: Running validation checks...${NC}"
./docker-check.sh

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠ Validation failed. Please fix the issues above.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Building Docker images...${NC}"
echo "This may take a few minutes on first run..."
docker-compose build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed. Check the errors above."
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Starting containers...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to start containers."
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All containers started successfully!${NC}"
echo ""
echo "Waiting for services to be ready..."
sleep 5

echo ""
echo "======================================"
echo -e "${GREEN}🎉 FastTrack is now running!${NC}"
echo "======================================"
echo ""
echo "Access your application:"
echo -e "  ${BLUE}Frontend:${NC}  http://localhost:3000"
echo -e "  ${BLUE}Backend:${NC}   http://localhost:8000/docs"
echo -e "  ${BLUE}Chatbot:${NC}   http://localhost:8010"
echo ""
echo "Useful commands:"
echo "  • View logs:    docker-compose logs -f"
echo "  • Stop:         docker-compose down"
echo "  • Restart:      docker-compose restart"
echo "  • Check status: docker-compose ps"
echo ""
echo "To view real-time logs now, run:"
echo "  docker-compose logs -f"

