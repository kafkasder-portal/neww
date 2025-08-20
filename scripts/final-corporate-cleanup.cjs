const fs = require('fs');
const glob = require('glob');

// Kalan corporate class'ları temizleme mapping
const FINAL_CORPORATE_CLEANUP = {
  // Badge classes
  'corporate-badge-success': 'bg-green-100 text-green-800 border-green-200',
  'corporate-badge-warning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'corporate-badge-danger': 'bg-red-100 text-red-800 border-red-200',
  'corporate-badge-info': 'bg-blue-100 text-blue-800 border-blue-200',
  'corporate-badge-neutral': 'bg-gray-100 text-gray-800 border-gray-200',
  
  // Table header classes
  'corporate-table-header': 'bg-gray-50',
  'corporate-table-header0': 'bg-gray-50',
  
  // Modal classes
  'corporate-modal-title': 'text-lg font-semibold text-foreground',
  
  // Progress classes
  'corporate-progress': 'w-full bg-gray-200 rounded-full h-2',
  
  // Empty state classes
  'corporate-empty': 'text-center py-8 text-muted-foreground',
  
  // Alert classes
  'corporate-alert': 'p-4 border rounded-lg',
  
  // CSS import removal
  "import './styles/corporate-ui-enhancement.css'": "// Removed corporate UI enhancement CSS",
};

// Temizlenecek dosya türleri
const FILE_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts'
];

function cleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Her eski class için değişiklik yap
    for (const [oldClass, newClass] of Object.entries(FINAL_CORPORATE_CLEANUP)) {
      const regex = new RegExp(`\\b${oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newClass);
        hasChanges = true;
        console.log(`  ✓ ${oldClass} → ${newClass}`);
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🧹 Final Corporate Class Temizleme Başlıyor...\n');
  
  let totalFiles = 0;
  let changedFiles = 0;
  
  // Tüm dosyaları bul
  let files = [];
  for (const pattern of FILE_PATTERNS) {
    files = files.concat(glob.sync(pattern, { cwd: process.cwd() }));
  }
  
  // Backup dosyalarını ve node_modules'u filtrele
  files = files.filter(file => 
    !file.includes('.backup') && 
    !file.includes('node_modules') && 
    !file.includes('dist')
  );
  
  console.log(`📁 ${files.length} dosya bulundu\n`);
  
  // Her dosyayı işle
  for (const file of files) {
    totalFiles++;
    console.log(`🔍 İşleniyor: ${file}`);
    
    if (cleanupFile(file)) {
      changedFiles++;
      console.log(`  ✅ Güncellendi\n`);
    } else {
      console.log(`  ⏭️  Değişiklik yok\n`);
    }
  }
  
  console.log('🎉 Final Corporate Temizleme Tamamlandı!');
  console.log(`📊 Özet:`);
  console.log(`   - Toplam dosya: ${totalFiles}`);
  console.log(`   - Güncellenen dosya: ${changedFiles}`);
  console.log(`   - Değişmeyen dosya: ${totalFiles - changedFiles}`);
  
  // Temizlenen class kategorileri
  console.log(`\n🗑️  Temizlenen Class Kategorileri:`);
  console.log(`   - Corporate Badge Classes: 5 class`);
  console.log(`   - Corporate Table Header Classes: 2 class`);
  console.log(`   - Corporate Modal Classes: 1 class`);
  console.log(`   - Corporate Progress Classes: 1 class`);
  console.log(`   - Corporate Empty State Classes: 1 class`);
  console.log(`   - Corporate Alert Classes: 1 class`);
  console.log(`   - CSS Import Removal: 1 item`);
}

// Script'i çalıştır
if (require.main === module) {
  main();
}

module.exports = { cleanupFile, FINAL_CORPORATE_CLEANUP };
