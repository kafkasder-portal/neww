const fs = require('fs');
const glob = require('glob');

// Ultimate corporate cleanup mapping
const ULTIMATE_CORPORATE_CLEANUP = {
  // Button classes
  'corporate-btn-success': 'bg-green-500 text-white hover:bg-green-600',
  'corporate-btn-danger': 'bg-red-500 text-white hover:bg-red-600',
  'corporate-btn-ghost': 'bg-transparent hover:bg-gray-100',
  'corporate-btn-outline': 'border border-gray-300 bg-transparent hover:bg-gray-50',
  'corporate-btn-sm': 'px-3 py-1 text-sm',
  'corporate-btn-md': 'px-4 py-2',
  'corporate-btn-lg': 'px-6 py-3 text-lg',
  'corporate-btn-xl': 'px-8 py-4 text-xl',
  'corporate-btn': 'px-4 py-2 rounded-md font-medium transition-colors',
  
  // Table classes
  'corporate-table': 'w-full border-collapse border border-gray-300',
  'corporate-table-loading': 'animate-pulse',
  'corporate-table-container': 'overflow-x-auto',
  'corporate-table-row': 'border-b border-gray-200 hover:bg-gray-50',
  'corporate-table-cell': 'px-4 py-2 text-left',
  
  // Modal classes
  'corporate-modal': 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
  'corporate-modal-content': 'bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto',
  'corporate-modal-header': 'px-6 py-4 border-b border-gray-200',
  'corporate-modal-footer': 'px-6 py-4 border-t border-gray-200 flex justify-end gap-2',
  
  // Badge classes
  'corporate-badge': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  
  // Quick access classes
  'corporate-quick-access': 'p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer',
  'corporate-quick-access-icon': 'w-12 h-12 rounded-lg flex items-center justify-center mb-3',
  'corporate-quick-access-title': 'text-lg font-semibold text-gray-900 mb-1',
  'corporate-quick-access-description': 'text-sm text-gray-600',
  
  // Statistics classes
  'corporate-statistics': 'p-4 border border-gray-200 rounded-lg',
  'corporate-statistics-header': 'flex items-center justify-between mb-2',
  'corporate-statistics-title': 'text-sm font-medium text-gray-600',
  'corporate-statistics-change': 'text-xs font-medium',
  'corporate-statistics-value': 'text-2xl font-bold text-gray-900',
  
  // Search classes
  'corporate-search': 'relative',
  'corporate-search-input': 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  'corporate-search-icon': 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400',
  
  // Container classes
  'corporate-container': 'max-w-7xl mx-auto',
  'corporate-header': 'mb-6',
  'corporate-title': 'text-3xl font-bold text-gray-900 mb-2',
  'corporate-subtitle': 'text-lg text-gray-600',
  
  // Text classes
  'text-corporate-text-primary': 'text-gray-900',
  'text-corporate-text-secondary': 'text-gray-600',
  'text-corporate-text-tertiary': 'text-gray-500',
  
  // Background classes
  'bg-corporate-gold': 'bg-yellow-400',
  'bg-corporate-silver': 'bg-gray-300',
  'bg-corporate-bronze': 'bg-orange-400',
  
  // Border classes
  'border-corporate-border': 'border-gray-200',
  
  // Alert classes
  'gacorporate-alert': 'bg-blue-50 border border-blue-200 rounded-lg',
  
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
    for (const [oldClass, newClass] of Object.entries(ULTIMATE_CORPORATE_CLEANUP)) {
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
  console.log('🧹 Ultimate Corporate Class Temizleme Başlıyor...\n');
  
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
  
  console.log('🎉 Ultimate Corporate Temizleme Tamamlandı!');
  console.log(`📊 Özet:`);
  console.log(`   - Toplam dosya: ${totalFiles}`);
  console.log(`   - Güncellenen dosya: ${changedFiles}`);
  console.log(`   - Değişmeyen dosya: ${totalFiles - changedFiles}`);
  
  // Temizlenen class kategorileri
  console.log(`\n🗑️  Temizlenen Class Kategorileri:`);
  console.log(`   - Corporate Button Classes: 9 class`);
  console.log(`   - Corporate Table Classes: 5 class`);
  console.log(`   - Corporate Modal Classes: 4 class`);
  console.log(`   - Corporate Badge Classes: 1 class`);
  console.log(`   - Corporate Quick Access Classes: 4 class`);
  console.log(`   - Corporate Statistics Classes: 5 class`);
  console.log(`   - Corporate Search Classes: 3 class`);
  console.log(`   - Corporate Container Classes: 4 class`);
  console.log(`   - Corporate Text Classes: 3 class`);
  console.log(`   - Corporate Background Classes: 3 class`);
  console.log(`   - Corporate Border Classes: 1 class`);
  console.log(`   - Corporate Alert Classes: 1 class`);
  console.log(`   - CSS Import Removal: 1 item`);
}

// Script'i çalıştır
if (require.main === module) {
  main();
}

module.exports = { cleanupFile, ULTIMATE_CORPORATE_CLEANUP };
