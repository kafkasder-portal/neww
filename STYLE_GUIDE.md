# Uygulama Stili Rehberi

## 📋 Kafkasder Yönetim Paneli - Tasarım Sistemi

### 🎨 Renk Sistemi

#### Ana Renkler
- **Background**: `#f8fafc` - Ana arka plan (çok beyaz hissini azaltan nötr ton)
- **Surface**: `#ffffff` - Kartlar ve modal arka planları
- **Border**: `#e2e8f0` - Kenarlık rengi

#### Metin Hiyerarşisi (WCAG AA Uyumlu)
- **ink-1**: `#0f172a` - Ana başlıklar (21:1 kontrast)
- **ink-2**: `#1e293b` - Gövde metni (16:1 kontrast)
- **ink-3**: `#475569` - İkincil metin (7:1 kontrast)
- **ink-4**: `#64748b` - Placeholder ve disabled (4.6:1 kontrast)

#### Marka Renkleri
- **Primary**: `#3b82f6` - Ana marka rengi
- **Success**: `#22c55e` - Başarı durumları
- **Warning**: `#f59e0b` - Uyarı durumları
- **Danger**: `#ef4444` - Hata durumları

### ✒️ Tipografi

#### Font Ailesi
- **Ana Font**: Inter (Google Fonts)
- **Yedek**: system-ui, -apple-system, sans-serif

#### Boyut Hiyerarşisi
- **H1**: 30px / font-weight: 700 / line-height: 1.25
- **H2**: 24px / font-weight: 600 / line-height: 1.25  
- **H3**: 20px / font-weight: 600 / line-height: 1.5
- **Body**: 16px / font-weight: 400 / line-height: 1.625
- **Caption**: 14px / font-weight: 400 / line-height: 1.5
- **Small**: 12px / font-weight: 500 / uppercase

#### Okunabilirlik Kuralları
- **Maksimum metin genişliği**: 72ch (optimal okuma)
- **Paragraf satır aralığı**: 1.625
- **Başlık satır aralığı**: 1.25

### 🔧 Spacing Sistemi

#### Spacing Scale (4px base)
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **6**: 24px
- **8**: 32px
- **12**: 48px
- **16**: 64px

#### Section Spacing
- **Küçük**: 24px
- **Orta**: 48px
- **Büyük**: 64px

### 📦 Container Sistemi

#### Maksimum Genişlikler
- **İçerik**: 1440px (uzun sayfalar için)
- **Metin**: 72ch (okunabilirlik için)
- **Okuma**: 65ch (optimal okuma deneyimi)

### 🎯 İkon Sistemi

#### Lucide React İkon Kütüphanesi
- **Varsayılan boyut**: 20px
- **Stroke genişliği**: 1.5-2
- **Buton ikonları**: 16px
- **Büyük ikonlar**: 24px

#### İkon Renk Kuralları
- **Varsayılan**: Metin rengiyle uyumlu
- **İkincil**: ink-3 rengi
- **Disabled**: ink-4 rengi

### 🎬 Animasyon Sistemi

#### Süre Tokenları
- **Hızlı**: 150ms
- **Normal**: 250ms
- **Yavaş**: 400ms

#### Easing Functions
- **Ease-out**: Hover ve focus geçişleri
- **Ease-in-out**: Modal ve drawer animasyonları

### 💫 Gölge Sistemi

#### Gölge Seviyeleri
- **Card**: `0 4px 6px -1px rgb(0 0 0 / 0.07)`
- **Header**: `0 1px 3px 0 rgb(0 0 0 / 0.1)`
- **Modal**: `0 20px 25px -5px rgb(0 0 0 / 0.1)`

### 🎲 Bileşen Kılavuzu

#### PageHeader
- **Kullanım**: Sayfa başlıkları için sticky header
- **Özellikler**: Breadcrumb, action buttons, subtitle desteği

#### StatCard  
- **Kullanım**: Dashboard istatistikleri
- **Özellikler**: İkon, trend göstergesi, renk temaları

#### EmptyState
- **Kullanım**: Boş durum mesajları
- **Özellikler**: İkon, başlık, açıklama, CTA button

#### Subnav
- **Kullanım**: Uzun sayfalarda alt navigasyon
- **Özellikler**: Sticky, tabs/pills varyantları

### ♿ Erişilebilirlik

#### Focus Management
- **Focus ring**: 2px solid primary renk
- **Offset**: 2px
- **Klavye navigasyonu**: Tüm interaktif elemanlarda

#### Kontrast Kuralları
- **Metin**: Minimum 4.5:1
- **Büyük metin**: Minimum 3:1
- **İkonlar**: Minimum 3:1

#### ARIA Özellikleri
- **Breadcrumb**: nav + aria-label="Breadcrumb"
- **Tabs**: role="tablist" + aria-selected
- **Buttons**: aria-label for icon-only buttons

### 📱 Responsive Kurallar

#### Breakpoints
- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1440px (max-content)

#### Grid Sistemı
- **1 kolon**: Mobil varsayılan
- **2 kolon**: Tablet (md+)
- **3 kolon**: Masaüstü (lg+)
- **4 kolon**: Geniş ekran (xl+)

## 🚀 Kullanım Örnekleri

### Sayfa Düzeni

```tsx
<AppShell>
  <PageHeader 
    title="Sayfa Başlığı"
    subtitle="Açıklayıcı alt başlık"
    breadcrumbs={[{label: 'Kategori'}]}
    actions={[{label: 'Yeni Oluştur', onClick: handler}]}
  />
  <AppContent>
    <PageSection title="Bölüm Başlığı">
      <ContentGrid columns={2}>
        {/* İçerik */}
      </ContentGrid>
    </PageSection>
  </AppContent>
</AppShell>
```

### İstatistik Kartları

```tsx
<StatCardGroup 
  cards={[
    {
      title: 'Toplam Kullanıcı',
      value: 1250,
      icon: <Users />,
      trend: {value: 12, direction: 'up'},
      color: 'primary'
    }
  ]}
  columns={4}
/>
```

### Boş Durum

```tsx
<EmptyState
  icon={<FileText />}
  title="Henüz veri yok"
  description="Bu bölümde gösterilecek veri bulunmuyor."
  action={{
    label: 'Yeni Oluştur',
    onClick: () => navigate('/new')
  }}
/>
```

## 🎯 Performans Optimizasyonları

### CSS Token Sistemi
- CSS custom properties ile tema desteği
- Tailwind extend ile token entegrasyonu
- Runtime değişken desteği

### Bundle Optimizasyonu
- İkon tree-shaking
- Component lazy loading
- Critical CSS inline

### Erişilebilirlik Optimizasyonları  
- Focus-visible polyfill
- Prefers-reduced-motion desteği
- High contrast mode hazırlığı

Bu rehber, Kafkasder Yönetim Paneli'nde tutarlı ve erişilebilir kullanıcı deneyimi sağlamak için tasarlandı.
