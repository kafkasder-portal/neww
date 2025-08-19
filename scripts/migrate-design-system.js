#!/usr/bin/env node

/**
 * TASARIM SİSTEMİ MIGRATION SCRIPT
 * Eski renk kullanımlarını yeni tasarım sistemine otomatik olarak dönüştürür
 */

import fs from 'fs';
import pkg from 'glob';
import path from 'path';
const { glob } = pkg;

// Migration mappings
const MIGRATION_MAPPINGS = {
    // Hex colors to design system colors
    '#ef4444': 'COLORS.semantic.danger',
    '#22c55e': 'COLORS.semantic.success',
    '#f59e0b': 'COLORS.semantic.warning',
    '#3b82f6': 'COLORS.brand.primary',
    '#10b981': 'COLORS.semantic.success',
    '#8b5cf6': 'COLORS.chart[5]',
    '#06b6d4': 'COLORS.chart[6]',
    '#f97316': 'COLORS.chart[7]',
    '#ec4899': 'COLORS.chart[8]',

    // Chart colors
    '#0088FE': 'COLORS.chart[1]',
    '#00C49F': 'COLORS.chart[2]',
    '#FFBB28': 'COLORS.chart[3]',
    '#FF8042': 'COLORS.chart[4]',
    '#8884D8': 'COLORS.chart[5]',
    '#82CA9D': 'COLORS.chart[6]',
    '#FFC658': 'COLORS.chart[7]',
    '#FF7C7C': 'COLORS.chart[8]',

    // Status colors
    '#dc2626': 'COLORS.semantic.danger',
    '#16a34a': 'COLORS.semantic.success',
    '#d97706': 'COLORS.semantic.warning',
    '#2563eb': 'COLORS.semantic.info',

    // Neutral colors
    '#6b7280': 'COLORS.neutral[500]',
    '#374151': 'COLORS.neutral[700]',
    '#1f2937': 'COLORS.neutral[800]',
    '#111827': 'COLORS.neutral[900]',
    '#f9fafb': 'COLORS.neutral[50]',
    '#f3f4f6': 'COLORS.neutral[100]',
    '#e5e7eb': 'COLORS.neutral[200]',
    '#d1d5db': 'COLORS.neutral[300]',
    '#9ca3af': 'COLORS.neutral[400]',
    '#4b5563': 'COLORS.neutral[600]',

    // Additional colors found in the codebase
    '#0F3A7A': 'COLORS.brand.primary800',
    '#1D8348': 'COLORS.semantic.success700',
    '#B7950B': 'COLORS.semantic.warning700',
    '#C0392B': 'COLORS.semantic.danger700',
    '#E5E7EB': 'COLORS.neutral[200]',
    '#000000': 'COLORS.neutral[900]',
    '#FFFFFF': 'COLORS.neutral[50]',
    '#00ff00': 'COLORS.semantic.success',
};

// Import statements to add
const NEW_IMPORTS = {
    'useDesignSystem': "import { useDesignSystem } from '@/hooks/useDesignSystem'",
    'COLORS': "import { COLORS } from '@/constants/design-system'",
    'STATUS': "import { STATUS } from '@/constants/design-system'",
    'TYPOGRAPHY': "import { TYPOGRAPHY } from '@/constants/design-system'",
};

// Old imports to remove
const OLD_IMPORTS = [
    "import { CHART_COLORS } from '@/constants/colors'",
    "import { CHART_COLORS_HEX } from '@/constants/colors'",
    "import { STATUS_COLORS } from '@/constants/colors'",
    "import { COLORS } from '@/constants/ui'",
];

