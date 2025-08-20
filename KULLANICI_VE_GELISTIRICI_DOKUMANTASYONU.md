# 📚 Dernek Yönetim Paneli - Kullanıcı ve Geliştirici Dokümantasyonu

## 📋 İçindekiler

1. [Kullanıcı Rehberi](#-kullanıcı-rehberi)
2. [Geliştirici Dokümantasyonu](#-geliştirici-dokümantasyonu)
3. [API Dokümantasyonu](#-api-dokümantasyonu)
4. [Deployment Rehberi](#-deployment-rehberi)
5. [Troubleshooting](#-troubleshooting)
6. [SSS](#-sık-sorulan-sorular)

---

# 👥 Kullanıcı Rehberi

## 🚀 Hızlı Başlangıç

### Sisteme Giriş

1. **Web tarayıcınızı açın** ve `https://dernekpanel.com` adresine gidin
2. **Giriş bilgilerinizi girin:**
   - E-posta adresiniz
   - Şifreniz
3. **"Giriş Yap"** butonuna tıklayın

> 💡 **İpucu:** İlk kez giriş yapıyorsanız, sistem yöneticinizden giriş bilgilerinizi alın.

### Ana Dashboard

Giriş yaptıktan sonra ana dashboard'da şunları göreceksiniz:

- **📊 Özet Kartları:** Toplam üye sayısı, aktif projeler, bu ay yapılan bağışlar
- **📈 Grafikler:** Aylık bağış trendleri, üye büyüme oranları
- **📋 Son Aktiviteler:** Sistem üzerindeki son işlemler
- **⚡ Hızlı Eylemler:** Sık kullanılan işlemler için kısayollar

---

## 👤 Üye Yönetimi

### Yeni Üye Ekleme

1. **Sol menüden "Üyeler"** sekmesine tıklayın
2. **"+ Yeni Üye"** butonuna tıklayın
3. **Gerekli bilgileri doldurun:**
   - Ad Soyad *(zorunlu)*
   - E-posta *(zorunlu)*
   - Telefon
   - Adres
   - Üyelik Tarihi
   - Üyelik Tipi (Aktif/Pasif/Onursal)
4. **"Kaydet"** butonuna tıklayın

### Üye Bilgilerini Düzenleme

1. **Üyeler listesinden** düzenlemek istediğiniz üyeyi bulun
2. **Üye adına tıklayın** veya **"✏️ Düzenle"** butonunu kullanın
3. **Bilgileri güncelleyin**
4. **"Güncelle"** butonuna tıklayın

### Üye Arama ve Filtreleme

- **🔍 Arama Kutusu:** Üye adı, e-posta veya telefon ile arama
- **📅 Tarih Filtreleri:** Üyelik tarihine göre filtreleme
- **🏷️ Durum Filtreleri:** Aktif, pasif veya onursal üyeler
- **📊 Sıralama:** Ad, tarih veya duruma göre sıralama

---

## 🎯 Yardım Faaliyetleri

### Yeni Faaliyet Oluşturma

1. **"Faaliyetler" > "+ Yeni Faaliyet"** menüsüne gidin
2. **Faaliyet bilgilerini girin:**
   - Faaliyet Adı
   - Açıklama
   - Başlangıç ve Bitiş Tarihleri
   - Hedef Kitle
   - Bütçe
   - Sorumlu Kişi
3. **"Oluştur"** butonuna tıklayın

### Faaliyet Takibi

- **📊 İlerleme Çubuğu:** Faaliyetin tamamlanma oranı
- **💰 Bütçe Takibi:** Harcanan ve kalan bütçe
- **👥 Katılımcı Sayısı:** Faaliyete katılan kişi sayısı
- **📝 Notlar:** Faaliyet ile ilgili özel notlar

---

## 💰 Bağış Yönetimi

### Bağış Kaydı

1. **"Bağışlar" > "+ Yeni Bağış"** menüsüne gidin
2. **Bağış bilgilerini girin:**
   - Bağışçı Bilgileri (Ad, e-posta, telefon)
   - Bağış Miktarı
   - Bağış Türü (Nakit, Ayni, Online)
   - Tarih
   - Açıklama
3. **"Kaydet"** butonuna tıklayın

### Bağış Raporları

- **📈 Aylık Rapor:** Ay bazında bağış özeti
- **👥 Bağışçı Analizi:** En çok bağış yapan kişiler
- **💹 Trend Analizi:** Bağış trendleri ve tahminler
- **📊 Kategori Dağılımı:** Bağış türlerine göre dağılım

---

## 📊 Raporlama

### Hazır Raporlar

1. **"Raporlar"** menüsüne gidin
2. **İstediğiniz rapor türünü seçin:**
   - Üye Raporu
   - Faaliyet Raporu
   - Bağış Raporu
   - Mali Durum Raporu
3. **Tarih aralığını belirleyin**
4. **"Rapor Oluştur"** butonuna tıklayın

### Özel Raporlar

- **🎯 Filtreler:** Özel kriterlere göre filtreleme
- **📋 Sütun Seçimi:** Gösterilecek bilgileri seçme
- **📈 Grafik Türleri:** Çubuk, pasta, çizgi grafikleri
- **📤 Dışa Aktarma:** Excel, PDF formatlarında indirme

---

# 💻 Geliştirici Dokümantasyonu

## 🏗️ Proje Yapısı

```
dernek-panel/
├── 📁 src/                    # Frontend kaynak kodları
│   ├── 📁 components/         # React bileşenleri
│   ├── 📁 pages/             # Sayfa bileşenleri
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 services/          # API servisleri
│   ├── 📁 utils/             # Yardımcı fonksiyonlar
│   ├── 📁 types/             # TypeScript tip tanımları
│   └── 📁 assets/            # Statik dosyalar
├── 📁 api/                    # Backend API
│   ├── 📁 routes/            # API rotaları
│   ├── 📁 middleware/        # Middleware fonksiyonları
│   ├── 📁 services/          # İş mantığı servisleri
│   ├── 📁 types/             # TypeScript tip tanımları
│   └── 📁 utils/             # Yardımcı fonksiyonlar
├── 📁 docs/                   # Dokümantasyon
├── 📁 tests/                  # Test dosyaları
└── 📁 deployment/             # Deployment konfigürasyonları
```

## 🚀 Geliştirme Ortamı Kurulumu

### Gereksinimler

- **Node.js:** v18.0.0 veya üzeri
- **npm:** v8.0.0 veya üzeri
- **Git:** v2.30.0 veya üzeri
- **PostgreSQL:** v14.0 veya üzeri (Supabase kullanıyorsanız gerekli değil)

### Kurulum Adımları

```bash
# 1. Projeyi klonlayın
git clone https://github.com/your-org/dernek-panel.git
cd dernek-panel

# 2. Frontend bağımlılıklarını yükleyin
npm install

# 3. Backend bağımlılıklarını yükleyin
cd api
npm install
cd ..

# 4. Environment dosyalarını oluşturun
cp .env.example .env
cp api/.env.example api/.env

# 5. Environment değişkenlerini düzenleyin
# .env ve api/.env dosyalarını kendi ayarlarınıza göre düzenleyin

# 6. Veritabanını başlatın (Supabase kullanıyorsanız gerekli değil)
npm run db:setup

# 7. Geliştirme sunucularını başlatın
npm run dev
```

### Environment Değişkenleri

#### Frontend (.env)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:3001

# App Configuration
VITE_APP_NAME="Dernek Yönetim Paneli"
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

#### Backend (api/.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

## 🧩 Bileşen Geliştirme

### React Bileşen Şablonu

```typescript
// src/components/ExampleComponent.tsx
import React from 'react';
import { cn } from '@/utils/cn';

interface ExampleComponentProps {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
  variant = 'primary',
  className,
  children,
}) => {
  return (
    <div 
      className={cn(
        'rounded-lg border p-4',
        variant === 'primary' && 'border-blue-200 bg-blue-50',
        variant === 'secondary' && 'border-gray-200 bg-gray-50',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-gray-600">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExampleComponent;
```

### Custom Hook Şablonu

```typescript
// src/hooks/useExample.ts
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface UseExampleOptions {
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useExample = (options: UseExampleOptions = {}) => {
  const { autoFetch = true, onSuccess, onError } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.getData();
      setData(result);
      
      onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
```

## 🔌 API Geliştirme

### Express Route Şablonu

```typescript
// api/routes/example.ts
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ExampleService } from '../services/ExampleService';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const exampleService = new ExampleService();

// GET /api/examples
router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    
    const result = await exampleService.getAll({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      userId: req.user.id,
    });
    
    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit),
      },
    });
  })
);

// POST /api/examples
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').isIn(['active', 'inactive']),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const data = await exampleService.create({
      ...req.body,
      createdBy: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      data,
      message: 'Example created successfully',
    });
  })
);

// PUT /api/examples/:id
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  [
    param('id').isUUID().withMessage('Invalid ID format'),
    body('title').optional().notEmpty(),
    body('description').optional().isString(),
    body('status').optional().isIn(['active', 'inactive']),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const data = await exampleService.update(id, {
      ...req.body,
      updatedBy: req.user.id,
    });
    
    res.json({
      success: true,
      data,
      message: 'Example updated successfully',
    });
  })
);

// DELETE /api/examples/:id
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  [
    param('id').isUUID().withMessage('Invalid ID format'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await exampleService.delete(id);
    
    res.json({
      success: true,
      message: 'Example deleted successfully',
    });
  })
);

export default router;
```

### Service Sınıfı Şablonu

```typescript
// api/services/ExampleService.ts
import { supabase } from '../config/supabase';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

interface CreateExampleData {
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  createdBy: string;
}

interface UpdateExampleData {
  title?: string;
  description?: string;
  status?: 'active' | 'inactive';
  updatedBy: string;
}

interface GetAllOptions {
  page: number;
  limit: number;
  search?: string;
  userId: string;
}

export class ExampleService {
  private tableName = 'examples';

  async getAll(options: GetAllOptions) {
    const { page, limit, search, userId } = options;
    const offset = (page - 1) * limit;

    try {
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error fetching examples:', error);
        throw new AppError('Failed to fetch examples', 500);
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        limit,
      };
    } catch (error) {
      logger.error('ExampleService.getAll error:', error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Example not found', 404);
        }
        logger.error('Error fetching example:', error);
        throw new AppError('Failed to fetch example', 500);
      }

      return data;
    } catch (error) {
      logger.error('ExampleService.getById error:', error);
      throw error;
    }
  }

  async create(data: CreateExampleData) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating example:', error);
        throw new AppError('Failed to create example', 500);
      }

      logger.info(`Example created: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('ExampleService.create error:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateExampleData) {
    try {
      // Check if example exists
      await this.getById(id);

      const { data: result, error } = await supabase
        .from(this.tableName)
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating example:', error);
        throw new AppError('Failed to update example', 500);
      }

      logger.info(`Example updated: ${id}`);
      return result;
    } catch (error) {
      logger.error('ExampleService.update error:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      // Check if example exists
      await this.getById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting example:', error);
        throw new AppError('Failed to delete example', 500);
      }

      logger.info(`Example deleted: ${id}`);
    } catch (error) {
      logger.error('ExampleService.delete error:', error);
      throw error;
    }
  }
}
```

## 🧪 Test Yazma

### Frontend Test Örneği

```typescript
// src/components/__tests__/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders with title', () => {
    render(<ExampleComponent title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with description when provided', () => {
    render(
      <ExampleComponent 
        title="Test Title" 
        description="Test Description" 
      />
    );
    
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    const { container } = render(
      <ExampleComponent title="Test" variant="secondary" />
    );
    
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('border-gray-200', 'bg-gray-50');
  });

  it('renders children when provided', () => {
    render(
      <ExampleComponent title="Test">
        <button>Child Button</button>
      </ExampleComponent>
    );
    
    expect(screen.getByRole('button', { name: 'Child Button' })).toBeInTheDocument();
  });
});
```

### Backend Test Örneği

```typescript
// api/tests/routes/example.test.ts
import request from 'supertest';
import { app } from '../../app';
import { supabase } from '../../config/supabase';
import { generateTestToken } from '../utils/auth';

describe('Example Routes', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Setup test user and token
    const testUser = await createTestUser();
    testUserId = testUser.id;
    authToken = generateTestToken(testUser);
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
  });

  describe('GET /api/examples', () => {
    it('should return examples list', async () => {
      const response = await request(app)
        .get('/api/examples')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter examples by search query', async () => {
      await createTestExample({ title: 'Searchable Example' });

      const response = await request(app)
        .get('/api/examples?search=Searchable')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].title).toContain('Searchable');
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/examples')
        .expect(401);
    });
  });

  describe('POST /api/examples', () => {
    it('should create new example', async () => {
      const exampleData = {
        title: 'Test Example',
        description: 'Test Description',
        status: 'active',
      };

      const response = await request(app)
        .post('/api/examples')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exampleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(exampleData.title);
      expect(response.body.data.description).toBe(exampleData.description);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/examples')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Title is required');
    });
  });
});

