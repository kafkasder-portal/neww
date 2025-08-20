const fs = require('fs');
const path = require('path');

function deleteBackupFiles(dir) {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // Recursive olarak alt klasörleri tara
        if (!item.name.startsWith('node_modules') && !item.name.startsWith('.git')) {
          deleteBackupFiles(fullPath);
        }
      } else if (item.isFile() && item.name.endsWith('.backup')) {
        // .backup uzantılı dosyaları sil
        try {
          fs.unlinkSync(fullPath);
          console.log(`✅ Silindi: ${fullPath}`);
        } catch (error) {
          console.error(`❌ Silinemedi: ${fullPath}`, error.message);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️  Klasör okunamadı: ${dir}`);
  }
}

// Backup klasörünü de sil
const backupDir = 'backup-corporate-ui-migration';
if (fs.existsSync(backupDir)) {
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
    console.log(`🗑️  Backup klasörü silindi: ${backupDir}`);
  } catch (error) {
    console.error(`❌ Backup klasörü silinemedi: ${backupDir}`, error.message);
  }
}

console.log('🧹 Backup dosyaları temizleme başlıyor...');

// Ana klasörden başla
deleteBackupFiles('./src');
deleteBackupFiles('./api');

console.log('✨ Backup dosyaları temizleme işlemi tamamlandı!');
