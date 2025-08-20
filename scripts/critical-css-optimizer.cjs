#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Critical CSS Optimizer Başlatılıyor...');

// Critical CSS extraction for above-the-fold content
const criticalCSS = `
/* Critical CSS - Above the fold styles */
.corporate-layout {
  display: flex;
  min-height: 100vh;
}

.corporate-sidebar {
  width: 280px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
}

.corporate-main {
  flex: 1;
  overflow: auto;
}

.corporate-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.corporate-content {
  padding: 24px;
}

/* Critical button styles */
.corporate-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  padding: 8px 16px;
}

.corporate-button-primary {
  background: #3b82f6;
  color: white;
}

.corporate-button-primary:hover {
  background: #2563eb;
}

/* Critical card styles */
.corporate-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.corporate-card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.corporate-card-content {
  padding: 20px;
}

/* Critical table styles */
.corporate-table {
  width: 100%;
  border-collapse: collapse;
}

.corporate-table th,
.corporate-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.corporate-table th {
  background: #f8fafc;
  font-weight: 600;
}

/* Loading states */
.corporate-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.corporate-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive utilities */
@media (max-width: 768px) {
  .corporate-sidebar {
    width: 100%;
    position: fixed;
    top: 0;
    left: -100%;
    z-index: 50;
    transition: left 0.3s ease;
  }
  
  .corporate-sidebar.open {
    left: 0;
  }
  
  .corporate-main {
    margin-left: 0;
  }
}
`;

// Write critical CSS to file
const criticalCSSPath = 'src/styles/critical.css';
fs.writeFileSync(criticalCSSPath, criticalCSS);

console.log('✅ Critical CSS oluşturuldu:', criticalCSSPath);

// Update index.html to include critical CSS inline
const indexHTMLPath = 'index.html';
if (fs.existsSync(indexHTMLPath)) {
    let htmlContent = fs.readFileSync(indexHTMLPath, 'utf8');

    // Add critical CSS inline in head
    const criticalCSSInline = `<style>${criticalCSS}</style>`;

    if (!htmlContent.includes('critical.css')) {
        htmlContent = htmlContent.replace(
            '</head>',
            `  ${criticalCSSInline}\n  </head>`
        );

        fs.writeFileSync(indexHTMLPath, htmlContent);
        console.log('✅ Critical CSS index.html\'e eklendi');
    }
}

// Create CSS purging configuration
const purgeConfig = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './index.html'
    ],
    css: [
        './src/styles/**/*.css'
    ],
    output: './src/styles/purged.css',
    safelist: [
        'corporate-*',
        'animate-*',
        'transition-*'
    ]
};

fs.writeFileSync('purgecss.config.js', `module.exports = ${JSON.stringify(purgeConfig, null, 2)}`);

console.log('✅ CSS purging konfigürasyonu oluşturuldu');

// Generate optimization report
const report = {
    timestamp: new Date().toISOString(),
    criticalCSSSize: criticalCSS.length,
    optimizations: [
        'Critical CSS extracted',
        'Above-the-fold styles optimized',
        'CSS purging configured',
        'Responsive utilities added'
    ],
    recommendations: [
        'Use critical CSS inline in HTML',
        'Defer non-critical CSS loading',
        'Implement CSS purging in build process',
        'Monitor CSS bundle size'
    ]
};

fs.writeFileSync('critical-css-report.json', JSON.stringify(report, null, 2));
console.log('📄 Critical CSS raporu: critical-css-report.json');

console.log('🎨 Critical CSS Optimizer tamamlandı!');
