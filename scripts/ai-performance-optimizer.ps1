# AI Agent Performance Optimizer for Powerful Computers
Write-Host "Optimizing AI Agent Performance..." -ForegroundColor Yellow

# Step 1: Set High-Performance Environment Variables
Write-Host "Step 1: Setting high-performance environment variables..." -ForegroundColor Cyan
$env:NODE_OPTIONS = "--max-old-space-size=8192 --no-warnings --experimental-worker"
$env:NODE_ENV = "development"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"
$env:NPM_CONFIG_AUDIT = "false"
$env:NPM_CONFIG_FUND = "false"
$env:UV_THREADPOOL_SIZE = "16"

# Step 2: Clear AI Cache
Write-Host "Step 2: Clearing AI cache..." -ForegroundColor Cyan
if (Test-Path "$env:APPDATA\Cursor\Cache") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Cache" -ErrorAction SilentlyContinue
}
if (Test-Path "$env:APPDATA\Cursor\Code Cache") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Code Cache" -ErrorAction SilentlyContinue
}
if (Test-Path "$env:APPDATA\Cursor\GPUCache") {
    Remove-Item -Recurse -Force "$env:APPDATA\Cursor\GPUCache" -ErrorAction SilentlyContinue
}

# Step 3: Optimize PowerShell for AI
Write-Host "Step 3: Optimizing PowerShell for AI..." -ForegroundColor Cyan
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(150, 5000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(150, 40)
$Host.UI.RawUI.CursorSize = 25

# Step 4: Set Process Priority
Write-Host "Step 4: Setting process priority..." -ForegroundColor Cyan
$currentProcess = Get-Process -Id $PID
$currentProcess.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High

# Step 5: Clear terminal
Clear-Host

Write-Host "AI Performance Optimization completed!" -ForegroundColor Green
Write-Host "High-performance environment variables set:" -ForegroundColor Cyan
Write-Host "   NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor White
Write-Host "   NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "   UV_THREADPOOL_SIZE: $env:UV_THREADPOOL_SIZE" -ForegroundColor White
Write-Host "   Process Priority: High" -ForegroundColor White

Write-Host ""
Write-Host "AI Agent should now be much faster!" -ForegroundColor Yellow
Write-Host "Restart Cursor for best results." -ForegroundColor White
