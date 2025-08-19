# Comprehensive Terminal Fix Script for Cursor
Write-Host "Fixing Cursor Terminal Hanging Issues..." -ForegroundColor Yellow

# Step 1: Kill all hanging processes
Write-Host "Step 1: Killing hanging processes..." -ForegroundColor Cyan
taskkill /f /im node.exe 2>$null
taskkill /f /im npm.exe 2>$null
taskkill /f /im vite.exe 2>$null
taskkill /f /im tsx.exe 2>$null

# Step 2: Clear caches
Write-Host "Step 2: Clearing caches..." -ForegroundColor Cyan
npm cache clean --force
if (Test-Path ".vite") { Remove-Item -Recurse -Force ".vite" }
if (Test-Path "node_modules/.vite") { Remove-Item -Recurse -Force "node_modules/.vite" }

# Step 3: Set environment variables
Write-Host "Step 3: Setting environment variables..." -ForegroundColor Cyan
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings"
$env:NODE_ENV = "development"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"
$env:NPM_CONFIG_AUDIT = "false"
$env:NPM_CONFIG_FUND = "false"

# Step 4: Optimize PowerShell settings
Write-Host "Step 4: Optimizing PowerShell..." -ForegroundColor Cyan
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(120, 3000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(120, 30)
$Host.UI.RawUI.CursorSize = 25

# Step 5: Clear terminal
Clear-Host

Write-Host "Terminal fix completed!" -ForegroundColor Green
Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "   NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor White
Write-Host "   NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "   VITE_DISABLE_TELEMETRY: $env:VITE_DISABLE_TELEMETRY" -ForegroundColor White

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Restart Cursor" -ForegroundColor White
Write-Host "   2. Open new terminal" -ForegroundColor White
Write-Host "   3. Run: npm run dev" -ForegroundColor White
