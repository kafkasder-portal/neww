# Cleanup script for hanging Node.js processes
Write-Host "Cleaning up Node.js processes..." -ForegroundColor Yellow

# Kill all Node.js processes
Get-Process | Where-Object {$_.ProcessName -eq "node"} | ForEach-Object {
    Write-Host "Killing process: $($_.ProcessName) (ID: $($_.Id))" -ForegroundColor Red
    Stop-Process -Id $_.Id -Force
}

# Kill npm processes
Get-Process | Where-Object {$_.ProcessName -eq "npm"} | ForEach-Object {
    Write-Host "Killing process: $($_.ProcessName) (ID: $($_.Id))" -ForegroundColor Red
    Stop-Process -Id $_.Id -Force
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Clear node_modules and reinstall
Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "api/node_modules") {
    Remove-Item -Recurse -Force "api/node_modules"
}

Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Cleanup completed!" -ForegroundColor Green
