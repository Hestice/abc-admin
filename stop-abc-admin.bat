@echo off
title ABC Admin - Stopping Services...

echo.
echo ========================================
echo    🛑 ABC Admin - Stopping Services
echo ========================================
echo.

:: Change to script directory
cd /d "%~dp0"

:: Stop Frontend (Next.js on port 3000)
echo [1/4] Stopping Frontend...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo ✅ Frontend stopped

:: Stop Backend API (NestJS on port 8080)
echo [2/4] Stopping Backend API...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080"') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo ✅ Backend API stopped

:: Stop any remaining Node.js processes related to nx serve
echo [3/4] Stopping remaining Node.js processes...
taskkill /f /im node.exe /fi "WINDOWTITLE eq ABC-Frontend" >nul 2>&1
taskkill /f /im node.exe /fi "WINDOWTITLE eq ABC-Backend" >nul 2>&1
echo ✅ Node.js processes stopped

:: Stop PostgreSQL Docker container
echo [4/4] Stopping PostgreSQL Database...
docker-compose -f docker-compose.local.postgres.yml down >nul 2>&1
echo ✅ PostgreSQL stopped

echo.
echo ========================================
echo     🏁 All services stopped successfully
echo ========================================
echo.
echo Press any key to close...
pause >nul 