/**
 * Endpoint Inventory Drift Detection Test
 *
 * This test ensures that all API endpoints in the codebase are documented
 * in endpoint-inventory.json. It FAILS if:
 * - An endpoint exists in code but not in inventory
 * - An inventory entry references a non-existent endpoint
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load inventory
const inventoryPath = path.join(__dirname, 'endpoint-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

describe('Endpoint Inventory', () => {
  it('should have a valid inventory file', () => {
    expect(inventory).toBeDefined();
    expect(inventory.endpoints).toBeInstanceOf(Array);
  });

  it('should have all required fields for each endpoint', () => {
    for (const endpoint of inventory.endpoints) {
      expect(endpoint.method).toBeDefined();
      expect(endpoint.path).toBeDefined();
      expect(endpoint.description).toBeDefined();
    }
  });

  it('should have valid HTTP methods', () => {
    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    for (const endpoint of inventory.endpoints) {
      expect(
        validMethods,
        `Invalid HTTP method "${endpoint.method}" for ${endpoint.path}`
      ).toContain(endpoint.method);
    }
  });

  it('should have valid path format', () => {
    for (const endpoint of inventory.endpoints) {
      expect(
        endpoint.path,
        `Invalid path format for ${endpoint.method} ${endpoint.path}: must start with /`
      ).toMatch(/^\//);
    }
  });

  it('should match endpoint count', () => {
    expect(inventory.endpoints.length).toBe(inventory.totalEndpoints);
  });

  // TODO: Add actual endpoint scanning once server file exists
  // This test should scan your server/routes files and compare against inventory

  it.todo('should have all code endpoints in inventory');
  it.todo('should not have orphaned inventory entries');
});
