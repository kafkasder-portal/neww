const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix malformed imports
function fixMalformedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix pattern: import { \nimport { ... } from '...' \n  ...
    const malformedPattern = /import\s*\{\s*\nimport\s*\{([^}]+)\}\s*from\s*'([^']+)'\s*\n\s*([^}]*)/g;
    if (malformedPattern.test(content)) {
      content = content.replace(malformedPattern, (match, imports, fromPath, rest) => {
        return `import {${imports}} from '${fromPath}'\nimport { \n  ${rest}`;
      });
      modified = true;
    }
    
    // Fix pattern where import is inserted in the middle of another import
    const middleImportPattern = /import\s*\{([^}]*)\nimport\s*\{([^}]+)\}\s*from\s*'([^']+)'\s*\n([^}]*)/g;
    if (middleImportPattern.test(content)) {
      content = content.replace(middleImportPattern, (match, firstPart, imports, fromPath, rest) => {
        return `import {${imports}} from '${fromPath}'\nimport { \n${firstPart}\n${rest}`;
      });
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed malformed imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const tsxFiles = findTsxFiles(srcDir);

console.log(`Found ${tsxFiles.length} .tsx files`);

let fixedCount = 0;
tsxFiles.forEach(file => {
  if (fixMalformedImports(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed malformed imports in ${fixedCount} files.`);