// Test utilities
async function createTestUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'test@example.com',
    password: 'testpassword',
    email_confirm: true,
  });

  if (error) throw error;
  return data.user;
}

async function createTestExample(data: any) {
  const { data: example, error } = await supabase
    .from('examples')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return example;
}

async function cleanupTestData() {
  await supabase.from('examples').delete().like('title', '%Test%');
  await supabase.auth.admin.deleteUser(testUserId);
}
```

---

# 🔌 API Dokümantasyonu

## 🔐 Kimlik Doğrulama

### Giriş Yapma

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Başarılı Yanıt:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Token Yenileme

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

### Çıkış Yapma

```http
POST /api/auth/logout
Authorization: Bearer jwt_access_token
```

## 👥 Üye API'leri

### Üyeleri Listele

```http
GET /api/members?page=1&limit=10&search=john
Authorization: Bearer jwt_access_token
```

**Yanıt:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+90 555 123 4567",
      "membershipType": "active",
      "joinDate": "2024-01-15T10:00:00Z",
      "address": {
        "street": "Example Street 123",
        "city": "Istanbul",
        "country": "Turkey"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### Üye Oluştur

```http
POST /api/members
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+90 555 987 6543",
  "membershipType": "active",
  "address": {
    "street": "Another Street 456",
    "city": "Ankara",
    "country": "Turkey"
  }
}
```

### Üye Güncelle

```http
PUT /api/members/:id
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "firstName": "Jane Updated",
  "membershipType": "inactive"
}
```

### Üye Sil

```http
DELETE /api/members/:id
Authorization: Bearer jwt_access_token
```

## 💰 Bağış API'leri

### Bağışları Listele

```http
GET /api/donations?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer jwt_access_token
```

### Bağış Oluştur

```http
POST /api/donations
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "donorId": "uuid",
  "amount": 1000,
  "currency": "TRY",
  "type": "cash",
  "description": "Monthly donation",
  "isAnonymous": false
}
```

## 🎯 Faaliyet API'leri

### Faaliyetleri Listele

```http
GET /api/activities?status=active
Authorization: Bearer jwt_access_token
```

### Faaliyet Oluştur

```http
POST /api/activities
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "title": "Yardım Kampanyası",
  "description": "Kış ayları için gıda yardımı",
  "startDate": "2024-12-01T09:00:00Z",
  "endDate": "2024-12-31T18:00:00Z",
  "budget": 50000,
  "targetAudience": "Muhtaç aileler",
  "responsiblePersonId": "uuid"
}
```

## 📊 Rapor API'leri

### Özet İstatistikler

```http
GET /api/reports/summary
Authorization: Bearer jwt_access_token
```

**Yanıt:**
```json
{
  "success": true,
  "data": {
    "totalMembers": 1250,
    "activeMembers": 980,
    "totalDonations": 125000,
    "thisMonthDonations": 15000,
    "activeActivities": 8,
    "completedActivities": 45
  }
}
```

### Bağış Raporu

```http
GET /api/reports/donations?period=monthly&year=2024
Authorization: Bearer jwt_access_token
```

---

# 🚀 Deployment Rehberi

## 🐳 Docker ile Deployment

### Production Build

```bash
# 1. Production build oluşturun
npm run build
cd api && npm run build && cd ..

