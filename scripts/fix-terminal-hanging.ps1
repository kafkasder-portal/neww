# Fix Terminal Hanging Issues for Cursor
Write-Host "🔧 Fixing terminal hanging issues..." -ForegroundColor Yellow

# Kill any hanging Node.js processes
Write-Host "Killing hanging Node.js processes..." -ForegroundColor Cyan
taskkill /f /im node.exe 2>$null
taskkill /f /im npm.cmd 2>$null
taskkill /f /im npx.cmd 2>$null

# Kill any hanging PowerShell processes
Write-Host "Killing hanging PowerShell processes..." -ForegroundColor Cyan
Get-Process | Where-Object { $_.ProcessName -like "*powershell*" -and $_.Id -ne $PID } | Stop-Process -Force 2>$null

# Clear port usage
Write-Host "Clearing port usage..." -ForegroundColor Cyan
netstat -ano | findstr :5176 | ForEach-Object {
    $parts = $_ -split '\s+'
    if ($parts.Length -gt 4) {
        $processId = $parts[4]
        taskkill /f /pid $processId 2>$null
    }
}

netstat -ano | findstr :3004 | ForEach-Object {
    $parts = $_ -split '\s+'
    if ($parts.Length -gt 4) {
        $processId = $parts[4]
        taskkill /f /pid $processId 2>$null
    }
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force 2>$null

# Clear Vite cache
Write-Host "Clearing Vite cache..." -ForegroundColor Cyan
Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# Reset PowerShell console
Write-Host "Resetting PowerShell console..." -ForegroundColor Cyan
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(120, 5000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(120, 30)
Clear-Host

# Set optimized environment variables
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings --disable-source-maps"
$env:NODE_ENV = "development"
$env:NODE_NO_WARNINGS = "1"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:VITE_DISABLE_SOURCEMAP = "1"
$env:GENERATE_SOURCEMAP = "false"

# Disable progress bars
$ProgressPreference = 'SilentlyContinue'

Write-Host "✅ Terminal hanging issues fixed!" -ForegroundColor Green
