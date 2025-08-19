# 🎨 Tasarım Sistemi - Dernek Yönetim Paneli

Bu dokümantasyon, projenin merkezi tasarım sistemini açıklar. Tüm UI/UX bileşenleri artık tek bir yerden yönetilir.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Kurulum](#kurulum)
- [Renk Sistemi](#renk-sistemi)
- [Tipografi](#tipografi)
- [Spacing](#spacing)
- [Bileşenler](#bileşenler)
- [Kullanım Örnekleri](#kullanım-örnekleri)
- [Migration Guide](#migration-guide)

## 🎯 Genel Bakış

### Neden Merkezi Tasarım Sistemi?

- ✅ **Tutarlılık**: Tüm bileşenler aynı renk ve tipografi kurallarını kullanır
- ✅ **Bakım Kolaylığı**: Renk değişiklikleri tek yerden yapılır
- ✅ **WCAG AA Uyumluluğu**: Erişilebilirlik standartlarına uygun
- ✅ **Type Safety**: TypeScript ile tam tip güvenliği
- ✅ **Performans**: Optimize edilmiş CSS custom properties

### Dosya Yapısı

```
src/
├── constants/
│   ├── design-system.ts    # 🆕 Ana tasarım sistemi
│   ├── colors.ts          # ⚠️ Deprecated
│   └── ui.ts              # ⚠️ Deprecated
├── hooks/
│   └── useDesignSystem.ts # 🆕 Tasarım sistemi hook'u
└── styles/
    └── optimized-system.css # CSS custom properties
```

## 🚀 Kurulum

### 1. Import Tasarım Sistemi

```typescript
// ✅ Yeni yöntem (Önerilen)
import { COLORS, STATUS, TYPOGRAPHY } from '@/constants/design-system'

// ❌ Eski yöntem (Deprecated)
import { CHART_COLORS } from '@/constants/colors'
```

### 2. Hook Kullanımı

```typescript
import { useDesignSystem } from '@/hooks/useDesignSystem'

function MyComponent() {
  const { colors, styles, utils } = useDesignSystem()
  
  return (
    <div style={styles.statusSuccess}>
      Başarılı işlem
    </div>
  )
}
```

## 🎨 Renk Sistemi

### Brand Colors (Marka Renkleri)

```typescript
import { COLORS } from '@/constants/design-system'

// Ana marka rengi
const primaryColor = COLORS.brand.primary

// Marka rengi tonları
const lightPrimary = COLORS.brand.primary50
const darkPrimary = COLORS.brand.primary900
```

### Semantic Colors (Anlamlı Renkler)

```typescript
// Durum renkleri
const successColor = COLORS.semantic.success
const warningColor = COLORS.semantic.warning
const dangerColor = COLORS.semantic.danger
const infoColor = COLORS.semantic.info
```

### Financial Colors (Finansal Renkler)

```typescript
// Finansal işlemler için
const incomeColor = COLORS.financial.income
const expenseColor = COLORS.financial.expense
const transferColor = COLORS.financial.transfer
const pendingColor = COLORS.financial.pending
```

### Chart Colors (Grafik Renkleri)

```typescript
// Grafikler için
const chartColor1 = COLORS.chart[1]
const chartColor2 = COLORS.chart[2]
// ... chartColor8
```

## 📝 Tipografi

### Font Families

```typescript
import { TYPOGRAPHY } from '@/constants/design-system'

const sansFont = TYPOGRAPHY.fontFamily.sans    // Inter
const monoFont = TYPOGRAPHY.fontFamily.mono    // JetBrains Mono
const displayFont = TYPOGRAPHY.fontFamily.display // Inter Display
```

### Font Sizes

```typescript
const smallText = TYPOGRAPHY.fontSize.sm      // 14px
const normalText = TYPOGRAPHY.fontSize.base   // 16px
const largeText = TYPOGRAPHY.fontSize.lg      // 18px
const headingText = TYPOGRAPHY.fontSize['2xl'] // 24px
```

### Typography Scale

```typescript
// Hazır tipografi stilleri
const h1Style = TYPOGRAPHY.scale.h1
const h2Style = TYPOGRAPHY.scale.h2
const bodyStyle = TYPOGRAPHY.scale.body
const captionStyle = TYPOGRAPHY.scale.caption
```

## 📏 Spacing

```typescript
import { SPACING } from '@/constants/design-system'

const smallSpace = SPACING[2]   // 8px
const mediumSpace = SPACING[4]  // 16px
const largeSpace = SPACING[8]   // 32px
```

## 🧩 Bileşenler

### Status Badges

```typescript
import { STATUS } from '@/constants/design-system'

// Status renkleri
const successStatus = STATUS.success
const warningStatus = STATUS.warning
const errorStatus = STATUS.error
const infoStatus = STATUS.info
```

### Component Patterns

```typescript
import { COMPONENTS } from '@/constants/design-system'

// Button stilleri
const buttonBase = COMPONENTS.button.base
const buttonPrimary = COMPONENTS.button.variants.default

// Card stilleri
const cardBase = COMPONENTS.card.base
const cardHeader = COMPONENTS.card.header
```

## 💡 Kullanım Örnekleri

### 1. Inline Styles ile

```typescript
import { useDesignSystem } from '@/hooks/useDesignSystem'

function StatusBadge({ status }: { status: 'success' | 'error' }) {
  const { styles } = useDesignSystem()
  
  return (
    <span style={status === 'success' ? styles.statusSuccess : styles.statusError}>
      {status === 'success' ? 'Başarılı' : 'Hata'}
    </span>
  )
}
```

### 2. Progress Bar

```typescript
function ProgressBar({ percentage }: { percentage: number }) {
  const { utils } = useDesignSystem()
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="h-2 rounded-full transition-all duration-300"
        style={utils.getProgressStyle(percentage)}
      />
    </div>
  )
}
```

### 3. Chart Colors

```typescript
import { COLORS } from '@/constants/design-system'

const chartData = [
  { name: 'Kategori 1', value: 100, fill: COLORS.chart[1] },
  { name: 'Kategori 2', value: 200, fill: COLORS.chart[2] },
  { name: 'Kategori 3', value: 300, fill: COLORS.chart[3] },
]
```

### 4. Financial Display

```typescript
function FinancialCard({ amount, type }: { amount: number, type: 'income' | 'expense' }) {
  const { styles } = useDesignSystem()
  
  return (
    <div style={type === 'income' ? styles.financialIncome : styles.financialExpense}>
      {formatCurrency(amount)}
    </div>
  )
}
```

## 🔄 Migration Guide

### Eski Kullanımdan Yeni Kullanıma Geçiş

#### 1. Renk Kullanımı

```typescript
// ❌ Eski
import { CHART_COLORS } from '@/constants/colors'
const color = '#ef4444'

// ✅ Yeni
import { COLORS } from '@/constants/design-system'
const color = COLORS.semantic.danger
```

#### 2. Inline Styles

```typescript
// ❌ Eski
<div style={{ color: '#22c55e', backgroundColor: '#f0fdf4' }}>

// ✅ Yeni
const { styles } = useDesignSystem()
<div style={styles.statusSuccess}>
```

#### 3. Chart Colors

```typescript
// ❌ Eski
const colors = ['#0088FE', '#00C49F', '#FFBB28']

// ✅ Yeni
const colors = [COLORS.chart[1], COLORS.chart[2], COLORS.chart[3]]
```

### Otomatik Migration Script

```bash
# Eski dosyaları güncelle
npm run migrate-design-system
```

## 🛠️ Utility Functions

### Color Conversion

```typescript
const { utils } = useDesignSystem()

// Hex'ten HSL'e dönüştürme
const hslColor = utils.hexToHsl('#ef4444')

// Progress bar stili
const progressStyle = utils.getProgressStyle(75, COLORS.semantic.success)

// Status badge stili
const badgeStyle = utils.getStatusBadgeStyle('success')
```

### Card Styles

```typescript
const cardStyle = utils.getCardStyle('success') // success, warning, error, info
```

## 🎯 Best Practices

### ✅ Doğru Kullanım

```typescript
// ✅ Tasarım sistemi kullan
import { COLORS } from '@/constants/design-system'
const color = COLORS.semantic.success

// ✅ Hook kullan
const { styles } = useDesignSystem()
<div style={styles.statusSuccess}>

// ✅ Type safety
const status: keyof typeof STATUS = 'success'
```

### ❌ Yanlış Kullanım

```typescript
// ❌ Hardcoded renkler
const color = '#22c55e'

// ❌ Eski import'lar
import { CHART_COLORS } from '@/constants/colors'

// ❌ Inline styles
<div style={{ color: '#ef4444' }}>
```

## 🔧 Geliştirme

### Yeni Renk Ekleme

```typescript
// 1. CSS custom property ekle (optimized-system.css)
--new-color: 220 85% 25%;

// 2. Design system'e ekle (design-system.ts)
export const COLORS = {
  // ... mevcut renkler
  new: {
    color: 'hsl(var(--new-color))',
  },
}
```

### Yeni Component Pattern

```typescript
export const COMPONENTS = {
  // ... mevcut bileşenler
  newComponent: {
    base: 'base-classes',
    variants: {
      primary: 'primary-variant',
      secondary: 'secondary-variant',
    },
  },
}
```

## 📚 Referanslar

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG AA Guidelines](https://www.w3.org/WAI/WCAG21/AA/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Katkıda Bulunma

1. Yeni renk veya bileşen eklerken tasarım sistemini kullanın
2. Inline styles yerine design system hook'unu tercih edin
3. Type safety için TypeScript kullanın
4. WCAG AA uyumluluğunu koruyun

---

**Not**: Bu tasarım sistemi sürekli geliştirilmektedir. Önerileriniz için issue açabilirsiniz.
