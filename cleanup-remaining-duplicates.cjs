const fs = require('fs');
const path = require('path');

console.log('🧹 Kalan duplikat dosyaları temizleme başlıyor...');

// Silme listesi
const filesToDelete = [
  // Timestamp dosyaları
  'vite.config.ts.timestamp-1755682397462-d70378fe51e98.mjs',
  
  // Geçici dosyalar
  'src/utils/tempFix.ts',
  
  // Script dosyaları (kullanılan)
  'fix-duplicate-imports.cjs',
  'scripts/cleanup-old-ui-classes.cjs',
  
  // Clean duplikatları
  'src/pages/definitions/PermissionGroupsClean.tsx',
];

// Wrapper dosyaları (bunlar gerçek duplikat mı yoksa gerekli mi kontrol et)
const wrapperFiles = [
  'src/components/loading/ModuleSuspenseWrapper.tsx',
  'src/pages/crm/CRMAnalyticsWrapper.tsx', 
  'src/pages/crm/CampaignManagementWrapper.tsx',
  'src/pages/crm/CommunicationHistoryWrapper.tsx',
  'src/pages/crm/DonorProfilesWrapper.tsx'
];

// Ana dosyaları sil
filesToDelete.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`✅ Silindi: ${file}`);
    } catch (error) {
      console.error(`❌ Silinemedi: ${file}`, error.message);
    }
  } else {
    console.log(`⚠️  Dosya bulunamadı: ${file}`);
  }
});

// Wrapper dosyalarını kontrol et
console.log('\n📋 Wrapper dosyaları kontrol ediliyor...');
wrapperFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`🔍 Mevcut: ${file}`);
    // Bu dosyaları şimdilik bırak, gerçek duplikat olup olmadığını kontrol et
  }
});

// Cleanup script dosyalarını da sil
const cleanupFiles = [
  'cleanup-backups.js',
  'cleanup-backups.cjs',
  'cleanup-remaining-duplicates.cjs'
];

cleanupFiles.forEach(file => {
  if (fs.existsSync(file) && file !== 'cleanup-remaining-duplicates.cjs') {
    try {
      fs.unlinkSync(file);
      console.log(`✅ Cleanup dosyası silindi: ${file}`);
    } catch (error) {
      console.error(`❌ Cleanup dosyası silinemedi: ${file}`, error.message);
    }
  }
});

console.log('\n✨ Duplikat temizleme işlemi tamamlandı!');
