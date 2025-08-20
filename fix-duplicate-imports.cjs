const fs = require('fs');
const path = require('path');

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

function fixDuplicateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // CorporateComponents import satırlarını bul
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/corporate\/CorporateComponents['"]/g;
    let matches = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      matches.push({
        fullMatch: match[0],
        imports: match[1].split(',').map(imp => imp.trim()),
        index: match.index
      });
    }
    
    if (matches.length > 1) {
      // Birden fazla import varsa birleştir
      const allImports = [];
      matches.forEach(m => {
        allImports.push(...m.imports);
      });
      
      // Duplicate'leri kaldır
      const uniqueImports = [...new Set(allImports)];
      
      // Yeni import satırı oluştur
      const newImport = `import { ${uniqueImports.join(', ')} } from '@/components/ui/corporate/CorporateComponents'`;
      
      // Eski import'ları kaldır ve yenisini ekle
      matches.reverse().forEach(m => {
        content = content.replace(m.fullMatch, '');
      });
      
      // React import'undan sonra yeni import'u ekle
      if (content.includes("import React")) {
        content = content.replace(
          /(import React[^\n]*\n)/,
          `$1${newImport}\n`
        );
      } else {
        content = newImport + '\n' + content;
      }
      
      modified = true;
    } else if (matches.length === 1) {
      // Tek import varsa duplicate'leri kontrol et
      const imports = matches[0].imports;
      const uniqueImports = [...new Set(imports)];
      
      if (imports.length !== uniqueImports.length) {
        const newImport = `import { ${uniqueImports.join(', ')} } from '@/components/ui/corporate/CorporateComponents'`;
        content = content.replace(matches[0].fullMatch, newImport);
        modified = true;
      }
    }
    
    // Boş satırları temizle
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
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
  if (fixDuplicateImports(file)) {
    console.log(`✓ ${file}`);
    fixedCount++;
  }
});

console.log(`\n${fixedCount} dosyada duplicate import'lar düzeltildi.`);