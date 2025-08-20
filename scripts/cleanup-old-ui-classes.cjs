const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Temizlenecek eski class'lar
const OLD_CLASSES = {
    'gacorporate-modal-body': 'space-y-4', // Yanlış yazılmış class
    'corporate-form': 'space-y-6', // Eski form class'ı
    'corporate-modal-body': 'p-6 bg-card rounded-lg border', // Eski modal class'ı
    'corporate-form-group': 'space-y-2', // Eski form group class'ı
    'corporate-form-label': 'block text-sm font-medium text-foreground', // Eski label class'ı
    'corporate-form-input': 'w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring', // Eski input class'ı
    'corporate-form-textarea': 'w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring', // Eski textarea class'ı
    'corporate-form-select': 'w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring', // Eski select class'ı
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
        for (const [oldClass, newClass] of Object.entries(OLD_CLASSES)) {
            const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
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
    console.log('🧹 Eski UI/UX Class\'larını Temizleme Başlıyor...\n');

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

    console.log('🎉 Temizleme Tamamlandı!');
    console.log(`📊 Özet:`);
    console.log(`   - Toplam dosya: ${totalFiles}`);
    console.log(`   - Güncellenen dosya: ${changedFiles}`);
    console.log(`   - Değişmeyen dosya: ${totalFiles - changedFiles}`);

    // Temizlenen class'ların listesi
    console.log(`\n🗑️  Temizlenen Class'lar:`);
    for (const [oldClass, newClass] of Object.entries(OLD_CLASSES)) {
        console.log(`   - ${oldClass} → ${newClass}`);
    }
}

// Script'i çalıştır
if (require.main === module) {
    main();
}

module.exports = { cleanupFile, OLD_CLASSES };
