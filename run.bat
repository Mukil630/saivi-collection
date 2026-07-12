@echo off
cd /d "%~dp0"
color 0F
title SAVI'S Collection Launcher
echo =======================================================
echo            SAVI'S COLLECTION STORE LAUNCHER
echo =======================================================
echo.
echo 1. Starting SAVI'S Backend (Express API and Telegram Bot on Port 5000)...
start "SAVI'S Backend (Port 5000)" cmd /k "color 0F && cd /d \"%~dp0backend\" && npm run start"
echo.
echo 2. Starting SAVI'S Frontend (Vite React Web App on Port 5173)...
start "SAVI'S Frontend (Port 5173)" cmd /k "color 0F && cd /d \"%~dp0frontend\" && npm run dev"
echo.
echo Waiting for services to initialize...
ping 127.0.0.1 -n 4 >nul
start http://localhost:5173
echo.
echo =======================================================
echo  Launch triggered successfully!
echo  - Backend running at http://localhost:5000
echo  - Frontend running at http://localhost:5173 (Proxying /api to Backend)
echo =======================================================
echo.
pause
