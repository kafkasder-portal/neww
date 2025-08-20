# Terminal Optimization Script for Cursor - Enhanced Version
Write-Host "Optimizing terminal performance for Cursor..." -ForegroundColor Yellow

# Increase PowerShell memory limit and performance
$Host.UI.RawUI.BufferSize = New-Object Management.Automation.Host.Size(120, 5000)
$Host.UI.RawUI.WindowSize = New-Object Management.Automation.Host.Size(120, 30)

# Set environment variables for better Node.js performance
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings --disable-source-maps"
$env:NODE_ENV = "development"
$env:NODE_NO_WARNINGS = "1"

# Disable telemetry and notifications for better performance
$env:VITE_DISABLE_TELEMETRY = "1"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"
$env:NPM_CONFIG_AUDIT = "false"
$env:NPM_CONFIG_FUND = "false"

# Disable source maps globally
$env:VITE_DISABLE_SOURCEMAP = "1"
$env:GENERATE_SOURCEMAP = "false"

# Optimize PowerShell settings
$PSDefaultParameterValues['Out-Default:OutVariable'] = 'null'
$PSDefaultParameterValues['*:Verbose'] = $false
$PSDefaultParameterValues['*:Debug'] = $false

# Disable progress bars for faster execution
$ProgressPreference = 'SilentlyContinue'

# Optimize console output
$Host.UI.RawUI.CursorSize = 0

# Clear terminal and set title
Clear-Host
$Host.UI.RawUI.WindowTitle = "Cursor Optimized Terminal - C:\neww"

Write-Host "Terminal optimization completed!" -ForegroundColor Green
Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor White
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "  VITE_DISABLE_TELEMETRY: $env:VITE_DISABLE_TELEMETRY" -ForegroundColor White
Write-Host "  VITE_DISABLE_SOURCEMAP: $env:VITE_DISABLE_SOURCEMAP" -ForegroundColor White
Write-Host "  GENERATE_SOURCEMAP: $env:GENERATE_SOURCEMAP" -ForegroundColor White

Write-Host ""
Write-Host "Ready for development! Use 'npm run dev:fast' to start." -ForegroundColor Green
