/**
 * E2E Flow Inventory Drift Detection Test
 *
 * This test ensures that all E2E test files are documented
 * in flow-inventory.json. It FAILS if:
 * - A .spec.ts file exists but not in inventory
 * - An inventory entry references a non-existent spec file
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const inventoryPath = path.join(__dirname, 'flow-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

test.describe('E2E Flow Inventory', () => {
  test('should have valid inventory structure', () => {
    expect(inventory).toBeDefined();
    expect(inventory.flows).toBeInstanceOf(Array);
    expect(inventory.totalFlows).toBe(inventory.flows.length);
  });

  test('should have all spec files in inventory', async () => {
    const specFiles = await glob('*.spec.ts', { cwd: __dirname });

    // Exclude this inventory test itself
    const testFiles = specFiles.filter((f) => f !== 'flow-inventory.spec.ts');
    const inventoryFiles = inventory.flows.map((f: { file: string }) => f.file);

    for (const file of testFiles) {
      expect(
        inventoryFiles.includes(file),
        `E2E test not in inventory: ${file}\nAdd it to tests/e2e/flow-inventory.json`
      ).toBe(true);
    }
  });

  test('should not have orphaned inventory entries', () => {
    for (const flow of inventory.flows) {
      const filePath = path.join(__dirname, flow.file);
      expect(
        fs.existsSync(filePath),
        `Inventory references non-existent file: ${flow.file}`
      ).toBe(true);
    }
  });
});
