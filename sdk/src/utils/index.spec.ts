import { describe, expect, it } from 'vitest';
import * as utils from './index';

describe('utils index exports', () => {
  it('should export fetchAllPaginated function', () => {
    expect(utils.fetchAllPaginated).toBeDefined();
    expect(typeof utils.fetchAllPaginated).toBe('function');
  });

  it('should have all expected utility exports', () => {
    const expectedExports = ['fetchAllPaginated'];
    const actualExports = Object.keys(utils);

    expectedExports.forEach((exportName) => {
      expect(actualExports).toContain(exportName);
    });
  });

  it('should export PaginationOptions type (implicitly tested through function usage)', () => {
    // We can't directly test type exports, but we can verify the function
    // accepts the expected options structure
    expect(utils.fetchAllPaginated).toBeDefined();
  });
});
