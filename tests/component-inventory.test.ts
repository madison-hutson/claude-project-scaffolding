/**
 * Component Inventory Drift Detection Test
 *
 * This test ensures that all components in the codebase are documented
 * in component-inventory.json. It FAILS if:
 * - A component exists in code but not in inventory
 * - An inventory entry references a non-existent component
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Load inventory
const inventoryPath = path.join(__dirname, 'component-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

describe('Component Inventory', () => {
  it('should have a valid inventory file', () => {
    expect(inventory).toBeDefined();
    expect(inventory.components).toBeInstanceOf(Array);
  });

  it('should have all required fields for each component', () => {
    for (const component of inventory.components) {
      expect(component.name).toBeDefined();
      expect(component.path).toBeDefined();
      expect(component.description).toBeDefined();
    }
  });

  it('should match component count', () => {
    expect(inventory.components.length).toBe(inventory.totalComponents);
  });

  it('should have all component files exist', async () => {
    for (const component of inventory.components) {
      const fullPath = path.join(process.cwd(), component.path);
      const exists = fs.existsSync(fullPath);
      expect(exists, `Component file not found: ${component.path}`).toBe(true);
    }
  });

  it('should have valid .tsx extension for all components', () => {
    for (const component of inventory.components) {
      expect(
        component.path,
        `Invalid extension for "${component.name}": expected .tsx, got ${path.extname(component.path)}\nComponents must be .tsx files (React + TypeScript)`
      ).toMatch(/\.tsx$/);
    }
  });

  it('should have all .tsx components in inventory', async () => {
    // Find all component files
    const componentFiles = await glob('src/**/*.tsx', {
      ignore: ['**/*.test.tsx', '**/*.spec.tsx', '**/index.tsx'],
    });

    const inventoryPaths = inventory.components.map((c: { path: string }) => c.path);

    for (const file of componentFiles) {
      const isInInventory = inventoryPaths.includes(file);
      expect(
        isInInventory,
        `Component not in inventory: ${file}\nAdd it to tests/component-inventory.json`
      ).toBe(true);
    }
  });
});
