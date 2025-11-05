#!/bin/bash

# FastTrack Docker Stop Script
# This script stops all Docker containers

echo "🛑 FastTrack Docker Stop"
echo "========================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Select an option:"
echo "  1) Stop containers (keep data)"
echo "  2) Stop and remove containers (keep images)"
echo "  3) Complete cleanup (remove everything)"
echo ""
read -p "Enter your choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "Stopping containers..."
        docker-compose stop
        echo -e "${GREEN}✓ Containers stopped${NC}"
        echo ""
        echo "To start again, run: docker-compose start"
        ;;
    2)
        echo ""
        echo "Stopping and removing containers..."
        docker-compose down
        echo -e "${GREEN}✓ Containers stopped and removed${NC}"
        echo ""
        echo "To start again, run: docker-compose up -d"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}⚠ This will remove all containers, images, and volumes${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "Stopping and removing everything..."
            docker-compose down -v --rmi all
            echo -e "${GREEN}✓ Complete cleanup done${NC}"
            echo ""
            echo "To start again, run: ./docker-start.sh"
        else
            echo "Cancelled."
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Current Docker status:"
docker-compose ps

