#!/usr/bin/env node
/**
 * File Length Checker
 * Enforces maximum line count per file (default: 300 lines)
 *
 * Usage: node scripts/check-file-length.js [--max=N] [--path=dir]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MAX_LINES = parseInt(process.argv.find(a => a.startsWith('--max='))?.split('=')[1] || '300');
const SEARCH_PATH = process.argv.find(a => a.startsWith('--path='))?.split('=')[1] || '.';

// File patterns to check
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

// Directories to skip
const SKIP_DIRS = ['node_modules', 'dist', 'build', '.git', 'coverage', '.next', '.nuxt'];

// Files to skip
const SKIP_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(item)) {
        getFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (EXTENSIONS.includes(ext) && !SKIP_FILES.includes(item)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function main() {
  console.log(`\nChecking files for max ${MAX_LINES} lines...\n`);

  const files = getFiles(SEARCH_PATH);
  const violations = [];
  const warnings = [];

  for (const file of files) {
    const lines = countLines(file);
    const relativePath = path.relative(process.cwd(), file);

    if (lines > MAX_LINES) {
      violations.push({ file: relativePath, lines });
    } else if (lines > MAX_LINES - 50) {
      // Warn at 250 lines if max is 300
      warnings.push({ file: relativePath, lines });
    }
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log('⚠️  FILES APPROACHING LIMIT (consider splitting):');
    for (const { file, lines } of warnings.sort((a, b) => b.lines - a.lines)) {
      console.log(`   ${lines} lines: ${file}`);
    }
    console.log('');
  }

  // Print violations
  if (violations.length > 0) {
    console.log('❌ FILES EXCEEDING LIMIT:');
    for (const { file, lines } of violations.sort((a, b) => b.lines - a.lines)) {
      console.log(`   ${lines} lines: ${file}`);
    }
    console.log(`\n${violations.length} file(s) exceed ${MAX_LINES} lines. Split these files before committing.\n`);
    process.exit(1);
  }

  console.log(`✅ All ${files.length} files are under ${MAX_LINES} lines.\n`);
  process.exit(0);
}

main();
