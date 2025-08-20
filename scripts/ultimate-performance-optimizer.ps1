# Ultimate Performance Optimizer for AI Agent - Enhanced Edition
Write-Host "Ultimate AI Performance Optimization - Enhanced Edition..." -ForegroundColor Yellow

# Step 1: Set Ultimate Performance Environment Variables
Write-Host "Step 1: Setting ultimate performance environment variables..." -ForegroundColor Cyan
$env:NODE_OPTIONS = "--max-old-space-size=16384 --no-warnings --experimental-worker --max-semi-space-size=512 --gc-interval=100 --optimize-for-size --max-old-space-size=16384"
$env:NODE_ENV = "development"
$env:NODE_NO_WARNINGS = "1"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:VITE_DISABLE_SOURCEMAP = "1"
$env:GENERATE_SOURCEMAP = "false"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"
$env:NPM_CONFIG_AUDIT = "false"
$env:NPM_CONFIG_FUND = "false"
$env:UV_THREADPOOL_SIZE = "64"
$env:NODE_OPTIONS = "--max-old-space-size=16384 --no-warnings --experimental-worker --max-semi-space-size=512 --gc-interval=100 --optimize-for-size --disable-source-maps --no-deprecation"

# Step 2: Clear All Caches - Enhanced
Write-Host "Step 2: Clearing all caches..." -ForegroundColor Cyan
if (Test-Path "$env:APPDATA\Cursor\Cache") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Cache" -ErrorAction SilentlyContinue
    Write-Host "  Cursor Cache cleared" -ForegroundColor Green
}
if (Test-Path "$env:APPDATA\Cursor\Code Cache") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Code Cache" -ErrorAction SilentlyContinue
    Write-Host "  Cursor Code Cache cleared" -ForegroundColor Green
}
if (Test-Path "$env:APPDATA\Cursor\GPUCache") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\GPUCache" -ErrorAction SilentlyContinue
    Write-Host "  Cursor GPU Cache cleared" -ForegroundColor Green
}
if (Test-Path "$env:APPDATA\Cursor\CachedData") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\CachedData" -ErrorAction SilentlyContinue
    Write-Host "  Cursor CachedData cleared" -ForegroundColor Green
}
if (Test-Path ".vite") {
    Remove-Item -Recurse -Force ".vite" -ErrorAction SilentlyContinue
    Write-Host "  Vite cache cleared" -ForegroundColor Green
}
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    Write-Host "  Node modules Vite cache cleared" -ForegroundColor Green
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
    Write-Host "  Dist folder cleared" -ForegroundColor Green
}

# Step 3: Optimize PowerShell for Maximum Performance - Enhanced
Write-Host "Step 3: Optimizing PowerShell for maximum performance..." -ForegroundColor Cyan
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(200, 15000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(200, 60)
$Host.UI.RawUI.CursorSize = 25

# Optimize PowerShell settings
$PSDefaultParameterValues['Out-Default:OutVariable'] = 'null'
$PSDefaultParameterValues['*:Verbose'] = $false
$PSDefaultParameterValues['*:Debug'] = $false
$ProgressPreference = 'SilentlyContinue'

# Step 4: Set Process Priority to High - Enhanced
Write-Host "Step 4: Setting process priority to high..." -ForegroundColor Cyan
$currentProcess = Get-Process -Id $PID
$currentProcess.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
Write-Host "  Process priority set to High" -ForegroundColor Green

# Step 5: Optimize Windows Performance - Enhanced
Write-Host "Step 5: Optimizing Windows performance..." -ForegroundColor Cyan
# Disable Windows Defender real-time protection temporarily for development
Set-MpPreference -DisableRealtimeMonitoring $true -ErrorAction SilentlyContinue
Write-Host "  Windows Defender real-time monitoring disabled" -ForegroundColor Green

# Optimize Windows for development
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "LargeSystemCache" -Value 1 -ErrorAction SilentlyContinue
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "SystemCacheLimit" -Value 0xFFFFFFFF -ErrorAction SilentlyContinue
Write-Host "  Windows memory management optimized" -ForegroundColor Green

# Step 6: Kill Hanging Processes - New
Write-Host "Step 6: Killing hanging processes..." -ForegroundColor Cyan
taskkill /f /im node.exe 2>$null
taskkill /f /im npm.cmd 2>$null
taskkill /f /im npx.cmd 2>$null
Write-Host "  Hanging processes cleared" -ForegroundColor Green

# Step 7: Optimize Network Settings - New
Write-Host "Step 7: Optimizing network settings..." -ForegroundColor Cyan
netsh int tcp set global autotuninglevel=normal 2>$null
netsh int tcp set global chimney=enabled 2>$null
netsh int tcp set global ecncapability=enabled 2>$null
Write-Host "  Network settings optimized" -ForegroundColor Green

# Step 8: Clear terminal and show results
Clear-Host

Write-Host "Ultimate Performance Optimization completed!" -ForegroundColor Green
Write-Host "Ultimate performance environment variables set:" -ForegroundColor Cyan
Write-Host "   NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor White
Write-Host "   NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "   UV_THREADPOOL_SIZE: $env:UV_THREADPOOL_SIZE" -ForegroundColor White
Write-Host "   VITE_DISABLE_SOURCEMAP: $env:VITE_DISABLE_SOURCEMAP" -ForegroundColor White
Write-Host "   GENERATE_SOURCEMAP: $env:GENERATE_SOURCEMAP" -ForegroundColor White
Write-Host "   Process Priority: High" -ForegroundColor White
Write-Host "   Windows Defender: Disabled for development" -ForegroundColor White
Write-Host "   Network: Optimized" -ForegroundColor White

Write-Host ""
Write-Host "AI Agent should now be ULTRA FAST!" -ForegroundColor Yellow
Write-Host "Restart Cursor for maximum performance." -ForegroundColor White
Write-Host ""
Write-Host "Performance Tips:" -ForegroundColor Cyan
Write-Host "   - Use specific prompts for faster responses" -ForegroundColor White
Write-Host "   - Break large requests into smaller chunks" -ForegroundColor White
Write-Host "   - Keep Cursor updated to latest version" -ForegroundColor White
Write-Host "   - Use 'npm run dev:fast' for optimized development" -ForegroundColor White
Write-Host "   - Source maps are disabled for maximum speed" -ForegroundColor White

Write-Host ""
Write-Host "Ready for ULTIMATE performance!" -ForegroundColor Green
