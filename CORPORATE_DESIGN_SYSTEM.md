# Corporate Design System - Sidebar Aligned

## 🎯 Genel Bakış

Bu tasarım sistemi, mevcut Sidebar'ın görsel diline uyumlu, kurumsal ve profesyonel bir görünüm sağlamak için geliştirilmiştir. Sidebar'ın yapısına dokunulmadan, tüm diğer bileşenler bu tasarım diline uyumlu hale getirilmiştir.

## 🎨 Renk Paleti

### Primary Colors (Sidebar Blue)
```css
--corporate-primary-50: #F8FAFF   /* En açık ton */
--corporate-primary-100: #E6F0FF
--corporate-primary-200: #C2DBFF
--corporate-primary-300: #8FC5FF
--corporate-primary-400: #5CAFFF
--corporate-primary-500: #2E9EFF
--corporate-primary-600: #13467A   /* Ana marka rengi - Sidebar ile uyumlu */
--corporate-primary-700: #0F3866
--corporate-primary-800: #0A2A52
--corporate-primary-900: #061C3D   /* En koyu ton */
```

### Secondary Colors (Success Green)
```css
--corporate-secondary-50: #F0F9F4
--corporate-secondary-100: #D6F2E1
--corporate-secondary-200: #A8E6C4
--corporate-secondary-300: #6BD99A
--corporate-secondary-400: #2ECC71
--corporate-secondary-500: #1E8B57
--corporate-secondary-600: #166B43   /* Ana başarı rengi */
--corporate-secondary-700: #0F5132
--corporate-secondary-800: #0A3D26
--corporate-secondary-900: #062919
```

### Accent Colors (Energy Orange)
```css
--corporate-accent-50: #FEF9F2
--corporate-accent-100: #FDF0E0
--corporate-accent-200: #FAE1C2
--corporate-accent-300: #F5CC8F
--corporate-accent-400: #F0B75C
--corporate-accent-500: #E67E22
--corporate-accent-600: #D35400   /* Ana vurgu rengi */
--corporate-accent-700: #B45309
--corporate-accent-800: #954007
--corporate-accent-900: #762D04
```

### Neutral Colors (WCAG AAA Compliant)
```css
--corporate-neutral-50: #FAFBFC   /* En açık arka plan */
--corporate-neutral-100: #F1F5F9
--corporate-neutral-200: #E2E8F0   /* Border rengi */
--corporate-neutral-300: #CBD5E1
--corporate-neutral-400: #94A3B8   /* Placeholder text */
--corporate-neutral-500: #64748B   /* Muted text */
--corporate-neutral-600: #475569   /* Secondary text */
--corporate-neutral-700: #334155   /* Primary text */
--corporate-neutral-800: #1E293B
--corporate-neutral-900: #0F172A   /* En koyu text */
--corporate-neutral-950: #020617
```

### Semantic Colors
```css
--corporate-success: #166B43      /* Başarı durumları */
--corporate-warning: #D35400      /* Uyarı durumları */
--corporate-danger: #DC2626       /* Hata durumları */
--corporate-info: #13467A         /* Bilgi durumları */
```

## 📝 Tipografi

