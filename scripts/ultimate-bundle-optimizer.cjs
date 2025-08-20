#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Ultimate Bundle Optimizer Başlatılıyor...');
console.log('=' .repeat(60));

// 1. Dependency Analysis
console.log('\n📦 Bağımlılık Analizi...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Identify large dependencies
const largeDeps = {
  'react': '18.2.0',
  'react-dom': '18.2.0', 
  'typescript': '5.9.2',
  'vite': '5.0.0',
  'tailwindcss': '3.3.0',
  'recharts': '2.15.4',
  'zustand': '4.4.0',
  'framer-motion': '12.23.12',
  'lucide-react': '0.263.1',
  '@supabase/supabase-js': '2.45.0',
  '@tanstack/react-query': '5.0.0',
  'react-hook-form': '7.62.0',
  'zod': '3.22.0',
  'date-fns': '2.30.0',
  'clsx': '2.1.1',
  'tailwind-merge': '2.6.0'
};

console.log('📚 Büyük bağımlılıklar:');
Object.entries(largeDeps).forEach(([dep, version]) => {
  if (dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${dependencies[dep]}`);
  }
});

// 2. Bundle Size Analysis
console.log('\n📊 Bundle Boyutu Analizi...');
let bundleSize = 0;
let chunkCount = 0;

if (fs.existsSync('dist')) {
  const analyzeDir = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        analyzeDir(itemPath);
      } else if (item.endsWith('.js') || item.endsWith('.css')) {
        bundleSize += stats.size;
        chunkCount++;
      }
    });
  };
  
  analyzeDir('dist');
  console.log(`  📈 Toplam Bundle Boyutu: ${(bundleSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  📦 Chunk Sayısı: ${chunkCount}`);
}

// 3. Performance Recommendations
console.log('\n🎯 Performans Optimizasyon Önerileri:');
console.log('=' .repeat(60));

// Bundle size recommendations
if (bundleSize > 5 * 1024 * 1024) {
  console.log('⚠️  Bundle boyutu büyük (>5MB)');
  console.log('   • Code splitting optimize edilmeli');
  console.log('   • Lazy loading uygulanmalı');
  console.log('   • Tree shaking aktif edilmeli');
  console.log('   • Vendor chunkları ayrılmalı');
}

// 4. Vite Configuration Optimization
console.log('\n⚙️  Vite Konfigürasyon Optimizasyonu...');

const viteConfigPath = 'vite.config.ts';
if (fs.existsSync(viteConfigPath)) {
  console.log('  ✅ Vite config mevcut');
  
  // Check for optimization features
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  const optimizations = [
    { feature: 'manualChunks', found: viteConfig.includes('manualChunks') },
    { feature: 'compression', found: viteConfig.includes('compression') },
    { feature: 'visualizer', found: viteConfig.includes('visualizer') },
    { feature: 'terser', found: viteConfig.includes('terser') },
    { feature: 'sourcemap: false', found: viteConfig.includes('sourcemap: false') }
  ];
  
  console.log('  📋 Mevcut optimizasyonlar:');
  optimizations.forEach(opt => {
    console.log(`    ${opt.found ? '✅' : '❌'} ${opt.feature}`);
  });
}

// 5. Code Splitting Analysis
console.log('\n🔀 Code Splitting Analizi...');
const routesPath = 'src/routes.tsx';
if (fs.existsSync(routesPath)) {
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  const lazyImports = (routesContent.match(/lazy\(\(\) => import\(/g) || []).length;
  console.log(`  📦 Lazy import sayısı: ${lazyImports}`);
  
  if (lazyImports > 20) {
    console.log('  ✅ Code splitting iyi uygulanmış');
  } else {
    console.log('  ⚠️  Daha fazla lazy loading uygulanabilir');
  }
}

// 6. Tree Shaking Analysis
console.log('\n🌳 Tree Shaking Analizi...');
const unusedImports = [
  'src/components/ui/corporate/CorporateComponents.tsx',
  'src/pages/dashboard/Index.tsx',
  'src/pages/donations/List.tsx'
];

console.log('  🔍 Potansiyel unused import kontrolü:');
unusedImports.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`    📄 ${file} - kontrol edilmeli`);
  }
});

// 7. Compression Analysis
console.log('\n🗜️  Sıkıştırma Analizi...');
const distPath = 'dist';
if (fs.existsSync(distPath)) {
  const hasGzip = fs.readdirSync(distPath).some(file => file.endsWith('.gz'));
  const hasBrotli = fs.readdirSync(distPath).some(file => file.endsWith('.br'));
  
  console.log(`  ${hasGzip ? '✅' : '❌'} Gzip sıkıştırma`);
  console.log(`  ${hasBrotli ? '✅' : '❌'} Brotli sıkıştırma`);
}

// 8. Performance Monitoring Setup
console.log('\n📊 Performans İzleme Kurulumu...');
const performanceFiles = [
  'src/utils/performanceMonitor.tsx',
  'src/hooks/usePerformanceMonitoring.ts'
];

performanceFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file} mevcut`);
  } else {
    console.log(`  ❌ ${file} eksik`);
  }
});

// 9. Bundle Analyzer Setup
console.log('\n📈 Bundle Analyzer Kurulumu...');
const analyzerScripts = [
  'npm run analyze',
  'npm run analyze:bundle'
];

console.log('  📋 Mevcut analiz scriptleri:');
analyzerScripts.forEach(script => {
  const scriptName = script.split(' ')[2];
  if (packageJson.scripts[scriptName]) {
    console.log(`    ✅ ${script}`);
  } else {
    console.log(`    ❌ ${script} - eklenebilir`);
  }
});

// 10. Final Recommendations
console.log('\n🎯 Son Öneriler:');
console.log('=' .repeat(60));

console.log('1. 🚀 Acil Optimizasyonlar:');
console.log('   • TypeScript hatalarını düzelt');
console.log('   • Unused dependencies temizle');
console.log('   • Duplicate imports kaldır');

console.log('\n2. 📦 Bundle Optimizasyonları:');
console.log('   • Vendor chunkları optimize et');
console.log('   • Critical CSS inline et');
console.log('   • Image optimization uygula');

console.log('\n3. 🔧 Build Optimizasyonları:');
console.log('   • Parallel build aktif et');
console.log('   • Cache stratejileri uygula');
console.log('   • Minification optimize et');

console.log('\n4. 📊 Monitoring:');
console.log('   • Bundle size monitoring');
console.log('   • Performance metrics tracking');
console.log('   • Error boundary implementation');

console.log('\n✅ Ultimate Bundle Optimizer tamamlandı!');
console.log('=' .repeat(60));

// 11. Generate optimization report
const report = {
  timestamp: new Date().toISOString(),
  bundleSize: bundleSize,
  chunkCount: chunkCount,
  largeDependencies: largeDeps,
  recommendations: [
    'Fix TypeScript errors',
    'Optimize vendor chunks',
    'Implement critical CSS',
    'Add bundle monitoring',
    'Optimize lazy loading'
  ]
};

fs.writeFileSync('bundle-optimization-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Optimizasyon raporu: bundle-optimization-report.json');
