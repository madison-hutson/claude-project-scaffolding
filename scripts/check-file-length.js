#!/usr/bin/env node
/**
 * File Length Checker
 *
 * Ensures no source files exceed the 300-line limit defined in CONTRIBUTING.md
 *
 * DESIGN: Subdirectory-agnostic
 * - Scans ALL directories recursively from project root
 * - Uses IGNORE_PATTERNS to exclude (not a whitelist of directories to include)
 * - New directories are automatically checked without config changes
 *
 * Run: node scripts/check-file-length.js
 * Exit code: 0 if all pass, 1 if violations found
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const MAX_LINES = 300;
const WARN_LINES = 250;

// File extensions to check (add more as needed for your stack)
const CHECK_EXTENSIONS = ['.js', '.ts', '.tsx', '.jsx', '.vue', '.svelte'];

// Directories/patterns to IGNORE (everything else is checked)
// This is intentionally an exclude-list, NOT a whitelist
const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  'test-results',
  '.husky',
  '.next',
  '.nuxt',
  'prisma/migrations',
  'generated',
];

// File patterns to ignore
const IGNORE_FILE_PATTERNS = [
  '.d.ts',      // Type declaration files
  '.config.',   // Config files (vite.config.ts, etc.)
  '.min.',      // Minified files
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
];

function shouldIgnore(filePath) {
  // Check directory patterns
  if (IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern))) {
    return true;
  }
  // Check file patterns
  if (IGNORE_FILE_PATTERNS.some((pattern) => filePath.includes(pattern))) {
    return true;
  }
  return false;
}

function countLines(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function walkDir(dir, results = []) {
  if (shouldIgnore(dir)) {
    return results;
  }

  try {
    const stat = statSync(dir);
    if (!stat.isDirectory()) {
      return results;
    }
  } catch {
    return results;
  }

  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);

    if (shouldIgnore(filePath)) {
      continue;
    }

    try {
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, results);
      } else if (CHECK_EXTENSIONS.includes(extname(file))) {
        const lines = countLines(filePath);
        const relPath = relative(PROJECT_ROOT, filePath);
        results.push({ path: relPath, lines });
      }
    } catch {
      // Skip files we can't read
    }
  }

  return results;
}

function main() {
  console.log('🔍 Checking file lengths...\n');
  console.log(`   Max allowed: ${MAX_LINES} lines`);
  console.log(`   Warning at:  ${WARN_LINES} lines\n`);

  // Scan entire project root recursively (subdirectory-agnostic)
  const files = walkDir(PROJECT_ROOT);
  const totalFiles = files.length;

  const violations = [];
  const warnings = [];

  for (const file of files) {
    if (file.lines > MAX_LINES) {
      violations.push(file);
    } else if (file.lines > WARN_LINES) {
      warnings.push(file);
    }
  }

  console.log(`   Checked ${totalFiles} files\n`);

  // Report warnings
  if (warnings.length > 0) {
    console.log('⚠️  Warnings (approaching limit):');
    for (const file of warnings.sort((a, b) => b.lines - a.lines)) {
      console.log(`   ${file.path}: ${file.lines} lines`);
    }
    console.log('');
  }

  // Report violations
  if (violations.length > 0) {
    console.log('❌ VIOLATIONS (exceeds 300 lines):');
    for (const file of violations.sort((a, b) => b.lines - a.lines)) {
      console.log(`   ${file.path}: ${file.lines} lines`);
    }
    console.log('\n');
    console.log('These files must be split before committing.');
    console.log('See docs/CONTRIBUTING.md for guidance on how to split files.\n');
    process.exit(1);
  }

  console.log('✅ All files within limit!\n');
  process.exit(0);
}

main();
