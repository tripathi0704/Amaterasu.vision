@echo off
setlocal
title NEO-SHINOBI : AMATERASU VISION SETUP
color 0B
cls

echo ============================================================
echo.
echo           * * * NEO-SHINOBI : AMATERASU VISION * * *
echo                  Automated Environment Setup
echo.
echo ============================================================
echo.

cd /d "%~dp0"

REM 1. Verify Node.js installation
echo [STEP 1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is not found on your system!
    echo Node.js is required to run this application.
    echo.
    echo Please download and install Node.js (LTS version) from:
    echo https://nodejs.org/
    echo.
    echo After installing Node.js, run setup.bat again.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is detected!
node -v
echo.

REM 2. Install project dependencies
echo [STEP 2/3] Installing project dependencies (npm install)...
echo This may take a few seconds on first run...
echo.

call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies!
    echo Please check your internet connection and try running setup.bat again.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] All dependencies successfully installed!
echo.

REM 3. Completion confirmation
echo ============================================================
echo [SUCCESS] Amaterasu.vision is ready to run!
echo.
echo You can launch the project anytime by running 'start.bat'.
echo ============================================================
echo.

set /p launch="Do you want to launch the experience right now? (Y/N) [Y]: "
if /i "%launch%"=="" goto launch_app
if /i "%launch%"=="y" goto launch_app
if /i "%launch%"=="yes" goto launch_app

echo.
echo Setup finished. Double-click 'start.bat' whenever you want to run!
pause
exit /b 0

:launch_app
echo.
echo [INFO] Launching Amaterasu.vision...
start "" "%~dp0start.bat"
exit /b 0
