#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Bundle Analizi Başlatılıyor...');
console.log('=' .repeat(50));

// 1. Projeyi build et
console.log('\n📦 Proje build ediliyor...');
let buildSuccess = false;
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build başarılı!');
  buildSuccess = true;
} catch (error) {
  console.log('❌ Build başarısız! Kaynak kod analizi yapılıyor...');
}

// 2. Build klasörünü analiz et (varsa)
const distPath = path.join(__dirname, 'dist');
let distExists = fs.existsSync(distPath);

if (!distExists) {
  console.log('⚠️  dist klasörü bulunamadı, kaynak kod analizi yapılıyor...');
}

console.log('\n📊 Proje boyutu analizi...');

// Dosya boyutlarını hesapla
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDirectory(dirPath, prefix = '') {
  const items = fs.readdirSync(dirPath);
  let totalSize = 0;
  const files = [];

  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const { size, fileList } = analyzeDirectory(itemPath, prefix + item + '/');
      totalSize += size;
      files.push(...fileList);
    } else {
      const size = stats.size;
      totalSize += size;
      files.push({
        name: prefix + item,
        size: size,
        path: itemPath
      });
    }
  });

  return { size: totalSize, fileList: files };
}

let totalSize = 0;
let sortedFiles = [];

if (distExists) {
  const { size, fileList } = analyzeDirectory(distPath);
  totalSize = size;
  sortedFiles = fileList.sort((a, b) => b.size - a.size);
  console.log(`\n📈 Bundle boyutu: ${formatBytes(totalSize)}`);
  console.log('\n🔍 En büyük bundle dosyaları:');
  sortedFiles.slice(0, 10).forEach((file, index) => {
    console.log(`${index + 1}. ${file.name}: ${formatBytes(file.size)}`);
  });
} else {
  // Kaynak kod analizi
  const srcPath = path.join(__dirname, 'src');
  if (fs.existsSync(srcPath)) {
    const { size, fileList } = analyzeDirectory(srcPath);
    totalSize = size;
    sortedFiles = fileList.sort((a, b) => b.size - a.size);
    console.log(`\n📈 Kaynak kod boyutu: ${formatBytes(totalSize)}`);
    console.log('\n🔍 En büyük kaynak dosyalar:');
    sortedFiles.slice(0, 15).forEach((file, index) => {
      console.log(`${index + 1}. ${file.name}: ${formatBytes(file.size)}`);
    });
  }
}

// 3. package.json'dan bağımlılıkları analiz et
console.log('\n📦 Bağımlılık analizi...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('\n📚 Büyük bağımlılıklar (tahmin):');
  const largeDeps = [
    'react', 'react-dom', 'typescript', 'vite', '@types/react',
    'tailwindcss', 'lucide-react', 'recharts', 'three', 'zustand'
  ];
  
  largeDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`- ${dep}: ${dependencies[dep]}`);
    }
  });
}

// 4. Performans optimizasyon önerileri
console.log('\n🚀 Performans Optimizasyon Önerileri:');
console.log('=' .repeat(50));

if (totalSize > 5 * 1024 * 1024) { // 5MB'dan büyükse
  console.log('⚠️  Bundle boyutu büyük (>5MB)');
  console.log('   • Code splitting kullanın');
  console.log('   • Lazy loading uygulayın');
  console.log('   • Tree shaking optimize edin');
}

// JS dosyalarını kontrol et
const jsFiles = sortedFiles.filter(f => f.name.endsWith('.js'));
if (jsFiles.length > 0 && jsFiles[0].size > 1024 * 1024) {
  console.log('⚠️  Büyük JavaScript dosyası tespit edildi');
  console.log('   • Chunk splitting uygulayın');
  console.log('   • Vendor ve app kodlarını ayırın');
}

// CSS dosyalarını kontrol et
const cssFiles = sortedFiles.filter(f => f.name.endsWith('.css'));
if (cssFiles.length > 0 && cssFiles[0].size > 500 * 1024) {
  console.log('⚠️  Büyük CSS dosyası tespit edildi');
  console.log('   • CSS purging uygulayın');
  console.log('   • Critical CSS kullanın');
}

console.log('\n✅ Genel öneriler:');
console.log('• Gzip/Brotli sıkıştırma kullanın');
console.log('• CDN kullanarak statik dosyaları serve edin');
console.log('• Bundle analyzer ile detaylı analiz yapın');
console.log('• Unused dependencies temizleyin');
console.log('• Modern ES modules kullanın');

console.log('\n🎯 Bundle analizi tamamlandı!');
console.log('=' .repeat(50));