# 2. Docker imajlarını oluşturun
docker build -t dernek-panel-frontend:latest .
docker build -t dernek-panel-backend:latest ./api

# 3. Docker Compose ile başlatın
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Konfigürasyonu

```bash
# Production environment dosyasını oluşturun
cp .env.example .env.production

# Gerekli değişkenleri düzenleyin
vim .env.production
```

## ☁️ Cloud Deployment

### AWS ECS Deployment

```bash
# 1. ECR'a imaj yükleyin
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.eu-west-1.amazonaws.com

docker tag dernek-panel-frontend:latest 123456789.dkr.ecr.eu-west-1.amazonaws.com/dernek-panel-frontend:latest
docker push 123456789.dkr.ecr.eu-west-1.amazonaws.com/dernek-panel-frontend:latest

# 2. ECS servisini güncelleyin
aws ecs update-service --cluster dernek-panel --service frontend --force-new-deployment
```

### Kubernetes Deployment

```bash
# 1. Kubernetes manifests'i uygulayın
kubectl apply -f k8s/

# 2. Deployment durumunu kontrol edin
kubectl rollout status deployment/frontend -n dernek-panel
kubectl rollout status deployment/backend -n dernek-panel

# 3. Servisleri kontrol edin
kubectl get services -n dernek-panel
```

