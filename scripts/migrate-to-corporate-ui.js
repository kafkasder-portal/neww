#!/usr/bin/env node

/**
 * Corporate UI Migration Script
 * Automates the migration from existing UI components to the new corporate design system
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const CONFIG = {
    sourceDir: './src',
    backupDir: './backup-corporate-ui-migration',
    excludeDirs: ['node_modules', '.git', 'dist', 'build'],
    excludeFiles: ['AppSidebar.tsx', 'sidebar', 'ui/sidebar'],
    fileExtensions: ['.tsx', '.ts'],
    dryRun: process.argv.includes('--dry-run'),
    backup: process.argv.includes('--backup')
};

// Migration mappings
const MIGRATIONS = {
    // Component imports
    imports: {
        'from \'@/components/ui/card\'': 'from \'@/components/ui/corporate/CorporateComponents\'',
        'from \'../ui/card\'': 'from \'../ui/corporate/CorporateComponents\'',
        'from \'./ui/card\'': 'from \'./ui/corporate/CorporateComponents\'',
        'import { Card }': 'import { Card }',
        'import { Button }': 'import { Button }',
        'import { Badge }': 'import { Badge }',
        'import { Table }': 'import { Table }',
    },

    // Class name replacements
    classes: {
        'bg-white rounded-lg shadow p-6': 'corporate-card',
        'bg-white rounded-lg border border-gray-200 shadow-sm': 'corporate-card',
        'bg-white rounded-lg shadow-md': 'corporate-card',
        'bg-gray-50 rounded-lg p-6': 'corporate-card',
        'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700': 'corporate-btn corporate-btn-primary',
        'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700': 'corporate-btn corporate-btn-secondary',
        'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700': 'corporate-btn corporate-btn-success',
        'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700': 'corporate-btn corporate-btn-danger',
        'text-sm font-medium text-gray-700': 'corporate-form-label',
        'w-full px-3 py-2 border border-gray-300 rounded-md': 'corporate-form-input',
        'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500': 'corporate-form-input',
        'table w-full border-collapse': 'corporate-table',
        'bg-gray-50 border-b border-gray-200': 'corporate-table-header',
        'px-6 py-4 text-left text-sm font-semibold text-gray-700': 'corporate-table-header-cell',
        'border-b border-gray-100 hover:bg-gray-50': 'corporate-table-row',
        'px-6 py-4 text-sm text-gray-900': 'corporate-table-cell',
        'px-6 py-4 text-sm text-gray-600': 'corporate-table-cell-muted',
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium': 'corporate-badge',
        'bg-green-100 text-green-800': 'corporate-badge-success',
        'bg-yellow-100 text-yellow-800': 'corporate-badge-warning',
        'bg-red-100 text-red-800': 'corporate-badge-danger',
        'bg-blue-100 text-blue-800': 'corporate-badge-info',
        'bg-gray-100 text-gray-800': 'corporate-badge-neutral',
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6': 'corporate-grid-4',
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': 'corporate-grid-3',
        'grid grid-cols-1 md:grid-cols-2 gap-6': 'corporate-grid-2',
        'grid gap-6': 'corporate-grid',
        'space-y-6': 'corporate-form',
        'space-y-2': 'corporate-form-group',
        'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50': 'corporate-modal',
        'bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4': 'corporate-modal-content',
        'flex items-center justify-between p-6 border-b border-gray-200': 'corporate-modal-header',
        'text-xl font-semibold text-gray-900': 'corporate-modal-title',
        'p-6': 'corporate-modal-body',
        'flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50': 'corporate-modal-footer',
        'p-4 rounded-lg border': 'corporate-alert',
        'bg-green-50 border-green-200 text-green-800': 'corporate-alert-success',
        'bg-yellow-50 border-yellow-200 text-yellow-800': 'corporate-alert-warning',
        'bg-red-50 border-red-200 text-red-800': 'corporate-alert-danger',
        'bg-blue-50 border-blue-200 text-blue-800': 'corporate-alert-info',
        'w-full bg-gray-200 rounded-full h-2': 'corporate-progress',
        'h-full bg-blue-600 rounded-full': 'corporate-progress-bar',
        'text-center py-12': 'corporate-empty',
        'w-16 h-16 text-gray-300 mx-auto mb-4': 'corporate-empty-icon',
        'text-lg font-semibold text-gray-900 mb-2': 'corporate-empty-title',
        'text-gray-600 mb-6 max-w-md mx-auto': 'corporate-empty-description',
    },

    // Layout patterns
    layouts: {
        'min-h-screen bg-gray-50 p-6': 'dashboard-container',
        'bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-white shadow-lg': 'dashboard-header',
        'text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 tracking-tight text-white': 'dashboard-title',
        'text-base sm:text-lg text-white/90 leading-relaxed font-normal': 'dashboard-subtitle',
    }
};

// Utility functions
function log(message, type = 'info') {
    const colors = {
        info: '\x1b[36m',    // Cyan
        success: '\x1b[32m', // Green
        warning: '\x1b[33m', // Yellow
        error: '\x1b[31m',   // Red
        reset: '\x1b[0m'     // Reset
    };

    console.log(`${colors[type]}${message}${colors.reset}`);
}

function shouldExcludeFile(filePath) {
    const relativePath = path.relative(CONFIG.sourceDir, filePath);

    // Check excluded directories
    for (const excludeDir of CONFIG.excludeDirs) {
        if (relativePath.includes(excludeDir)) {
            return true;
        }
    }

    // Check excluded files
    for (const excludeFile of CONFIG.excludeFiles) {
        if (relativePath.includes(excludeFile)) {
            return true;
        }
    }

    return false;
}

function findFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!shouldExcludeFile(fullPath)) {
                    traverse(fullPath);
                }
            } else if (stat.isFile()) {
                const ext = path.extname(fullPath);
                if (CONFIG.fileExtensions.includes(ext) && !shouldExcludeFile(fullPath)) {
                    files.push(fullPath);
                }
            }
        }
    }

    traverse(dir);
    return files;
}

function backupFile(filePath) {
    if (!CONFIG.backup) return;

    const relativePath = path.relative(CONFIG.sourceDir, filePath);
    const backupPath = path.join(CONFIG.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.copyFileSync(filePath, backupPath);
    log(`Backed up: ${relativePath}`, 'info');
}

function applyMigrations(content, filePath) {
    let modifiedContent = content;
    let changes = 0;

    // Apply import migrations
    for (const [oldImport, newImport] of Object.entries(MIGRATIONS.imports)) {
        if (modifiedContent.includes(oldImport)) {
            modifiedContent = modifiedContent.replace(new RegExp(oldImport, 'g'), newImport);
            changes++;
            log(`  Import migration: ${oldImport} → ${newImport}`, 'info');
        }
    }

    // Apply class name migrations
    for (const [oldClass, newClass] of Object.entries(MIGRATIONS.classes)) {
        if (modifiedContent.includes(oldClass)) {
            modifiedContent = modifiedContent.replace(new RegExp(oldClass, 'g'), newClass);
            changes++;
            log(`  Class migration: ${oldClass} → ${newClass}`, 'info');
        }
    }

    // Apply layout migrations
    for (const [oldLayout, newLayout] of Object.entries(MIGRATIONS.layouts)) {
        if (modifiedContent.includes(oldLayout)) {
            modifiedContent = modifiedContent.replace(new RegExp(oldLayout, 'g'), newLayout);
            changes++;
            log(`  Layout migration: ${oldLayout} → ${newLayout}`, 'info');
        }
    }

    return { content: modifiedContent, changes };
}

function migrateFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(CONFIG.sourceDir, filePath);

        log(`Processing: ${relativePath}`, 'info');

        if (CONFIG.backup) {
            backupFile(filePath);
        }

        const { content: modifiedContent, changes } = applyMigrations(content, filePath);

        if (changes > 0) {
            if (!CONFIG.dryRun) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                log(`  ✓ Applied ${changes} changes`, 'success');
            } else {
                log(`  ⚠ Would apply ${changes} changes (dry run)`, 'warning');
            }
            return changes;
        } else {
            log(`  - No changes needed`, 'info');
            return 0;
        }

    } catch (error) {
        log(`  ✗ Error processing file: ${error.message}`, 'error');
        return 0;
    }
}

function main() {
    log('🚀 Corporate UI Migration Script', 'info');
    log(`Mode: ${CONFIG.dryRun ? 'DRY RUN' : 'LIVE'}`, CONFIG.dryRun ? 'warning' : 'info');
    log(`Backup: ${CONFIG.backup ? 'ENABLED' : 'DISABLED'}`, CONFIG.backup ? 'info' : 'warning');
    log('', 'info');

    // Create backup directory if needed
    if (CONFIG.backup && !fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
        log(`Created backup directory: ${CONFIG.backupDir}`, 'info');
    }

    // Find all files to process
    const files = findFiles(CONFIG.sourceDir);
    log(`Found ${files.length} files to process`, 'info');
    log('', 'info');

    let totalChanges = 0;
    let processedFiles = 0;

    // Process each file
    for (const file of files) {
        const changes = migrateFile(file);
        totalChanges += changes;
        if (changes > 0) {
            processedFiles++;
        }
    }

    log('', 'info');
    log('📊 Migration Summary', 'info');
    log(`Files processed: ${files.length}`, 'info');
    log(`Files modified: ${processedFiles}`, 'info');
    log(`Total changes: ${totalChanges}`, 'info');

    if (CONFIG.dryRun) {
        log('', 'warning');
        log('⚠️  This was a dry run. No files were actually modified.', 'warning');
        log('Run without --dry-run to apply changes.', 'warning');
    }

    if (CONFIG.backup) {
        log('', 'info');
        log(`📦 Backup created in: ${CONFIG.backupDir}`, 'info');
    }

    log('', 'info');
    log('✅ Migration completed!', 'success');

    if (!CONFIG.dryRun && totalChanges > 0) {
        log('', 'info');
        log('Next steps:', 'info');
        log('1. Review the changes in your code editor', 'info');
        log('2. Test the application to ensure everything works', 'info');
        log('3. Import the corporate CSS file in your main application', 'info');
        log('4. Update any remaining custom styles as needed', 'info');
    }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Corporate UI Migration Script

Usage: node scripts/migrate-to-corporate-ui.js [options]

Options:
  --dry-run     Show what would be changed without making changes
  --backup      Create backup of files before modifying them
  --help, -h    Show this help message

Examples:
  node scripts/migrate-to-corporate-ui.js --dry-run
  node scripts/migrate-to-corporate-ui.js --backup
  node scripts/migrate-to-corporate-ui.js --dry-run --backup
`);
    process.exit(0);
}

// Run the migration
main();
