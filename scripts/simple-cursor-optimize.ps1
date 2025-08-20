# Simple Cursor Optimizer
Write-Host "Cursor Performance Optimizer baslatiliyor..." -ForegroundColor Green

# Clean Node processes
Write-Host "Node.js surecleri temizleniyor..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" -or $_.ProcessName -like "*vite*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Clean ports
Write-Host "Portlar temizleniyor..." -ForegroundColor Yellow
$ports = @(3000, 5173, 5176, 8000, 8080)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# Clean cache
Write-Host "Cache temizleniyor..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") { Remove-Item "node_modules/.vite" -Recurse -Force }
if (Test-Path ".vite") { Remove-Item ".vite" -Recurse -Force }
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
if (Test-Path ".tsbuildinfo") { Remove-Item ".tsbuildinfo" -Force }
if (Test-Path ".eslintcache") { Remove-Item ".eslintcache" -Force }

# Memory optimization
Write-Host "Memory optimizasyonu..." -ForegroundColor Yellow
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "Optimizasyon tamamlandi!" -ForegroundColor Green
Write-Host "npm run dev:cursor komutunu calistirabilirsiniz." -ForegroundColor Green
