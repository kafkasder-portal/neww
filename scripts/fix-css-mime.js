#!/usr/bin/env node

/**
 * CSS MIME Type Fix Script
 * Bu script CSS dosyalarının doğru MIME türü ile yüklenmesini sağlar
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CSS MIME Type Fix Script başlatılıyor...');

// CSS dosyalarını kontrol et
const cssFiles = [
    'src/styles/enhanced-design-system.css',
    'src/styles/enhanced-animations.css',
    'src/styles/responsive-utilities.css',
    'src/styles/corporate-design-system.css',
    'src/index.css'
];

console.log('📁 CSS dosyaları kontrol ediliyor...');

cssFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} mevcut`);
    } else {
        console.log(`❌ ${file} bulunamadı`);
    }
});

// Vite cache'ini temizle
const viteCachePath = path.join(process.cwd(), 'node_modules', '.vite');
if (fs.existsSync(viteCachePath)) {
    console.log('🗑️ Vite cache temizleniyor...');
    fs.rmSync(viteCachePath, { recursive: true, force: true });
    console.log('✅ Vite cache temizlendi');
}

// Dist klasörünü temizle
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
    console.log('🗑️ Dist klasörü temizleniyor...');
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('✅ Dist klasörü temizlendi');
}

console.log('🎉 CSS MIME Type Fix tamamlandı!');
console.log('💡 Development server\'ı yeniden başlatın: npm run client:dev');
