# 🚀 Cursor Performance Guide

Bu rehber Cursor'da yaşadığınız performans sorunlarını çözmek için hazırlanmıştır.

## 🔧 Hızlı Çözümler

### 1. Hızlı Başlatma
```bash
npm run cursor:quick
```

### 2. Optimize Edilmiş Geliştirme
```bash
npm run dev:cursor
```

### 3. Sadece Optimizasyon
```bash
npm run cursor:optimize
```

### 4. AI Agent Hızlandırma
```bash
npm run ai:agent
```

### 5. Sadece AI Speedup
```bash
npm run ai:speedup
```

## ⚡ Performans Optimizasyonları

### Vite Konfigürasyonu
- Port: 5176 (çakışmaları önlemek için)
- HMR Port: 5177
- File watching optimize edildi
- Backup dosyaları izleme dışında
- Gereksiz klasörler izleme dışında

### Terminal Optimizasyonları
- PowerShell kullanımı
- GPU acceleration aktif
- Shell integration kapalı
- Memory limit: 4096MB

### Cache Temizleme
- Vite cache
- TypeScript cache
- ESLint cache
- Test cache
- API cache

## 🛠️ Cursor Ayarları

### Settings > Performance
- Memory Limit: 4096MB
- Enable GPU Acceleration: ON
- Disable Telemetry: ON

### Settings > Editor
- Auto Save: afterDelay (2000ms)
- Format On Save: OFF (performans için)
- Format On Paste: OFF
- Format On Type: OFF

### Settings > TypeScript
- Include Package.json Auto Imports: OFF
- Auto Imports: OFF
- Update Imports On File Move: NEVER

### Settings > AI Agent
- Memory Limit: 8192MB
- Cache Size: 2GB
- Max Concurrent Tasks: 5
- Batch Commands: ON
- Parallel Execution: ON
- Fast Mode: ON
- Streaming: ON

## 🔍 Sorun Giderme

### Terminal Yavaş Çalışıyor
1. `npm run cursor:optimize` çalıştırın
2. Cursor'ı yeniden başlatın
3. Terminal'i yeniden açın

### Prompt Hatalı Okuyor
1. `.cursorrules` dosyasını kontrol edin
2. Cursor'ı yeniden başlatın
3. Chat'i temizleyin

### Auto Agent Çalışmıyor
1. `npm run ai:agent` çalıştırın
2. AI ayarlarını kontrol edin
3. Model seçimini kontrol edin
4. Memory limit'i 8192MB'a çıkarın
5. Cursor'ı yeniden başlatın

### Sürekli Yeni Terminal Açılıyor
1. Mevcut terminalleri kapatın
2. `npm run cursor:optimize` çalıştırın
3. Tek terminal kullanın

## 📋 Kullanışlı Komutlar

```bash
# AI Agent hızlandırma (TAVSİYE EDİLEN)
npm run ai:agent

# Hızlı başlatma
npm run cursor:quick

# Optimize edilmiş geliştirme
npm run dev:cursor

# Sadece AI speedup
npm run ai:speedup

# Sadece optimizasyon
npm run cursor:optimize

# Güvenli geliştirme
npm run dev:safe

# Temizlik
npm run cleanup
```

## 🎯 En İyi Uygulamalar

1. **Tek Terminal Kullanın**: Birden fazla terminal açmayın
2. **Cache Temizleyin**: Haftada bir `npm run cursor:optimize` çalıştırın
3. **Dosya İzlemeyi Sınırlayın**: Gereksiz dosyaları `.cursorrules`'a ekleyin
4. **Memory Limit**: 4096MB'ın altına düşmeyin
5. **GPU Acceleration**: Her zaman açık tutun

## 🚨 Acil Durumlar

### Cursor Tamamen Dondu
1. Task Manager'dan Cursor'ı kapatın
2. `npm run cursor:optimize` çalıştırın
3. Cursor'ı yeniden başlatın

### Port Çakışması
1. `npm run cursor:quick` çalıştırın
2. Otomatik port temizleme yapılacak

### Memory Sorunu
1. Memory limit'i 4096MB'a çıkarın
2. Gereksiz extension'ları kapatın
3. Cursor'ı yeniden başlatın

## 📞 Destek

Sorun devam ederse:
1. Bu rehberi tekrar okuyun
2. `npm run cursor:optimize` çalıştırın
3. Cursor'ı yeniden başlatın
4. Hala sorun varsa, terminal çıktısını paylaşın
