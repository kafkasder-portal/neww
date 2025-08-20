# Cursor Quick Start Script
# Bu script Cursor'ı hızlı ve optimize şekilde başlatır

Write-Host "Cursor Quick Start baslatiliyor..." -ForegroundColor Green

# 1. Mevcut süreçleri kontrol et
Write-Host "Mevcut surecler kontrol ediliyor..." -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" -or $_.ProcessName -like "*vite*"}
if ($nodeProcesses) {
    Write-Host "Calisan Node.js surecleri bulundu, durduruluyor..." -ForegroundColor Red
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# 2. Port kontrolü
Write-Host "Port kontrolu yapiliyor..." -ForegroundColor Yellow
$ports = @(5176, 5177, 3004)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Port $port kullanimda, temizleniyor..." -ForegroundColor Red
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 3. Hızlı cache temizleme
Write-Host "Hizli cache temizleme..." -ForegroundColor Yellow
$cachePaths = @(
    "node_modules/.vite",
    ".vite",
    "api/node_modules/.vite",
    ".tsbuildinfo",
    ".eslintcache"
)

foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 4. Environment değişkenleri ayarla
Write-Host "Environment degiskenleri ayarlaniyor..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings"
$env:NODE_ENV = "development"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:NPM_CONFIG_UPDATE_NOTIFIER = "false"
$env:NPM_CONFIG_AUDIT = "false"
$env:NPM_CONFIG_FUND = "false"

# 5. Hızlı başlatma
Write-Host "Uygulama baslatiliyor..." -ForegroundColor Green
Write-Host "Kullanilabilir komutlar:" -ForegroundColor Cyan
Write-Host "   npm run dev:cursor    - Cursor optimize edilmis gelistirme" -ForegroundColor White
Write-Host "   npm run dev:safe      - Guvenli gelistirme modu" -ForegroundColor White
Write-Host "   npm run cursor:optimize - Sadece optimizasyon" -ForegroundColor White

# 6. Otomatik başlatma seçeneği
$autoStart = Read-Host "Otomatik olarak uygulamayi baslatmak istiyor musunuz? (y/n)"
if ($autoStart -eq "y" -or $autoStart -eq "Y") {
    Write-Host "Uygulama baslatiliyor..." -ForegroundColor Green
    npm run dev:cursor
} else {
    Write-Host "Hazir! 'npm run dev:cursor' komutunu calistirabilirsiniz." -ForegroundColor Green
}

Write-Host "Cursor Quick Start tamamlandi!" -ForegroundColor Green