// Function to recursively find files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx'], ignoreDirs = ['node_modules', 'dist', 'build']) {
    const files = [];

    function scan(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!ignoreDirs.includes(item)) {
                        scan(fullPath);
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(item);
                    if (extensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not read directory ${currentDir}:`, error.message);
        }
    }

    scan(dir);
    return files;
}

function migrateFile(filePath) {
    console.log(`Migrating: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Add new imports if needed
    const importsToAdd = [];

    // Check if file uses hex colors
    const hasHexColors = Object.keys(MIGRATION_MAPPINGS).some(hex =>
        content.includes(hex)
    );

    // Check if file uses inline styles
    const hasInlineStyles = content.includes('style={{') &&
        (content.includes('color:') || content.includes('backgroundColor:'));

    if (hasHexColors || hasInlineStyles) {
        if (!content.includes('useDesignSystem')) {
            importsToAdd.push(NEW_IMPORTS.useDesignSystem);
        }
        if (!content.includes('COLORS') && hasHexColors) {
            importsToAdd.push(NEW_IMPORTS.COLORS);
        }
    }

    // Add imports
    if (importsToAdd.length > 0) {
        const importIndex = content.lastIndexOf('import');
        if (importIndex !== -1) {
            const nextLineIndex = content.indexOf('\n', importIndex);
            const insertPosition = nextLineIndex !== -1 ? nextLineIndex + 1 : importIndex;
            content = content.slice(0, insertPosition) +
                importsToAdd.join('\n') + '\n' +
                content.slice(insertPosition);
            hasChanges = true;
        }
    }

    // Remove old imports
    OLD_IMPORTS.forEach(oldImport => {
        if (content.includes(oldImport)) {
            content = content.replace(oldImport + '\n', '');
            content = content.replace(oldImport, '');
            hasChanges = true;
        }
    });

    // Replace hex colors with design system colors
    Object.entries(MIGRATION_MAPPINGS).forEach(([hex, replacement]) => {
        if (content.includes(hex)) {
            content = content.replace(new RegExp(hex.replace('#', '\\#'), 'g'), replacement);
            hasChanges = true;
        }
    });

    // Add useDesignSystem hook to components
    if (hasInlineStyles && !content.includes('useDesignSystem()')) {
        // Find React component functions
        const componentRegex = /export\s+(?:default\s+)?function\s+(\w+)/g;
        let match;
        while ((match = componentRegex.exec(content)) !== null) {
            const functionName = match[1];
            const functionStart = content.indexOf(`function ${functionName}`);
            if (functionStart !== -1) {
                const openBraceIndex = content.indexOf('{', functionStart);
                if (openBraceIndex !== -1) {
                    const hookLine = '  const { colors, styles, utils } = useDesignSystem()\n';
                    content = content.slice(0, openBraceIndex + 1) + '\n' + hookLine + content.slice(openBraceIndex + 1);
                    hasChanges = true;
                    break; // Only add once per file
                }
            }
        }
    }

    // Replace inline styles with design system styles
    if (hasInlineStyles) {
        // Replace color: '#ef4444' with colors.semantic.danger
        content = content.replace(
            /color:\s*['"]#ef4444['"]/g,
            'color: colors.semantic.danger'
        );

        content = content.replace(
            /color:\s*['"]#22c55e['"]/g,
            'color: colors.semantic.success'
        );

        content = content.replace(
            /backgroundColor:\s*['"]#ef4444['"]/g,
            'backgroundColor: colors.semantic.danger'
        );

        content = content.replace(
            /backgroundColor:\s*['"]#22c55e['"]/g,
            'backgroundColor: colors.semantic.success'
        );
    }

    // Write changes back to file
    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        return true;
    }

    return false;
}

async function main() {
    console.log('🎨 Starting Design System Migration...\n');

    try {
        // Find all TypeScript/JavaScript files using glob with promise
        const files = await new Promise((resolve, reject) => {
            glob('src/**/*.{ts,tsx,js,jsx}', {
                ignore: [
                    'src/constants/design-system.ts',
                    'src/hooks/useDesignSystem.ts',
                    'src/constants/colors.ts',
                    'src/constants/ui.ts',
                    'node_modules/**',
                    'dist/**',
                    'build/**'
                ]
            }, (err, files) => {
                if (err) reject(err);
                else resolve(files);
            });
        });

        let migratedCount = 0;
        const totalFiles = files.length;

        console.log(`Found ${totalFiles} files to process...\n`);

        for (const file of files) {
            if (migrateFile(file)) {
                migratedCount++;
            }
        }

        console.log(`\n📊 Migration Summary:`);
        console.log(`- Total files processed: ${totalFiles}`);
        console.log(`- Files updated: ${migratedCount}`);
        console.log(`- Files unchanged: ${totalFiles - migratedCount}`);

        if (migratedCount > 0) {
            console.log(`\n✅ Migration completed successfully!`);
            console.log(`\n📝 Next steps:`);
            console.log(`1. Review the changes in the updated files`);
            console.log(`2. Test the application to ensure everything works correctly`);
            console.log(`3. Update any remaining hardcoded colors manually`);
            console.log(`4. Remove deprecated imports from constants/colors.ts and constants/ui.ts`);
        } else {
            console.log(`\nℹ️  No files needed migration.`);
        }
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
main().catch(console.error);

export { migrateFile, MIGRATION_MAPPINGS };

