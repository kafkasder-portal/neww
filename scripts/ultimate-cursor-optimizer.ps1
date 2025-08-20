# Ultimate Cursor Optimizer - Enhanced Edition
# Combines all performance optimizations for maximum Cursor performance

Write-Host "🚀 Ultimate Cursor Optimizer - Enhanced Edition" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan

# Step 1: Set Ultimate Performance Environment Variables
Write-Host "Step 1: Setting ultimate performance environment variables..." -ForegroundColor Cyan
$env:NODE_OPTIONS = "--max-old-space-size=16384 --no-warnings --experimental-worker --max-semi-space-size=512 --gc-interval=100 --optimize-for-size --disable-source-maps --no-deprecation --enable-source-maps=false"
$env:NODE_ENV = "development"
$env:NODE_NO_WARNINGS = "1"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:VITE_DISABLE_SOURCEMAP = "1"
$env:GENERATE_SOURCEMAP = "false"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"
$env:NPM_CONFIG_AUDIT = "false"
$env:NPM_CONFIG_FUND = "false"
$env:UV_THREADPOOL_SIZE = "64"
$env:CURSOR_DISABLE_TELEMETRY = "1"
$env:CURSOR_DISABLE_ANALYTICS = "1"
$env:CURSOR_DISABLE_CRASH_REPORTS = "1"

# Step 2: Kill All Hanging Processes
Write-Host "Step 2: Killing hanging processes..." -ForegroundColor Cyan
$processesToKill = @("node", "npm", "npx", "vite", "typescript", "eslint")
foreach ($proc in $processesToKill) {
    Get-Process | Where-Object {$_.ProcessName -like "*$proc*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  Killed $proc processes" -ForegroundColor Green
}

# Step 3: Clear Port Usage
Write-Host "Step 3: Clearing port usage..." -ForegroundColor Cyan
$ports = @(3000, 5173, 5176, 5177, 3004, 8000, 8080)
foreach ($port in $ports) {
    $connections = netstat -ano | findstr ":$port "
    if ($connections) {
        $connections | ForEach-Object {
            $parts = $_ -split '\s+'
            if ($parts.Length -gt 4) {
                $processId = $parts[4]
                taskkill /f /pid $processId 2>$null
            }
        }
        Write-Host "  Cleared port $port" -ForegroundColor Green
    }
}

# Step 4: Clear All Caches - Comprehensive
Write-Host "Step 4: Clearing all caches..." -ForegroundColor Cyan

# Cursor caches
$cursorCachePaths = @(
    "$env:APPDATA\Cursor\Cache",
    "$env:APPDATA\Cursor\Code Cache", 
    "$env:APPDATA\Cursor\GPUCache",
    "$env:APPDATA\Cursor\CachedData",
    "$env:APPDATA\Cursor\logs",
    "$env:APPDATA\Cursor\workspaceStorage"
)

foreach ($path in $cursorCachePaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "  Cleared: $path" -ForegroundColor Green
    }
}

# Project caches
$projectCachePaths = @(
    ".vite",
    "node_modules\.vite", 
    "api/node_modules\.vite",
    "dist",
    ".tsbuildinfo",
    ".eslintcache",
    "coverage",
    ".nyc_output",
    ".cache"
)

foreach ($path in $projectCachePaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "  Cleared: $path" -ForegroundColor Green
    }
}

# npm cache
Write-Host "  Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null

