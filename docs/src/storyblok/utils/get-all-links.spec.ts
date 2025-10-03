import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllLinks } from './get-all-links';

// Mock the storyblok SDK
vi.mock('..', () => ({
  storyblokSdk: {
    getAllLinks: vi.fn(),
  },
}));

// Mock next cache
vi.mock('next/dist/server/use-cache/cache-life', () => ({
  cacheLife: vi.fn(),
}));

describe('getAllLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls storyblokSdk.getAllLinks with params', async () => {
    const { storyblokSdk } = await import('..');
    const mockLinks = { data: { links: [] } };
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks as never);

    const params = { starts_with: 'blog/' };
    await getAllLinks(params);

    expect(storyblokSdk.getAllLinks).toHaveBeenCalledWith(params, undefined);
  });

  it('calls storyblokSdk.getAllLinks with options', async () => {
    const { storyblokSdk } = await import('..');
    const mockLinks = { data: { links: [] } };
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks as never);

    const params = { starts_with: 'blog/' };
    const options = { perPage: 100, maxPages: 5 };
    await getAllLinks(params, options);

    expect(storyblokSdk.getAllLinks).toHaveBeenCalledWith(params, options);
  });

  it('returns links from storyblokSdk', async () => {
    const { storyblokSdk } = await import('..');
    const mockLinks = { data: { links: [{ id: 1 }, { id: 2 }] } };
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks as never);

    const result = await getAllLinks();

    expect(result).toEqual(mockLinks);
  });
});
