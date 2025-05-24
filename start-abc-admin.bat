@echo off
setlocal enabledelayedexpansion

:: ABC Admin - One-Click Startup for Windows
:: Double-click this file to start the entire application
title ABC Admin - Starting Up...

echo.
echo ========================================
echo    🚀 ABC Admin - One-Click Startup
echo ========================================
echo.

:: Change to script directory
cd /d "%~dp0"

:: Check for Node.js
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found

:: Check for Docker
echo [2/6] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not running
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo ✅ Docker found

:: Check for npm dependencies
echo [3/6] Checking npm dependencies...
if not exist "node_modules\" (
    echo 📦 Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)
echo ✅ Dependencies ready

:: Start PostgreSQL Database
echo [4/6] Starting PostgreSQL Database...
start /min "ABC-PostgreSQL" docker-compose -f docker-compose.local.postgres.yml up
timeout /t 10 /nobreak >nul

:: Verify Docker container is running
docker-compose -f docker-compose.local.postgres.yml ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Failed to start PostgreSQL
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)
echo ✅ PostgreSQL started successfully

:: Start Backend API
echo [5/6] Starting Backend API...
start /min "ABC-Backend" cmd /c "npx nx serve api"
echo ✅ Backend API starting...

:: Wait for backend to initialize
echo ⏳ Waiting for backend to initialize...
timeout /t 15 /nobreak >nul

:: Start Frontend
echo [6/6] Starting Frontend...
start /min "ABC-Frontend" cmd /c "npx nx serve web"
echo ✅ Frontend starting...

:: Wait for frontend to be ready
echo ⏳ Waiting for frontend to be ready...
timeout /t 20 /nobreak >nul

:: Open web browser
echo 🌐 Opening web browser...
start http://localhost:3000

echo.
echo ========================================
echo     🎉 ABC Admin is ready!
echo ========================================
echo.
echo   📊 Frontend:    http://localhost:3000
echo   🔧 Backend API: http://localhost:8080  
echo   🐘 Database:    localhost:5432
echo.
echo 💡 Your web browser should open automatically
echo 💡 All services are running in the background
echo.
echo ⚠️  To stop all services:
echo    1. Close this window
echo    2. Or run: stop-abc-admin.bat
echo.
echo Press any key to minimize this window...
pause >nul

:: Minimize the command window
powershell -command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); [DllImport(\"kernel32.dll\")] public static extern IntPtr GetConsoleWindow(); }'; $consoleWindow = [Win32]::GetConsoleWindow(); [Win32]::ShowWindow($consoleWindow, 6)" 2>nul

:: Keep the script running to maintain services
echo Services are running. Close this window to stop all services.
:loop
timeout /t 30 /nobreak >nul
goto loop 