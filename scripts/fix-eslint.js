#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔧 ESLint Hızlı Düzeltme Başlatılıyor...\n');

// 1. Otomatik düzeltilebilir hataları düzelt
console.log('1️⃣ Otomatik düzeltilebilir hatalar düzeltiliyor...');
try {
    execSync('npx eslint . --fix', { stdio: 'inherit' });
    console.log('✅ Otomatik düzeltmeler tamamlandı\n');
} catch (error) {
    console.log('⚠️  Bazı hatalar otomatik düzeltilemedi\n');
}

// 2. Kullanılmayan import'ları temizle
console.log('2️⃣ Kullanılmayan import\'lar temizleniyor...');
try {
    execSync('npx eslint . --fix --rule "@typescript-eslint/no-unused-vars: error"', { stdio: 'inherit' });
    console.log('✅ Kullanılmayan import\'lar temizlendi\n');
} catch (error) {
    console.log('⚠️  Bazı import\'lar temizlenemedi\n');
}

// 3. Son durumu kontrol et
console.log('3️⃣ Son durum kontrol ediliyor...');
try {
    const result = execSync('npx eslint . --max-warnings 0', { encoding: 'utf8' });
    console.log('✅ Tüm ESLint hataları düzeltildi!');
} catch (error) {
    console.log('📊 Kalan hatalar:');
    console.log(error.stdout);

    // Hata sayısını hesapla
    const errorCount = (error.stdout.match(/error/g) || []).length;
    const warningCount = (error.stdout.match(/warning/g) || []).length;

    console.log(`\n📈 Özet:`);
    console.log(`   - Hatalar: ${errorCount}`);
    console.log(`   - Uyarılar: ${warningCount}`);
    console.log(`   - Toplam: ${errorCount + warningCount}`);
}

console.log('\n🎉 ESLint düzeltme işlemi tamamlandı!');
