#!/bin/bash

# ABC Admin Development Startup Script
echo "🚀 Starting ABC Admin Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}   Attempt $attempt/$max_attempts - waiting for $service_name...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start within expected time${NC}"
    return 1
}

# Check if required ports are available
echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port 5432 || echo -e "${YELLOW}   PostgreSQL port (5432) - will use Docker${NC}"
check_port 8080 || { echo -e "${RED}   Backend port (8080) is in use. Please stop the service using this port.${NC}"; exit 1; }
check_port 3000 || { echo -e "${RED}   Frontend port (3000) is in use. Please stop the service using this port.${NC}"; exit 1; }

# Step 1: Start PostgreSQL Database
echo -e "\n${BLUE}🐘 Starting PostgreSQL Database...${NC}"
docker-compose -f docker-compose.local.postgres.yml up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Verify database connection
if docker-compose -f docker-compose.local.postgres.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
    exit 1
fi

# Step 2: Start NestJS API Backend
echo -e "\n${BLUE}🖥️  Starting NestJS API Backend...${NC}"
npx nx serve api &
API_PID=$!

# Step 3: Wait a bit for API to start, then start Next.js Frontend
echo -e "\n${BLUE}⚛️  Starting Next.js Frontend...${NC}"
sleep 10
npx nx serve web &
WEB_PID=$!

# Wait for services to be ready
sleep 15
wait_for_service "http://localhost:8080/health" "Backend API" &
wait_for_service "http://localhost:3000" "Frontend Web App" &
wait

echo -e "\n${GREEN}🎉 ABC Admin Development Environment is ready!${NC}"
echo -e "${GREEN}   📊 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}   🔧 Backend API: http://localhost:8080${NC}"
echo -e "${GREEN}   🐘 PostgreSQL: localhost:5432${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    
    # Kill background processes
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend API stopped${NC}"
    fi
    
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    
    # Stop Docker services
    docker-compose -f docker-compose.local.postgres.yml down
    echo -e "${GREEN}✅ PostgreSQL stopped${NC}"
    
    echo -e "${GREEN}🏁 All services stopped successfully${NC}"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
wait 