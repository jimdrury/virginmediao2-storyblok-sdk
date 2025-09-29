import { describe, expect, it } from 'vitest';
import * as index from './index';

describe('index exports', () => {
  it('should export all middleware functions', () => {
    // New unified middlewares
    expect(index.storyblokCdnConfig).toBeDefined();
    expect(index.storyblokPathConfig).toBeDefined();
    expect(index.storyblokResolverConfig).toBeDefined();
  });

  it('should export StoryblokSdk class', () => {
    expect(index.StoryblokSdk).toBeDefined();
    expect(typeof index.StoryblokSdk).toBe('function');
  });

  it('should export utility functions', () => {
    expect(index.fetchAllPaginated).toBeDefined();
    expect(typeof index.fetchAllPaginated).toBe('function');
  });

  it('should export all type interfaces', () => {
    // These are type-only exports, so we can't test them directly
    // but we can verify they exist by checking the module structure
    const indexKeys = Object.keys(index);

    // Verify main exports are present
    expect(indexKeys).toContain('StoryblokSdk');
    expect(indexKeys).toContain('fetchAllPaginated');

    // New unified middlewares
    expect(indexKeys).toContain('storyblokCdnConfig');
    expect(indexKeys).toContain('storyblokPathConfig');
    expect(indexKeys).toContain('storyblokResolverConfig');
  });
});
