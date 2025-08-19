# Kod Kalitesi Standartları

Bu dokümantasyon, projenin kod kalitesi standartlarını ve best practices'lerini tanımlar.

## 🎯 Genel Prensipler

### 1. TypeScript Kullanımı
- Tüm yeni kod TypeScript ile yazılmalı
- `any` tipi kullanımından kaçınılmalı
- Interface'ler ve type'lar tanımlanmalı
- Strict mode aktif olmalı

### 2. React Best Practices
- Functional component'ler tercih edilmeli
- Hook'lar doğru kullanılmalı (useEffect dependencies)
- React.memo ile gereksiz re-render'lar önlenmeli
- useCallback ve useMemo ile performans optimize edilmeli

### 3. Kod Organizasyonu
- Dosya isimleri PascalCase (component'ler) veya camelCase
- Klasör yapısı mantıklı olmalı
- Import'lar düzenli olmalı
- Dead code temizlenmeli

## 📁 Dosya Yapısı

```
src/
├── components/          # React component'leri
│   ├── ui/             # Temel UI component'leri
│   ├── forms/          # Form component'leri
│   └── layout/         # Layout component'leri
├── hooks/              # Custom hook'lar
├── lib/                # Utility fonksiyonları
│   ├── utils.ts        # Genel utility'ler
│   ├── performance.ts  # Performance monitoring
│   └── testUtils.ts    # Test utilities
├── types/              # TypeScript type tanımları
├── utils/              # Yardımcı fonksiyonlar
├── services/           # API servisleri
├── store/              # State management
└── contexts/           # React context'leri
```

## 🔧 Kod Standartları

### Naming Conventions
```typescript
// ✅ Doğru
const UserProfile = () => { }
const useUserData = () => { }
const handleSubmit = () => { }
const isUserActive = true

// ❌ Yanlış
const userProfile = () => { }
const getUserData = () => { }
const submit = () => { }
const userActive = true
```

### Component Structure
```typescript
// ✅ Önerilen yapı
import React, { useState, useEffect, useCallback } from 'react'
import { SomeIcon } from 'lucide-react'

interface ComponentProps {
  title: string
  onAction?: () => void
}

const Component = React.memo<ComponentProps>(({ title, onAction }) => {
  const [state, setState] = useState('')
  
  const handleClick = useCallback(() => {
    onAction?.()
  }, [onAction])
  
  useEffect(() => {
    // Effect logic
  }, [])
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  )
})

Component.displayName = 'Component'
export default Component
```

### Error Handling
```typescript
// ✅ Doğru error handling
import { handleError } from '@/lib/utils'

try {
  const result = await apiCall()
  return result
} catch (error) {
  const errorMessage = handleError(error, 'ComponentName')
  console.error('API call failed:', errorMessage)
  throw new Error(errorMessage)
}

// ❌ Yanlış
try {
  const result = await apiCall()
  return result
} catch (error) {
  console.log(error) // Yetersiz error handling
}
```

## 🚀 Performans Optimizasyonları

### 1. React.memo Kullanımı
```typescript
// ✅ Performans için memo kullanımı
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* Expensive rendering */}</div>
})
```

### 2. useCallback ve useMemo
```typescript
// ✅ Gereksiz re-render'ları önleme
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data)
}, [data])

const memoizedCallback = useCallback(() => {
  handleAction(data)
}, [data])
```

### 3. Performance Monitoring
```typescript
// ✅ Performance monitoring kullanımı
import { usePerformanceMonitoring } from '@/lib/performance'

const MyComponent = () => {
  const { measureRender, measureAsync } = usePerformanceMonitoring('MyComponent')
  
  const handleAsyncOperation = async () => {
    return measureAsync('fetchData', async () => {
      const data = await fetch('/api/data')
      return data.json()
    })
  }
  
  return measureRender(() => (
    <div>{/* Component content */}</div>
  ))
}
```

### 4. Lazy Loading
```typescript
// ✅ Code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'))

// ✅ Route-based splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
```

## 🧪 Test Standartları

### Unit Test'ler
```typescript
// ✅ Test örneği
import { render, screen, fireEvent } from '@/lib/testUtils'
import { generateMockUser } from '@/lib/testUtils'

describe('Component', () => {
  it('should render correctly', () => {
    const mockUser = generateMockUser({ name: 'Test User' })
    render(<Component user={mockUser} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
  
  it('should handle user interaction', () => {
    const mockFn = jest.fn()
    render(<Component onAction={mockFn} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockFn).toHaveBeenCalled()
  })
})
```

### Test Coverage
```typescript
// ✅ Coverage tracking
import { coverageTracker } from '@/lib/testUtils'

describe('Component Coverage', () => {
  afterEach(() => {
    coverageTracker.recordCoverage('Component', {
      component: 'Component',
      lines: 85,
      branches: 70,
      functions: 90,
      statements: 80
    })
  })
})
```

## 📊 Code Quality Metrics

### ESLint Kuralları
- `no-unused-vars`: Kullanılmayan değişkenler
- `react-hooks/exhaustive-deps`: Hook dependency'leri
- `@typescript-eslint/no-explicit-any`: Any tipi kullanımı
- `react/no-unescaped-entities`: Unescaped karakterler
- `no-console`: Console kullanımı (production'da uyarı)
- `no-alert`: Alert kullanımı (production'da uyarı)

### Prettier Konfigürasyonu
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Performance Metrics
- Bundle size: < 2MB
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🔍 Code Review Checklist

### Genel Kontroller
- [ ] TypeScript tip güvenliği
- [ ] React best practices
- [ ] Performance optimizasyonları
- [ ] Error handling
- [ ] Accessibility (a11y)
- [ ] Security considerations

### Component Kontrolleri
- [ ] Props interface tanımlı
- [ ] React.memo kullanımı (gerekiyorsa)
- [ ] Hook dependency'leri doğru
- [ ] Event handler'lar optimize edilmiş
- [ ] Conditional rendering mantıklı

### API ve Data Kontrolleri
- [ ] Error handling mevcut
- [ ] Loading state'leri
- [ ] Data validation
- [ ] Type safety
- [ ] Caching stratejileri

### Performance Kontrolleri
- [ ] Performance monitoring kullanımı
- [ ] Bundle size kontrolü
- [ ] Memory leak kontrolü
- [ ] Render optimization

## 🛠️ Development Tools

### VS Code Extensions
- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- Error Lens
- GitLens

### Git Hooks
```bash
# Pre-commit hook örneği
npm run lint
npm run type-check
npm run test
npm run build
```

### Performance Tools
- React DevTools Profiler
- Lighthouse CI
- Bundle Analyzer
- Performance Monitor

## 📈 Monitoring ve Analytics

### Performance Monitoring
- Bundle size tracking
- Runtime performance
- Memory usage
- Network requests
- User interactions

### Error Tracking
- Sentry integration
- Error boundaries
- Logging strategy
- Performance monitoring

### Code Quality Metrics
- Test coverage
- ESLint warnings/errors
- TypeScript strictness
- Bundle size trends

## 🔄 Continuous Improvement

### Regular Reviews
- Weekly code quality reviews
- Performance audits
- Security assessments
- Accessibility audits
- Test coverage reviews

### Metrics Tracking
- Code coverage trends
- Bundle size monitoring
- Performance scores
- Error rates
- User experience metrics

### Automated Checks
- CI/CD pipeline integration
- Automated testing
- Code quality gates
- Performance budgets
- Security scanning

## 🚀 Yeni Eklenen Özellikler

### Performance Monitoring
```typescript
// Performance monitoring sistemi eklendi
import { performanceMonitor } from '@/lib/performance'

// Component render time ölçümü
performanceMonitor.measureRenderTime('ComponentName', () => {
  // Component render logic
})

// Async operation ölçümü
await performanceMonitor.measureAsyncOperation('apiCall', async () => {
  return await fetch('/api/data')
})
```

### Test Utilities
```typescript
// Gelişmiş test utilities
import { 
  render, 
  generateMockUser, 
  generateMockBeneficiary,
  coverageTracker 
} from '@/lib/testUtils'

// Mock data generation
const mockUser = generateMockUser({ name: 'Test User' })
const mockBeneficiary = generateMockBeneficiary({ category: 'orphan' })

// Coverage tracking
coverageTracker.recordCoverage('Component', {
  component: 'Component',
  lines: 85,
  branches: 70,
  functions: 90,
  statements: 80
})
```

### Error Handling
```typescript
// Gelişmiş error handling
import { handleError, isNonNullable, assertNonNullable } from '@/lib/utils'

// Safe error handling
const errorMessage = handleError(error, 'ComponentName')

// Type safety
if (isNonNullable(data)) {
  // data is guaranteed to be non-null
}

// Runtime assertions
assertNonNullable(user, 'User must be defined')
```

---

Bu dokümantasyon sürekli güncellenmeli ve proje ihtiyaçlarına göre genişletilmelidir.
