const fs = require('fs');
const glob = require('glob');

// Kapsamlı temizleme için class mapping
const COMPREHENSIVE_CLASS_MAPPING = {
    // Corporate color system → Modern semantic colors
    'corporate-primary-50': 'bg-primary/5',
    'corporate-primary-100': 'bg-primary/10',
    'corporate-primary-200': 'bg-primary/20',
    'corporate-primary-300': 'bg-primary/30',
    'corporate-primary-400': 'bg-primary/40',
    'corporate-primary-500': 'bg-primary',
    'corporate-primary-600': 'bg-primary',
    'corporate-primary-700': 'bg-primary/80',
    'corporate-primary-800': 'bg-primary/90',
    'corporate-primary-900': 'bg-primary/95',

    'text-corporate-primary-50': 'text-primary/5',
    'text-corporate-primary-100': 'text-primary/10',
    'text-corporate-primary-200': 'text-primary/20',
    'text-corporate-primary-300': 'text-primary/30',
    'text-corporate-primary-400': 'text-primary/40',
    'text-corporate-primary-500': 'text-primary',
    'text-corporate-primary-600': 'text-primary',
    'text-corporate-primary-700': 'text-primary/80',
    'text-corporate-primary-800': 'text-primary/90',
    'text-corporate-primary-900': 'text-primary/95',

    'border-corporate-primary-50': 'border-primary/5',
    'border-corporate-primary-100': 'border-primary/10',
    'border-corporate-primary-200': 'border-primary/20',
    'border-corporate-primary-300': 'border-primary/30',
    'border-corporate-primary-400': 'border-primary/40',
    'border-corporate-primary-500': 'border-primary',
    'border-corporate-primary-600': 'border-primary',
    'border-corporate-primary-700': 'border-primary/80',
    'border-corporate-primary-800': 'border-primary/90',
    'border-corporate-primary-900': 'border-primary/95',

    // Secondary colors
    'corporate-secondary-50': 'bg-secondary/5',
    'corporate-secondary-100': 'bg-secondary/10',
    'corporate-secondary-200': 'bg-secondary/20',
    'corporate-secondary-300': 'bg-secondary/30',
    'corporate-secondary-400': 'bg-secondary/40',
    'corporate-secondary-500': 'bg-secondary',
    'corporate-secondary-600': 'bg-secondary',
    'corporate-secondary-700': 'bg-secondary/80',
    'corporate-secondary-800': 'bg-secondary/90',
    'corporate-secondary-900': 'bg-secondary/95',

    'text-corporate-secondary-50': 'text-secondary/5',
    'text-corporate-secondary-100': 'text-secondary/10',
    'text-corporate-secondary-200': 'text-secondary/20',
    'text-corporate-secondary-300': 'text-secondary/30',
    'text-corporate-secondary-400': 'text-secondary/40',
    'text-corporate-secondary-500': 'text-secondary',
    'text-corporate-secondary-600': 'text-secondary',
    'text-corporate-secondary-700': 'text-secondary/80',
    'text-corporate-secondary-800': 'text-secondary/90',
    'text-corporate-secondary-900': 'text-secondary/95',

    'border-corporate-secondary-50': 'border-secondary/5',
    'border-corporate-secondary-100': 'border-secondary/10',
    'border-corporate-secondary-200': 'border-secondary/20',
    'border-corporate-secondary-300': 'border-secondary/30',
    'border-corporate-secondary-400': 'border-secondary/40',
    'border-corporate-secondary-500': 'border-secondary',
    'border-corporate-secondary-600': 'border-secondary',
    'border-corporate-secondary-700': 'border-secondary/80',
    'border-corporate-secondary-800': 'border-secondary/90',
    'border-corporate-secondary-900': 'border-secondary/95',

    // Neutral colors → Muted colors
    'corporate-neutral-50': 'bg-muted',
    'corporate-neutral-100': 'bg-muted/80',
    'corporate-neutral-200': 'border-border',
    'corporate-neutral-300': 'border-border',
    'corporate-neutral-400': 'text-muted-foreground',
    'corporate-neutral-500': 'text-muted-foreground',
    'corporate-neutral-600': 'text-muted-foreground',
    'corporate-neutral-700': 'text-foreground',
    'corporate-neutral-800': 'text-foreground',
    'corporate-neutral-900': 'text-foreground',
    'corporate-neutral-950': 'bg-background',

    'text-corporate-neutral-50': 'text-muted',
    'text-corporate-neutral-100': 'text-muted/80',
    'text-corporate-neutral-200': 'text-border',
    'text-corporate-neutral-300': 'text-border',
    'text-corporate-neutral-400': 'text-muted-foreground',
    'text-corporate-neutral-500': 'text-muted-foreground',
    'text-corporate-neutral-600': 'text-muted-foreground',
    'text-corporate-neutral-700': 'text-foreground',
    'text-corporate-neutral-800': 'text-foreground',
    'text-corporate-neutral-900': 'text-foreground',
    'text-corporate-neutral-950': 'text-background',

    'border-corporate-neutral-50': 'border-muted',
    'border-corporate-neutral-100': 'border-muted/80',
    'border-corporate-neutral-200': 'border-border',
    'border-corporate-neutral-300': 'border-border',
    'border-corporate-neutral-400': 'border-muted-foreground',
    'border-corporate-neutral-500': 'border-muted-foreground',
    'border-corporate-neutral-600': 'border-muted-foreground',
    'border-corporate-neutral-700': 'border-foreground',
    'border-corporate-neutral-800': 'border-foreground',
    'border-corporate-neutral-900': 'border-foreground',
    'border-corporate-neutral-950': 'border-background',

    // Semantic colors
    'corporate-success': 'bg-green-500',
    'corporate-warning': 'bg-yellow-500',
    'corporate-danger': 'bg-red-500',
    'corporate-info': 'bg-blue-500',

    'text-corporate-success': 'text-green-500',
    'text-corporate-warning': 'text-yellow-500',
    'text-corporate-danger': 'text-red-500',
    'text-corporate-info': 'text-blue-500',

    'border-corporate-success': 'border-green-500',
    'border-corporate-warning': 'border-yellow-500',
    'border-corporate-danger': 'border-red-500',
    'border-corporate-info': 'border-blue-500',

    // Success variants
    'corporate-success-50': 'bg-green-50',
    'corporate-success-100': 'bg-green-100',
    'corporate-success-200': 'bg-green-200',
    'corporate-success-300': 'bg-green-300',
    'corporate-success-400': 'bg-green-400',
    'corporate-success-500': 'bg-green-500',
    'corporate-success-600': 'bg-green-600',
    'corporate-success-700': 'bg-green-700',
    'corporate-success-800': 'bg-green-800',
    'corporate-success-900': 'bg-green-900',

    'text-corporate-success-50': 'text-green-50',
    'text-corporate-success-100': 'text-green-100',
    'text-corporate-success-200': 'text-green-200',
    'text-corporate-success-300': 'text-green-300',
    'text-corporate-success-400': 'text-green-400',
    'text-corporate-success-500': 'text-green-500',
    'text-corporate-success-600': 'text-green-600',
    'text-corporate-success-700': 'text-green-700',
    'text-corporate-success-800': 'text-green-800',
    'text-corporate-success-900': 'text-green-900',

    // Warning variants
    'corporate-warning-50': 'bg-yellow-50',
    'corporate-warning-100': 'bg-yellow-100',
    'corporate-warning-200': 'bg-yellow-200',
    'corporate-warning-300': 'bg-yellow-300',
    'corporate-warning-400': 'bg-yellow-400',
    'corporate-warning-500': 'bg-yellow-500',
    'corporate-warning-600': 'bg-yellow-600',
    'corporate-warning-700': 'bg-yellow-700',
    'corporate-warning-800': 'bg-yellow-800',
    'corporate-warning-900': 'bg-yellow-900',

    'text-corporate-warning-50': 'text-yellow-50',
    'text-corporate-warning-100': 'text-yellow-100',
    'text-corporate-warning-200': 'text-yellow-200',
    'text-corporate-warning-300': 'text-yellow-300',
    'text-corporate-warning-400': 'text-yellow-400',
    'text-corporate-warning-500': 'text-yellow-500',
    'text-corporate-warning-600': 'text-yellow-600',
    'text-corporate-warning-700': 'text-yellow-700',
    'text-corporate-warning-800': 'text-yellow-800',
    'text-corporate-warning-900': 'text-yellow-900',

    // Accent colors
    'corporate-accent-50': 'bg-accent/5',
    'corporate-accent-100': 'bg-accent/10',
    'corporate-accent-200': 'bg-accent/20',
    'corporate-accent-300': 'bg-accent/30',
    'corporate-accent-400': 'bg-accent/40',
    'corporate-accent-500': 'bg-accent',
    'corporate-accent-600': 'bg-accent',
    'corporate-accent-700': 'bg-accent/80',
    'corporate-accent-800': 'bg-accent/90',
    'corporate-accent-900': 'bg-accent/95',

    'text-corporate-accent-50': 'text-accent/5',
    'text-corporate-accent-100': 'text-accent/10',
    'text-corporate-accent-200': 'text-accent/20',
    'text-corporate-accent-300': 'text-accent/30',
    'text-corporate-accent-400': 'text-accent/40',
    'text-corporate-accent-500': 'text-accent',
    'text-corporate-accent-600': 'text-accent',
    'text-corporate-accent-700': 'text-accent/80',
    'text-corporate-accent-800': 'text-accent/90',
    'text-corporate-accent-900': 'text-accent/95',

    // Special classes
    'corporate-sidebar-enhanced': 'border-border bg-background',
    'corporate-card': 'bg-card border border-border rounded-lg shadow-sm',
    'corporate-grid-1': 'grid grid-cols-1',
    'corporate-grid-2': 'grid grid-cols-2',
    'corporate-grid-3': 'grid grid-cols-3',
    'corporate-grid-4': 'grid grid-cols-4',
    'corporate-btn-primary': 'bg-primary text-primary-foreground hover:bg-primary/90',
    'corporate-btn-secondary': 'bg-secondary text-secondary-foreground hover:bg-secondary/90',

    // Focus states
    'focus:ring-corporate-primary-500': 'focus:ring-ring',
    'focus:border-corporate-primary-500': 'focus:border-ring',
    'focus:ring-corporate-secondary-500': 'focus:ring-ring',
    'focus:border-corporate-secondary-500': 'focus:border-ring',

    // Hover states
    'hover:bg-corporate-primary-50': 'hover:bg-primary/5',
    'hover:bg-corporate-primary-100': 'hover:bg-primary/10',
    'hover:bg-corporate-secondary-50': 'hover:bg-secondary/5',
    'hover:bg-corporate-secondary-100': 'hover:bg-secondary/10',
    'hover:bg-corporate-neutral-50': 'hover:bg-muted',
    'hover:text-corporate-primary-600': 'hover:text-primary',
    'hover:text-corporate-secondary-600': 'hover:text-secondary',
    'hover:border-corporate-primary-200': 'hover:border-primary/20',
    'hover:border-corporate-secondary-200': 'hover:border-secondary/20',
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
        for (const [oldClass, newClass] of Object.entries(COMPREHENSIVE_CLASS_MAPPING)) {
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
    console.log('🧹 Kapsamlı UI/UX Class Temizleme Başlıyor...\n');

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

    console.log('🎉 Kapsamlı Temizleme Tamamlandı!');
    console.log(`📊 Özet:`);
    console.log(`   - Toplam dosya: ${totalFiles}`);
    console.log(`   - Güncellenen dosya: ${changedFiles}`);
    console.log(`   - Değişmeyen dosya: ${totalFiles - changedFiles}`);

    // Temizlenen class kategorileri
    console.log(`\n🗑️  Temizlenen Class Kategorileri:`);
    console.log(`   - Corporate Primary Colors: 30+ class`);
    console.log(`   - Corporate Secondary Colors: 30+ class`);
    console.log(`   - Corporate Neutral Colors: 33+ class`);
    console.log(`   - Corporate Success Colors: 20+ class`);
    console.log(`   - Corporate Warning Colors: 20+ class`);
    console.log(`   - Corporate Accent Colors: 20+ class`);
    console.log(`   - Special Corporate Classes: 10+ class`);
    console.log(`   - Focus & Hover States: 15+ class`);
}

// Script'i çalıştır
if (require.main === module) {
    main();
}

module.exports = { cleanupFile, COMPREHENSIVE_CLASS_MAPPING };
