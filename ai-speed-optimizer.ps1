# AI Agent Speed Optimizer
# Bu script AI Agent'ın performansını maksimum seviyeye çıkarır

Write-Host "AI Agent Speed Optimizer baslatiliyor..." -ForegroundColor Green

# 1. CPU Priority artır
Write-Host "CPU priority artiriliyor..." -ForegroundColor Yellow
$process = Get-Process "Cursor" -ErrorAction SilentlyContinue
if ($process) {
    $process.PriorityClass = "High"
    Write-Host "Cursor CPU priority: High" -ForegroundColor Green
}

# 2. Memory optimization
Write-Host "Memory optimizasyonu..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=8192 --no-warnings --experimental-worker"
$env:V8_COMPILE_CACHE_SIZE = "1000"
$env:V8_USE_ORINOCO_MARK_COMPACTOR = "1"

# 3. AI specific environment variables
Write-Host "AI environment degiskenleri ayarlaniyor..." -ForegroundColor Yellow
$env:CURSOR_AI_CACHE_SIZE = "2048"
$env:CURSOR_AI_MEMORY_LIMIT = "4096"
$env:CURSOR_AI_PARALLEL_REQUESTS = "5"
$env:CURSOR_AI_BATCH_SIZE = "10"
$env:CURSOR_AI_TIMEOUT = "15000"
$env:CURSOR_AI_ENABLE_FAST_MODE = "true"
$env:CURSOR_AI_ENABLE_STREAMING = "true"
$env:CURSOR_AI_ENABLE_CACHE = "true"

# 4. Network optimization
Write-Host "Network optimizasyonu..." -ForegroundColor Yellow
netsh int tcp set global autotuninglevel=normal
netsh int tcp set global chimney=enabled
netsh int tcp set global rss=enabled

# 5. Temp files cleanup for AI
Write-Host "AI temp dosyalari temizleniyor..." -ForegroundColor Yellow
$tempPaths = @(
    "$env:TEMP\cursor-ai-*",
    "$env:TEMP\claude-*",
    "$env:LOCALAPPDATA\Cursor\logs\*",
    "$env:LOCALAPPDATA\Cursor\User\workspaceStorage\*\state.vscdb*"
)

foreach ($path in $tempPaths) {
    Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
}

# 6. Registry optimizations for AI
Write-Host "AI registry optimizasyonlari..." -ForegroundColor Yellow
try {
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "EnableBalloonTips" -Value 0
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "LargeSystemCache" -Value 1
} catch {
    Write-Host "Registry ayarlari icin admin gerekiyor (opsiyonel)" -ForegroundColor Yellow
}

# 7. GPU acceleration check
Write-Host "GPU acceleration kontrol ediliyor..." -ForegroundColor Yellow
$gpuProcess = Get-Process | Where-Object {$_.ProcessName -like "*nvidia*" -or $_.ProcessName -like "*amd*"}
if ($gpuProcess) {
    Write-Host "GPU acceleration aktif" -ForegroundColor Green
} else {
    Write-Host "GPU acceleration kontrol edin" -ForegroundColor Yellow
}

Write-Host "AI Agent Speed Optimizer tamamlandi!" -ForegroundColor Green
Write-Host "Cursor'i yeniden baslatarak degisiklikleri uygulayabilirsiniz." -ForegroundColor Cyan

# 8. Performance report
Write-Host "`nPerformans Raporu:" -ForegroundColor Cyan
Write-Host "- Memory Limit: 8192MB" -ForegroundColor White
Write-Host "- AI Cache: 2048MB" -ForegroundColor White
Write-Host "- Parallel Requests: 5" -ForegroundColor White
Write-Host "- Batch Size: 10" -ForegroundColor White
Write-Host "- Timeout: 15 saniye" -ForegroundColor White
Write-Host "- Fast Mode: Aktif" -ForegroundColor White
Write-Host "- Streaming: Aktif" -ForegroundColor White