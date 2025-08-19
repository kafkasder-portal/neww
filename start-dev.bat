
@echo off
echo Starting High-Performance Development Environment...
echo.

REM Set high-performance environment variables
set NODE_OPTIONS=--max-old-space-size=8192 --no-warnings --experimental-worker
set NODE_ENV=development
set VITE_DISABLE_TELEMETRY=1
set NPM_CONFIG_UPDATE_NOTIFIER=false
set NPM_CONFIG_AUDIT=false
set NPM_CONFIG_FUND=false
set UV_THREADPOOL_SIZE=16

REM Kill any existing Node.js processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

REM Clear Vite cache
if exist ".vite" rmdir /s /q ".vite"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

REM Clear Cursor AI cache
if exist "%APPDATA%\Cursor\Cache" rmdir /s /q "%APPDATA%\Cursor\Cache"
if exist "%APPDATA%\Cursor\Code Cache" rmdir /s /q "%APPDATA%\Cursor\Code Cache"
if exist "%APPDATA%\Cursor\GPUCache" rmdir /s /q "%APPDATA%\Cursor\GPUCache"

echo High-performance environment variables set:
echo   NODE_OPTIONS: %NODE_OPTIONS%
echo   NODE_ENV: %NODE_ENV%
echo   VITE_DISABLE_TELEMETRY: %VITE_DISABLE_TELEMETRY%
echo   UV_THREADPOOL_SIZE: %UV_THREADPOOL_SIZE%
echo.

echo Starting development server with AI optimization...
npm run dev:ai

pause

