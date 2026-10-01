@echo off
setlocal
title NEO-SHINOBI : 3D RASENGAN & CHIDORI
color 0B
cls

echo ============================================================
echo.
echo           * * * NEO-SHINOBI : AMATERASU VISION * * *
echo          3D Rasengan, Chidori and Zero-Delay Audio
echo.
echo ============================================================
echo.

cd /d "%~dp0"

REM 1. Verify Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 2. Verify node_modules
if not exist node_modules (
    echo [INFO] Installing Web dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
)

echo [STATUS] Launching NEO-SHINOBI on http://localhost:5173/
echo.
echo Press CTRL+C in this terminal anytime to stop.
echo.

REM 3. Open default browser
start "" "http://localhost:5173/"

REM 4. Run Vite Dev Server
call npm run dev

pause
