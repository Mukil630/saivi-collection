@echo off
color 0F
title SAVI'S collection Build Tool
echo =======================================================
echo            SAVI'S COLLECTION BUILD ^& SETUP
echo =======================================================
echo.

echo 1. Checking frontend dependencies...
if not exist "frontend\node_modules\" (
    echo [INFO] Installing frontend dependencies. Please wait...
    cd frontend && npm install && cd ..
) else (
    echo [OK] Frontend dependencies already installed.
)
echo.

echo 2. Building React Frontend for Production...
cd frontend
npm run build
cd ..
echo.

echo =======================================================
echo  Build Process Finished!
echo  - To run in DEVELOPMENT mode: Double-click run.bat
echo  - To preview the PRODUCTION build:
echo    cd frontend && npm run preview
echo =======================================================
echo.
pause