### Font Family
```css
--corporate-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
```css
--corporate-font-size-xs: 0.75rem;      /* 12px */
--corporate-font-size-sm: 0.875rem;     /* 14px */
--corporate-font-size-base: 1rem;       /* 16px */
--corporate-font-size-lg: 1.125rem;     /* 18px */
--corporate-font-size-xl: 1.25rem;      /* 20px */
--corporate-font-size-2xl: 1.5rem;      /* 24px */
--corporate-font-size-3xl: 1.875rem;    /* 30px */
--corporate-font-size-4xl: 2.25rem;     /* 36px */
```

### Font Weights
```css
--corporate-font-weight-light: 300;
--corporate-font-weight-normal: 400;
--corporate-font-weight-medium: 500;
--corporate-font-weight-semibold: 600;
--corporate-font-weight-bold: 700;
--corporate-font-weight-extrabold: 800;
```

## 📏 Spacing System

```css
--corporate-space-1: 0.25rem;     /* 4px */
--corporate-space-2: 0.5rem;      /* 8px */
--corporate-space-3: 0.75rem;     /* 12px */
--corporate-space-4: 1rem;        /* 16px */
--corporate-space-5: 1.25rem;     /* 20px */
--corporate-space-6: 1.5rem;      /* 24px */
--corporate-space-8: 2rem;        /* 32px */
--corporate-space-10: 2.5rem;     /* 40px */
--corporate-space-12: 3rem;       /* 48px */
--corporate-space-16: 4rem;       /* 64px */
--corporate-space-20: 5rem;       /* 80px */
```

## 🔲 Border Radius

```css
--corporate-radius-sm: 0.25rem;   /* 4px */
--corporate-radius-md: 0.375rem;  /* 6px */
--corporate-radius-lg: 0.5rem;    /* 8px */
--corporate-radius-xl: 0.75rem;   /* 12px */
--corporate-radius-2xl: 1rem;     /* 16px */
```

## 🌟 Shadows

```css
--corporate-shadow-sm: 0 1px 2px hsl(220 25% 8% / 0.05);
--corporate-shadow-md: 0 4px 6px hsl(220 25% 8% / 0.07), 0 2px 4px hsl(220 25% 8% / 0.06);
--corporate-shadow-lg: 0 10px 15px hsl(220 25% 8% / 0.1), 0 4px 6px hsl(220 25% 8% / 0.05);
--corporate-shadow-xl: 0 20px 25px hsl(220 25% 8% / 0.1), 0 10px 10px hsl(220 25% 8% / 0.04);
--corporate-shadow-focus: 0 0 0 3px hsl(var(--corporate-primary-500) / 0.2);
```

## 🧩 Bileşenler

### Corporate Card
```jsx
<div className="corporate-card">
  <div className="corporate-card-header">
    <h3 className="corporate-card-title">Başlık</h3>
    <p className="corporate-card-subtitle">Alt başlık</p>
  </div>
  <div className="corporate-card-content">
    İçerik buraya
  </div>
  <div className="corporate-card-footer">
    Footer içeriği
  </div>
</div>
```

### KPI Card
```jsx
<div className="kpi-card">
  <div className="flex items-center justify-between">
    <div>
      <p className="kpi-label">KPI Adı</p>
      <p className="kpi-value">1,234</p>
      <p className="kpi-change positive">+12.5%</p>
    </div>
    <div className="text-corporate-primary-600">
      <Icon className="h-8 w-8" />
    </div>
  </div>
</div>
```

### Corporate Button
```jsx
<button className="corporate-btn corporate-btn-primary corporate-btn-md">
  Buton Metni
</button>
```

#### Button Variants
- `corporate-btn-primary` - Ana buton (mavi)
- `corporate-btn-secondary` - İkincil buton (gri)
- `corporate-btn-success` - Başarı butonu (yeşil)
- `corporate-btn-danger` - Tehlike butonu (kırmızı)
- `corporate-btn-ghost` - Şeffaf buton
- `corporate-btn-outline` - Çerçeveli buton

#### Button Sizes
- `corporate-btn-sm` - Küçük
- `corporate-btn-md` - Orta (varsayılan)
- `corporate-btn-lg` - Büyük
- `corporate-btn-xl` - Çok büyük

### Corporate Form Elements
```jsx
<div className="corporate-form-group">
  <label className="corporate-form-label">Form Etiketi</label>
  <input className="corporate-form-input" placeholder="Placeholder" />
  <textarea className="corporate-form-textarea" />
  <select className="corporate-form-select">
    <option>Seçenek 1</option>
  </select>
</div>
```

### Corporate Table
```jsx
<table className="corporate-table">
  <thead className="corporate-table-header">
    <tr>
      <th className="corporate-table-header-cell">Başlık</th>
    </tr>
  </thead>
  <tbody>
    <tr className="corporate-table-row">
      <td className="corporate-table-cell">Veri</td>
    </tr>
  </tbody>
</table>
```

### Corporate Modal
```jsx
<div className="corporate-modal">
  <div className="corporate-modal-content">
    <div className="corporate-modal-header">
      <h2 className="corporate-modal-title">Modal Başlığı</h2>
    </div>
    <div className="corporate-modal-body">
      Modal içeriği
    </div>
    <div className="corporate-modal-footer">
      <button className="corporate-btn corporate-btn-primary">Tamam</button>
    </div>
  </div>
</div>
```

### Corporate Alert
```jsx
<div className="corporate-alert corporate-alert-success">
  Başarı mesajı
