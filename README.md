# Dernek Yönetim Paneli - Modern NGO Management System

Bu proje, dernek ve sivil toplum kuruluşları için geliştirilmiş modern bir yönetim panelidir.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js >= 18.0.0
- npm >= 9.0.0

### Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Projeyi başlatın:**
```bash
npm run dev
```

### Port Yapılandırması

- **Frontend (Vite):** http://localhost:5173
- **Backend API:** http://localhost:3001
- **HMR (Hot Module Replacement):** http://localhost:5174

## 📁 Proje Yapısı

```
neww/
├── src/                    # Frontend kaynak kodları
│   ├── components/         # React bileşenleri
│   ├── pages/             # Sayfa bileşenleri
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API servisleri
│   ├── store/             # Zustand store
│   ├── types/             # TypeScript tip tanımları
│   └── utils/             # Yardımcı fonksiyonlar
├── api/                   # Backend API
│   ├── routes/            # API rotaları
│   ├── middleware/        # Express middleware
│   ├── services/          # Backend servisleri
│   └── tests/             # API testleri
├── supabase/              # Supabase yapılandırması
└── scripts/               # Yardımcı scriptler
```

## 🛠️ Geliştirme Komutları

### Temel Komutlar
```bash
# Geliştirme sunucusunu başlat
npm run dev

# Sadece frontend'i başlat
npm run client:dev

# Sadece backend'i başlat
npm run server:dev

# Hızlı başlatma (optimizasyonlar ile)
npm run dev:fast
```

### Test Komutları
```bash
# Tüm testleri çalıştır
npm run test

# Test coverage raporu
npm run test:coverage

# E2E testleri
npm run test:e2e
```

### Build Komutları
```bash
# Production build
npm run build

# Bundle analizi
npm run analyze:bundle

# Performance analizi
npm run performance:analyze
```

### Linting ve Formatting
```bash
# ESLint kontrolü
npm run lint

# Otomatik düzeltme
npm run lint:fix

# TypeScript tip kontrolü
npm run type-check
```

## 🔧 Yapılandırma

### Environment Variables

`.env` dosyası oluşturun:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API
API_PORT=3001

# Development
NODE_ENV=development
```

### Vite Yapılandırması

Proje `vite.config.ts` dosyasında yapılandırılmıştır:
- Port: 5173
- HMR Port: 5174
- API Proxy: localhost:3001

## 🎯 Özellikler

- **Modern UI/UX:** Tailwind CSS ve Radix UI
- **Type Safety:** TypeScript ile tam tip güvenliği
- **State Management:** Zustand ile hafif state yönetimi
- **API Integration:** TanStack Query ile veri yönetimi
- **Form Handling:** React Hook Form + Zod validation
- **Real-time:** Supabase real-time özellikleri
- **Testing:** Vitest + Testing Library
- **Performance:** Bundle optimizasyonu ve lazy loading

## 🚀 Performance Optimizasyonları

Proje Cursor IDE için optimize edilmiştir:

- **Bundle Splitting:** Manuel chunk bölme
- **Tree Shaking:** Kullanılmayan kodları kaldırma
- **Lazy Loading:** Sayfa bazlı kod bölme
- **Caching:** Akıllı cache stratejileri
- **Compression:** Gzip ve Brotli sıkıştırma

## 📊 Monitoring ve Analytics

- **Bundle Analysis:** Rollup visualizer
- **Performance Monitoring:** Web Vitals
- **Error Tracking:** Sentry entegrasyonu
- **Analytics:** Custom analytics dashboard

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Sorunlarınız için:
- GitHub Issues kullanın
- Dokümantasyonu kontrol edin
- Community forumlarını ziyaret edin

---

**Not:** Bu proje localhost:5173 portunda çalışacak şekilde yapılandırılmıştır. Backend API localhost:3001 portunda çalışır. Eğer port değişikliği gerekirse `vite.config.ts`, `package.json` ve `api/server.ts` dosyalarını güncelleyin.