---

# 🔧 Troubleshooting

## 🚨 Yaygın Sorunlar ve Çözümleri

### Frontend Sorunları

#### Problem: Sayfa yüklenmiyor
**Belirtiler:**
- Beyaz ekran
- Console'da JavaScript hataları
- Network hatası

**Çözümler:**
```bash
# 1. Cache'i temizleyin
npm run cleanup
npm install

# 2. Environment değişkenlerini kontrol edin
cat .env

# 3. Development server'ı yeniden başlatın
npm run dev
```

#### Problem: API bağlantı hatası
**Belirtiler:**
- "Network Error" mesajları
- 404 veya 500 hataları
- CORS hataları

**Çözümler:**
```bash
# 1. Backend servisinin çalıştığını kontrol edin
curl http://localhost:3001/health

# 2. API URL'ini kontrol edin
echo $VITE_API_URL

# 3. CORS ayarlarını kontrol edin
# api/middleware/cors.ts dosyasını inceleyin
```

### Backend Sorunları

#### Problem: Veritabanı bağlantı hatası
**Belirtiler:**
- "Connection refused" hataları
- Timeout hataları
- Authentication hataları

**Çözümler:**
```bash
# 1. Supabase bağlantısını test edin
node -e "console.log(process.env.SUPABASE_URL)"

# 2. Veritabanı erişimini test edin
npm run db:test

# 3. Environment değişkenlerini kontrol edin
cat api/.env
```

