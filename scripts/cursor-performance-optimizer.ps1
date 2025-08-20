# Cursor Performance Optimizer
# Bu script Cursor'ın performans sorunlarını çözer

Write-Host "🚀 Cursor Performance Optimizer başlatılıyor..." -ForegroundColor Green

# 1. Node.js süreçlerini temizle
Write-Host "📦 Node.js süreçlerini temizleniyor..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" -or $_.ProcessName -like "*vite*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Port kullanımını kontrol et ve temizle
Write-Host "🔌 Port kullanımını kontrol ediliyor..." -ForegroundColor Yellow
$ports = @(3000, 5173, 5176, 8000, 8080)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Port $port kullanımda, temizleniyor..." -ForegroundColor Red
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 3. Cache temizle
Write-Host "🗑️ Cache temizleniyor..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item "node_modules/.vite" -Recurse -Force
}
if (Test-Path ".vite") {
    Remove-Item ".vite" -Recurse -Force
}
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force
}

# 4. Package-lock.json'ı yeniden oluştur
Write-Host "📋 Package-lock.json yeniden oluşturuluyor..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
}
npm install --silent

# 5. TypeScript cache temizle
Write-Host "🔧 TypeScript cache temizleniyor..." -ForegroundColor Yellow
if (Test-Path ".tsbuildinfo") {
    Remove-Item ".tsbuildinfo" -Force
}

# 6. ESLint cache temizle
Write-Host "📝 ESLint cache temizleniyor..." -ForegroundColor Yellow
if (Test-Path ".eslintcache") {
    Remove-Item ".eslintcache" -Force
}

# 7. Test cache temizle
Write-Host "🧪 Test cache temizleniyor..." -ForegroundColor Yellow
if (Test-Path "coverage") {
    Remove-Item "coverage" -Recurse -Force
}

# 8. API cache temizle
Write-Host "🌐 API cache temizleniyor..." -ForegroundColor Yellow
if (Test-Path "api/node_modules/.vite") {
    Remove-Item "api/node_modules/.vite" -Recurse -Force
}

# 9. Memory optimizasyonu
Write-Host "💾 Memory optimizasyonu yapılıyor..." -ForegroundColor Yellow
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

# 10. Cursor ayarları için öneriler
Write-Host "⚙️ Cursor ayarları için öneriler:" -ForegroundColor Cyan
Write-Host "1. Cursor'da Settings > Performance > Memory Limit: 4096MB" -ForegroundColor White
Write-Host "2. Settings > Performance > Enable GPU Acceleration: ON" -ForegroundColor White
Write-Host "3. Settings > Performance > Disable Telemetry: ON" -ForegroundColor White
Write-Host "4. Settings > Editor > Auto Save: afterDelay" -ForegroundColor White
Write-Host "5. Settings > Editor > Format On Save: OFF (performans için)" -ForegroundColor White

Write-Host "Cursor Performance Optimizer tamamlandi!" -ForegroundColor Green
Write-Host "Simdi 'npm run dev' komutunu calistirabilirsiniz." -ForegroundColor Green