</div>

<div className="corporate-alert corporate-alert-warning">
  Uyarı mesajı
</div>

<div className="corporate-alert corporate-alert-danger">
  Hata mesajı
</div>

<div className="corporate-alert corporate-alert-info">
  Bilgi mesajı
</div>
```

### Corporate Badge
```jsx
<span className="corporate-badge corporate-badge-success">Başarı</span>
<span className="corporate-badge corporate-badge-warning">Uyarı</span>
<span className="corporate-badge corporate-badge-danger">Hata</span>
<span className="corporate-badge corporate-badge-info">Bilgi</span>
<span className="corporate-badge corporate-badge-neutral">Nötr</span>
```

### Corporate Progress
```jsx
<div className="corporate-progress">
  <div className="corporate-progress-bar" style={{ width: '75%' }}></div>
</div>

<div className="corporate-progress">
  <div className="corporate-progress-bar corporate-progress-success" style={{ width: '75%' }}></div>
</div>
```

### Quick Access Card
```jsx
<button className="corporate-quick-access">
  <div className="corporate-quick-access-icon bg-corporate-primary-600">
    <Icon className="w-6 h-6" />
  </div>
  <h4 className="corporate-quick-access-title">Başlık</h4>
  <p className="corporate-quick-access-description">Açıklama</p>
</button>
```

## 🎯 Kullanım Kuralları

### 1. Sidebar Uyumluluğu
- Sidebar'ın yapısına asla dokunulmamalı
- Tüm yeni bileşenler Sidebar'ın renk paletiyle uyumlu olmalı
- `--corporate-primary-600` ana marka rengi olarak kullanılmalı

### 2. Renk Kullanımı
- **Primary**: Ana aksiyonlar, butonlar, linkler
- **Secondary**: Başarı durumları, onaylar
- **Accent**: Uyarılar, dikkat çekici öğeler
- **Neutral**: Metin, arka planlar, sınırlar

### 3. Tipografi
- Başlıklar için `font-weight: 600` (semibold)
- Normal metin için `font-weight: 400` (normal)
- Vurgu için `font-weight: 500` (medium)

### 4. Spacing
- Bileşenler arası boşluk: `space-6` (24px)
- İç boşluklar: `space-4` (16px) veya `space-6` (24px)
- Küçük boşluklar: `space-2` (8px) veya `space-3` (12px)

### 5. Responsive Design
- Mobile-first yaklaşım
- Breakpoint'ler: `sm:`, `md:`, `lg:`, `xl:`
- Touch-friendly buton boyutları (min 44px)

## 🔧 Tailwind CSS Entegrasyonu

### Renk Kullanımı
```jsx
// Background colors
className="bg-corporate-primary-600"
className="bg-corporate-success"
className="bg-corporate-neutral-50"

// Text colors
className="text-corporate-neutral-900"
className="text-corporate-primary-600"
className="text-corporate-success"

// Border colors
className="border-corporate-neutral-200"
className="border-corporate-primary-500"
```

### Utility Classes
```jsx
// Focus ring
className="focus-ring-corporate"

// Hover effects
className="hover-lift"

// Glass effect
className="glass-corporate"
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  .corporate-card { margin: var(--corporate-space-2); }
  .corporate-card-content { padding: var(--corporate-space-4); }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet-specific styles */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Desktop-specific styles */
}
```

## 🌙 Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .corporate-card {
    background: hsl(var(--corporate-neutral-900));
    border-color: hsl(var(--corporate-neutral-700));
  }
  
  .corporate-form-input {
    background: hsl(var(--corporate-neutral-800));
    border-color: hsl(var(--corporate-neutral-600));
    color: hsl(var(--corporate-neutral-100));
  }
}
```

## ✅ Erişilebilirlik (WCAG AAA)

- Tüm renk kontrastları WCAG AAA standartlarında
- Focus states her zaman görünür
- Keyboard navigation desteği
- Screen reader uyumlu
- Touch target minimum 44px

## 🚀 Performans

- CSS custom properties kullanımı
- Minimal CSS bundle size
- GPU-accelerated animations
- Optimized font loading
- Efficient selectors

Bu tasarım sistemi, Sidebar'ın kurumsal havasını koruyarak tüm uygulamaya tutarlı ve profesyonel bir görünüm sağlar.
