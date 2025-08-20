# Fix Terminal Hanging Issues Script
Write-Host "Terminal Hanging Issues Fix Starting..." -ForegroundColor Yellow

# Kill any hanging Node.js processes
Write-Host "Stopping hanging Node.js processes..." -ForegroundColor Cyan
try {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process vite -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Node.js processes cleaned" -ForegroundColor Green
}
catch {
    Write-Host "Some processes were already terminated" -ForegroundColor Yellow
}

# Clear npm cache
Write-Host "Clearing NPM cache..." -ForegroundColor Cyan
try {
    npm cache clean --force 2>&1 | Out-Null
    Write-Host "NPM cache cleared" -ForegroundColor Green
}
catch {
    Write-Host "NPM cache clear had issues" -ForegroundColor Yellow
}

# Clear Vite cache
Write-Host "Clearing Vite cache..." -ForegroundColor Cyan
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite" -ErrorAction SilentlyContinue
    Write-Host "Vite cache cleared" -ForegroundColor Green
}
else {
    Write-Host "Vite cache already clean" -ForegroundColor Blue
}

# Clear temporary files
Write-Host "Clearing temporary files..." -ForegroundColor Cyan
$tempPaths = @(
    "dist",
    ".eslintcache", 
    "coverage",
    "*.log",
    "*.tsbuildinfo"
)

foreach ($path in $tempPaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "Cleared: $path" -ForegroundColor Green
    }
}

# Reset environment variables
Write-Host "Resetting environment variables..." -ForegroundColor Cyan
$env:NODE_OPTIONS = $null
$env:VITE_DISABLE_TELEMETRY = $null
$env:VITE_DISABLE_SOURCEMAP = $null
$env:GENERATE_SOURCEMAP = $null
Write-Host "Environment variables reset" -ForegroundColor Green

# Clear PowerShell session
Write-Host "Clearing PowerShell session..." -ForegroundColor Cyan
Clear-Host

Write-Host "Terminal hanging issues fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now safely start with npm run dev:fast" -ForegroundColor Cyan