#### Problem: JWT token hataları
**Belirtiler:**
- "Invalid token" hataları
- "Token expired" hataları
- Authentication başarısız

**Çözümler:**
```bash
# 1. JWT secret'ları kontrol edin
echo $JWT_ACCESS_SECRET
echo $JWT_REFRESH_SECRET

# 2. Token süresini kontrol edin
# api/config/jwt.ts dosyasını inceleyin

# 3. Token'ı yeniden oluşturun
# Logout yapıp tekrar login olun
```

### Performance Sorunları

#### Problem: Yavaş sayfa yükleme
**Çözümler:**
```bash
# 1. Bundle analizi yapın
npm run analyze

# 2. Lighthouse audit çalıştırın
npm run lighthouse

# 3. Network tab'ını inceleyin
# Browser DevTools > Network
```

#### Problem: Yüksek memory kullanımı
**Çözümler:**
```bash
# 1. Memory leak'leri kontrol edin
npm run test:memory

# 2. Bundle size'ı optimize edin
npm run optimize

# 3. Lazy loading uygulayın
# Büyük component'ları lazy load edin
```

## 📊 Monitoring ve Debugging

### Log Analizi

```bash
# Frontend logs
npm run logs:frontend

# Backend logs
npm run logs:backend

# Production logs
docker logs dernek-panel-frontend
docker logs dernek-panel-backend
```

### Performance Monitoring

```bash
# Performance metrics
npm run metrics

# Health check
curl http://localhost:3001/health
curl http://localhost:5173/health
```

