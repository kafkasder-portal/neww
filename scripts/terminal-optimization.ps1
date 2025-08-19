# Terminal Optimization Script for Cursor
Write-Host "Optimizing terminal performance..." -ForegroundColor Yellow

# Increase PowerShell memory limit
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(120, 3000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(120, 30)

# Set environment variables for better Node.js performance
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NODE_ENV = "development"

# Disable telemetry for better performance
$env:VITE_DISABLE_TELEMETRY = "1"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"

# Clear terminal
Clear-Host

Write-Host "Terminal optimization completed!" -ForegroundColor Green
Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor White
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "  VITE_DISABLE_TELEMETRY: $env:VITE_DISABLE_TELEMETRY" -ForegroundColor White
