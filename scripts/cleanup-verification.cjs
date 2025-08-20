const fs = require('fs');
const glob = require('glob');

// Kontrol edilecek eski class'lar
const OLD_CLASSES = [
    'gacorporate-modal-body',
    'corporate-form',
    'corporate-modal-body',
    'corporate-form-group',
    'corporate-form-label',
    'corporate-form-input',
    'corporate-form-textarea',
    'corporate-form-select'
];

// Kontrol edilecek dosya türleri
const FILE_PATTERNS = [
    'src/**/*.tsx',
    'src/**/*.ts'
];

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const foundClasses = [];

        for (const oldClass of OLD_CLASSES) {
            const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
            if (regex.test(content)) {
                foundClasses.push(oldClass);
            }
        }

        return foundClasses;
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error.message);
        return [];
    }
}

function main() {
    console.log('🔍 Eski UI/UX Class\'lari Kontrol Ediliyor...\n');

    let totalFiles = 0;
    let filesWithOldClasses = 0;
    const remainingClasses = {};

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

    console.log(`📁 ${files.length} dosya kontrol ediliyor\n`);

    // Her dosyayı kontrol et
    for (const file of files) {
        totalFiles++;
        const foundClasses = checkFile(file);

        if (foundClasses.length > 0) {
            filesWithOldClasses++;
            console.log(`⚠️  ${file}:`);
            foundClasses.forEach(cls => {
                console.log(`   - ${cls}`);
                remainingClasses[cls] = (remainingClasses[cls] || 0) + 1;
            });
            console.log('');
        }
    }

    console.log('🎯 Kontrol Tamamlandi!');
    console.log(`📊 Özet:`);
    console.log(`   - Toplam dosya: ${totalFiles}`);
    console.log(`   - Eski class içeren dosya: ${filesWithOldClasses}`);
    console.log(`   - Temiz dosya: ${totalFiles - filesWithOldClasses}`);
    console.log(`   - Temizlik orani: ${((totalFiles - filesWithOldClasses) / totalFiles * 100).toFixed(1)}%`);

    if (filesWithOldClasses > 0) {
        console.log(`\n⚠️  Kalan Eski Class'lar:`);
        for (const [cls, count] of Object.entries(remainingClasses)) {
            console.log(`   - ${cls}: ${count} dosyada`);
        }
    } else {
        console.log(`\n✅ Tum eski class'lar basariyla temizlendi!`);
    }
}

// Script'i çalıştır
if (require.main === module) {
    main();
}

module.exports = { checkFile, OLD_CLASSES };