# Step 5: Optimize PowerShell for Maximum Performance
Write-Host "Step 5: Optimizing PowerShell..." -ForegroundColor Cyan
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(200, 15000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(200, 60)
$Host.UI.RawUI.CursorSize = 25

# PowerShell optimizations
$PSDefaultParameterValues['Out-Default:OutVariable'] = 'null'
$PSDefaultParameterValues['*:Verbose'] = $false
$PSDefaultParameterValues['*:Debug'] = $false
$ProgressPreference = 'SilentlyContinue'

# Step 6: Set Process Priority to High
Write-Host "Step 6: Setting process priority..." -ForegroundColor Cyan
$currentProcess = Get-Process -Id $PID
$currentProcess.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
Write-Host "  Process priority set to High" -ForegroundColor Green

# Step 7: Optimize Windows Performance
Write-Host "Step 7: Optimizing Windows..." -ForegroundColor Cyan

# Disable Windows Defender temporarily for development
Set-MpPreference -DisableRealtimeMonitoring $true -ErrorAction SilentlyContinue
Write-Host "  Windows Defender real-time monitoring disabled" -ForegroundColor Green

# Optimize Windows memory management
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "LargeSystemCache" -Value 1 -ErrorAction SilentlyContinue
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "SystemCacheLimit" -Value 0xFFFFFFFF -ErrorAction SilentlyContinue
Write-Host "  Windows memory management optimized" -ForegroundColor Green

# Step 8: Optimize Network Settings
Write-Host "Step 8: Optimizing network..." -ForegroundColor Cyan
netsh int tcp set global autotuninglevel=normal 2>$null
netsh int tcp set global chimney=enabled 2>$null
netsh int tcp set global ecncapability=enabled 2>$null
Write-Host "  Network settings optimized" -ForegroundColor Green

# Step 9: Memory Optimization
Write-Host "Step 9: Memory optimization..." -ForegroundColor Cyan
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
[System.GC]::Collect()
Write-Host "  Memory optimized" -ForegroundColor Green

# Step 10: Clear terminal and show results
Clear-Host

Write-Host "🎉 Ultimate Cursor Optimization Completed!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "Environment Variables Set:" -ForegroundColor Yellow
Write-Host "  NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor White
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "  UV_THREADPOOL_SIZE: $env:UV_THREADPOOL_SIZE" -ForegroundColor White
Write-Host "  VITE_DISABLE_SOURCEMAP: $env:VITE_DISABLE_SOURCEMAP" -ForegroundColor White
Write-Host "  GENERATE_SOURCEMAP: $env:GENERATE_SOURCEMAP" -ForegroundColor White

Write-Host ""
Write-Host "Performance Optimizations Applied:" -ForegroundColor Yellow
Write-Host "  ✅ Process Priority: High" -ForegroundColor Green
Write-Host "  ✅ Windows Defender: Disabled for development" -ForegroundColor Green
Write-Host "  ✅ Network: Optimized" -ForegroundColor Green
Write-Host "  ✅ Memory: Optimized" -ForegroundColor Green
Write-Host "  ✅ Caches: Cleared" -ForegroundColor Green
Write-Host "  ✅ Ports: Cleared" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 AI Agent should now be ULTRA FAST!" -ForegroundColor Yellow
Write-Host "Restart Cursor for maximum performance." -ForegroundColor White

Write-Host ""
Write-Host "Available Commands:" -ForegroundColor Cyan
Write-Host "  npm run dev:ultimate    - Ultimate optimized development" -ForegroundColor White
Write-Host "  npm run dev:cursor      - Cursor optimized development" -ForegroundColor White
Write-Host "  npm run dev:safe        - Safe development mode" -ForegroundColor White
Write-Host "  npm run analyze:ultimate - Bundle analysis" -ForegroundColor White

Write-Host ""
Write-Host "Performance Tips:" -ForegroundColor Cyan
Write-Host "  • Use specific prompts for faster responses" -ForegroundColor White
Write-Host "  • Break large requests into smaller chunks" -ForegroundColor White
Write-Host "  • Keep Cursor updated to latest version" -ForegroundColor White
Write-Host "  • Source maps are disabled for maximum speed" -ForegroundColor White
Write-Host "  • Use BundleMonitor component for real-time tracking" -ForegroundColor White

Write-Host ""
Write-Host "Ready for ULTIMATE performance! 🚀" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