---

# ❓ Sık Sorulan Sorular

## 🔐 Güvenlik

**S: Şifremi nasıl değiştirebilirim?**
C: Profil sayfasından "Şifre Değiştir" seçeneğini kullanabilirsiniz. Mevcut şifrenizi girip yeni şifrenizi belirleyebilirsiniz.

**S: İki faktörlü kimlik doğrulama var mı?**
C: Evet, Profil > Güvenlik bölümünden 2FA'yı etkinleştirebilirsiniz.

**S: Hesabım kilitlendi, ne yapmalıyım?**
C: Sistem yöneticinizle iletişime geçin veya "Şifremi Unuttum" seçeneğini kullanın.

## 📊 Veri Yönetimi

**S: Verileri nasıl dışa aktarabilirim?**
C: Raporlar bölümünden istediğiniz veriyi Excel veya PDF formatında indirebilirsiniz.

**S: Silinen verileri geri getirebilir miyim?**
C: Silinen veriler 30 gün boyunca sistem tarafından saklanır. Sistem yöneticiniz bu süre içinde geri getirebilir.

**S: Toplu veri yükleme yapabilir miyim?**
C: Evet, Excel şablonunu indirip doldurduktan sonra "Toplu Yükleme" özelliğini kullanabilirsiniz.

## 🔧 Teknik Sorunlar

**S: Sistem çok yavaş çalışıyor, ne yapmalıyım?**
C: 
1. Tarayıcı cache'inizi temizleyin
2. Farklı bir tarayıcı deneyin
3. İnternet bağlantınızı kontrol edin
4. Sorun devam ederse teknik destek ile iletişime geçin

**S: Dosya yükleyemiyorum, neden?**
C: 
1. Dosya boyutunun 10MB'dan küçük olduğundan emin olun
2. Desteklenen formatları kontrol edin (JPG, PNG, PDF)
3. Tarayıcınızın dosya erişim izinlerini kontrol edin

**S: Mobil cihazda sorun yaşıyorum?**
C: 
1. Tarayıcınızı güncelleyin
2. Mobil uygulamayı deneyin
3. WiFi bağlantınızı kontrol edin

## 📱 Mobil Uygulama

**S: Mobil uygulama var mı?**
C: Şu anda responsive web tasarımı kullanıyoruz. Mobil uygulama geliştirme sürecindedir.

**S: Offline çalışabiliyor mu?**
C: Temel özellikler offline çalışabilir, ancak veri senkronizasyonu için internet bağlantısı gereklidir.

## 🔄 Güncellemeler

**S: Sistem ne sıklıkla güncellenir?**
C: Güvenlik güncellemeleri haftalık, özellik güncellemeleri aylık olarak yapılır.

**S: Yeni özellik talebinde bulunabilir miyim?**
C: Evet, "Geri Bildirim" bölümünden önerilerinizi iletebilirsiniz.

**S: Güncellemeler sırasında sistem erişilebilir mi?**
C: Küçük güncellemeler sırasında sistem erişilebilir kalır. Büyük güncellemeler önceden duyurulur.

---

## 📞 Destek ve İletişim

### 🆘 Teknik Destek
- **E-posta:** support@dernekpanel.com
- **Telefon:** +90 212 123 4567
- **Çalışma Saatleri:** Pazartesi-Cuma 09:00-18:00

### 📧 İletişim Kanalları
- **Genel Sorular:** info@dernekpanel.com
- **Satış:** sales@dernekpanel.com
- **Teknik:** tech@dernekpanel.com

### 🌐 Faydalı Bağlantılar
- **Ana Sayfa:** https://dernekpanel.com
- **Dokümantasyon:** https://docs.dernekpanel.com
- **Status Sayfası:** https://status.dernekpanel.com
- **GitHub:** https://github.com/dernekpanel

---

**📅 Dokümantasyon Tarihi:** $(date)  
**✍️ Hazırlayan:** AI Documentation Specialist  
**🔄 Son Güncelleme:** $(date)  
**📝 Versiyon:** 1.0.0

> Bu dokümantasyon sürekli güncellenmektedir. En güncel versiyonu için lütfen online dokümantasyonu kontrol edin.