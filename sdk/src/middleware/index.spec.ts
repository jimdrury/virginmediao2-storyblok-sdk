import { describe, expect, it } from 'vitest';
import * as middleware from './index';

describe('middleware index exports', () => {
  it('should export all middleware functions', () => {
    // New unified middlewares
    expect(middleware.storyblokCdnConfig).toBeDefined();
    expect(typeof middleware.storyblokCdnConfig).toBe('function');

    expect(middleware.storyblokPathConfig).toBeDefined();
    expect(typeof middleware.storyblokPathConfig).toBe('function');

    expect(middleware.storyblokResolverConfig).toBeDefined();
    expect(typeof middleware.storyblokResolverConfig).toBe('function');
  });

  it('should have all expected middleware exports', () => {
    const expectedExports = [
      'storyblokCdnConfig',
      'storyblokPathConfig',
      'storyblokResolverConfig',
    ];

    const actualExports = Object.keys(middleware);

    expectedExports.forEach((exportName) => {
      expect(actualExports).toContain(exportName);
    });
  });

  it('should export middleware factory functions that return functions', () => {
    // Test that each middleware factory returns a function when called with config
    const cdnConfig = middleware.storyblokCdnConfig({ accessToken: 'test' });
    expect(typeof cdnConfig).toBe('function');

    const pathConfig = middleware.storyblokPathConfig({ basePath: 'test/' });
    expect(typeof pathConfig).toBe('function');

    const resolverConfig = middleware.storyblokResolverConfig({});
    expect(typeof resolverConfig).toBe('function');
  });
});
