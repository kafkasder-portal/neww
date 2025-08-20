const fs = require('fs');
const path = require('path');

// Corporate UI bileşenlerinin listesi
const corporateComponents = [
  'CorporateCard',
  'CorporateCardContent', 
  'CorporateCardHeader',
  'CorporateCardTitle',
  'CorporateCardSubtitle',
  'CorporateCardFooter',
  'CorporateButton',
  'CorporateAlert',
  'CorporateBadge',
  'CorporateModal',
  'CorporateProgress',
  'CorporateTable',
  'KPICard'
];

function findTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(findTsxFiles(filePath));
      }
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  
  return results;
}

function fixCorporateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Dosyada kullanılan corporate bileşenleri bul
    const usedComponents = [];
    corporateComponents.forEach(component => {
      if (content.includes(`<${component}`) || content.includes(`</${component}`)) {
        usedComponents.push(component);
      }
    });
    
    if (usedComponents.length === 0) {
      return false; // Bu dosyada corporate bileşen kullanılmıyor
    }
    
    // Mevcut import satırlarını kontrol et
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/corporate\/CorporateComponents['"]/g;
    let match;
    let hasImport = false;
    let currentImports = [];
    
    while ((match = importRegex.exec(content)) !== null) {
      hasImport = true;
      const imports = match[1].split(',').map(imp => imp.trim());
      currentImports = currentImports.concat(imports);
    }
    
    // Eksik import'ları bul
    const missingImports = usedComponents.filter(comp => !currentImports.includes(comp));
    
    if (missingImports.length > 0 || !hasImport) {
      // Tüm gerekli import'ları birleştir
      const allNeededImports = [...new Set([...currentImports, ...usedComponents])];
      
      if (hasImport) {
        // Mevcut import'ı güncelle
        content = content.replace(
          importRegex,
          `import { ${allNeededImports.join(', ')} } from '@/components/ui/corporate/CorporateComponents'`
        );
      } else {
        // Yeni import ekle
        const importStatement = `import { ${allNeededImports.join(', ')} } from '@/components/ui/corporate/CorporateComponents'\n`;
        
        // React import'undan sonra ekle
        if (content.includes("import React")) {
          content = content.replace(
            /(import React[^\n]*\n)/,
            `$1${importStatement}`
          );
        } else {
          // Dosyanın başına ekle
          content = importStatement + content;
        }
      }
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Hata (${filePath}):`, error.message);
    return false;
  }
}

// Ana işlem
const srcDir = path.join(__dirname, 'src');
const tsxFiles = findTsxFiles(srcDir);

console.log(`${tsxFiles.length} .tsx dosyası bulundu.`);

let fixedCount = 0;
tsxFiles.forEach(file => {
  if (fixCorporateImports(file)) {
    console.log(`✓ ${file}`);
    fixedCount++;
  }
});

console.log(`\n${fixedCount} dosyada Corporate UI import'ları düzeltildi.`);