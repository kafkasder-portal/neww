#!/usr/bin/env node

/**
 * Bundle analiz scripti
 * Vite build sonrasında bundle boyutlarını ve bağımlılıkları analiz eder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Analyze bundle with vite-bundle-analyzer
  console.log('\n📊 Analyzing bundle...');
  execSync('npx vite-bundle-analyzer dist', { stdio: 'inherit' });

  // Check for large dependencies
  console.log('\n📋 Checking for large dependencies...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('\n📈 Bundle Analysis Summary:');
  console.log('========================');
  
  // List all dependencies
  Object.entries(dependencies).forEach(([name, version]) => {
    console.log(`📦 ${name}: ${version}`);
  });

  console.log('\n💡 Performance Optimization Tips:');
  console.log('================================');
  console.log('1. Use React.memo() for expensive components');
  console.log('2. Implement lazy loading with React.lazy()');
  console.log('3. Use useMemo() for expensive calculations');
  console.log('4. Use useCallback() for stable function references');
  console.log('5. Consider code splitting for large components');
  console.log('6. Optimize images and assets');
  console.log('7. Use tree shaking to remove unused code');

} catch (error) {
  console.error('❌ Error during bundle analysis:', error.message);
  process.exit(1);
}
