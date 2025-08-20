# AI Agent ve Terminal Kuralları ve Ayarları

## 📋 Genel Kurallar

### 🤖 AI Agent Kuralları

#### 1. Performans Kuralları
- AI agent her zaman `optimized` modda çalışmalı
- Maksimum response time: 5 saniye
- Context limit: 8192 token
- Parallel processing aktif olmalı

#### 2. Cache Kuralları  
- AI responses cache edilmeli
- Cache boyutu: 512MB
- Cache süresi: 30 dakika
- Duplicate requests önlenmeli

#### 3. Memory Management
- Memory limit: 2GB
- Garbage collection: frequent
- Memory leak detection aktif
- Automatic cleanup her 10 dakikada

#### 4. Network Kuralları
- Timeout: 10 saniye
- Retry count: 3
- Compression aktif
- Connection pooling kullanılmalı

### 🖥️ Terminal Kuralları

#### 1. Performance Kuralları
- Node.js memory limit: 4GB
- Source maps disable edilmeli
- Telemetry kapatılmalı
- Progress bars gizlenmeli

#### 2. Environment Variables
```powershell
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings --disable-source-maps"
$env:NODE_ENV = "development"
$env:VITE_DISABLE_TELEMETRY = "1"
$env:GENERATE_SOURCEMAP = "false"
```

#### 3. PowerShell Optimizations
- Buffer size: 120x5000
- Window size: 120x30
- Progress preference: SilentlyContinue
- Cursor size: 0

## ⚙️ Konfigürasyon Ayarları

### AI Agent Ayarları
```json
{
  "ai_agent": {
    "mode": "optimized",
    "cache_enabled": true,
    "parallel_processing": true,
    "memory_limit_mb": 2048,
    "response_timeout_ms": 5000,
    "context_limit": 8192,
    "performance_tracking": true,
    "network_timeout_ms": 10000,
    "retry_count": 3,
    "compression": true
  }
}
```

### Terminal Ayarları
```json
{
  "terminal": {
    "node_memory_mb": 4096,
    "disable_source_maps": true,
    "disable_telemetry": true,
    "disable_warnings": true,
    "progress_silent": true,
    "buffer_size": [120, 5000],
    "window_size": [120, 30]
  }
}
```

## 🚀 Kullanım Kuralları

### Geliştirme Ortamı
1. Her session başında `npm run terminal:optimize` çalıştırın
2. AI agent kullanmadan önce `npm run ai:agent` çalıştırın
3. Performance sorunlarında `npm run cleanup` kullanın

### Build Optimizasyonu  
1. Production build öncesi `npm run analyze:ultimate` çalıştırın
2. Bundle size monitoring aktif tutun
3. Code splitting kurallarına uyun

### Debug Kuralları
1. AI agent hataları log edilmeli
2. Performance metrics track edilmeli  
3. Memory usage monitör edilmeli

## 📊 Monitoring Kuralları

### AI Agent Monitoring
- Response time tracking
- Cache hit ratio
- Memory usage
- Error rate
- Context utilization

### Terminal Monitoring
- CPU usage
- Memory consumption
- Network activity
- Build times
- Error logs

## 🔧 Maintenance Kuralları

### Günlük
- Cache temizliği
- Log rotation
- Temporary files cleanup
- Performance metrics review

### Haftalık  
- Dependency updates kontrolü
- Bundle size analizi
- Performance trend analizi
- AI agent efficiency review

### Aylık
- Full system cleanup
- Configuration review
- Performance baseline update
- Rule effectiveness assessment

## 🎯 Performance Hedefleri

### AI Agent
- Response time < 5s
- Cache hit ratio > 80%
- Memory usage < 2GB
- Error rate < 1%

### Terminal  
- Build time < 30s
- Memory usage < 4GB
- CPU usage < 70%
- Network latency < 100ms

## 🔍 Troubleshooting Kuralları

### AI Agent Sorunları
1. Cache clear: `$env:AI_AGENT_CACHE = "clear"`
2. Memory reset: Restart session
3. Network issues: Check timeout settings
4. Performance düşüklüğü: Parallel processing kontrol

### Terminal Sorunları  
1. Memory leak: `npm run cleanup`
2. Build errors: Type check çalıştır
3. Slow performance: Terminal optimize et
4. Hanging processes: PowerShell restart

## 📝 Log Kuralları

### AI Agent Logs
- Request/response times
- Cache statistics  
- Error details
- Performance metrics

### Terminal Logs
- Build output
- Error messages
- Performance data
- Environment variables

## 🛡️ Security Kuralları

### AI Agent Security
- API key güvenliği
- Data encryption
- Session isolation
- Audit logging

### Terminal Security
- Script execution policy
- Environment isolation
- Sensitive data protection
- Access control
