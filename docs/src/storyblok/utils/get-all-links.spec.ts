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
    const mockLinks = [] as never;
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks);

    const params = { starts_with: 'blog/' };
    await getAllLinks(params);

    expect(storyblokSdk.getAllLinks).toHaveBeenCalledWith(params, undefined);
  });

  it('calls storyblokSdk.getAllLinks with options', async () => {
    const { storyblokSdk } = await import('..');
    const mockLinks = [] as never;
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks);

    const params = { starts_with: 'blog/' };
    const options = { perPage: 100, maxPages: 5 };
    await getAllLinks(params, options);

    expect(storyblokSdk.getAllLinks).toHaveBeenCalledWith(params, options);
  });

  it('returns links from storyblokSdk', async () => {
    const { storyblokSdk } = await import('..');
    const mockLinks = [
      { id: 1, real_path: 'page1', is_folder: false },
      { id: 2, real_path: 'page2', is_folder: false },
    ] as never;
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks);

    const result = await getAllLinks();

    expect(result).toEqual(mockLinks);
  });

  it('calls cacheLife with default', async () => {
    const { cacheLife } = await import('next/dist/server/use-cache/cache-life');
    const { storyblokSdk } = await import('..');
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue([] as never);

    await getAllLinks();

    expect(cacheLife).toHaveBeenCalledWith('default');
  });
});

describe('getAllLinksWithFolders', () => {
  it('returns links including folders', async () => {
    const { getAllLinksWithFolders } = await import('./get-all-links');
    const { storyblokSdk } = await import('..');
    const mockLinks = [
      { id: 1, real_path: 'page1', is_folder: false },
      { id: 2, real_path: 'folder1', is_folder: true },
      { id: 3, real_path: 'page2', is_folder: false },
    ] as never;
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks);

    const result = await getAllLinksWithFolders();

    expect(result).toEqual(mockLinks);
  });

  it('filters out _common paths', async () => {
    const { getAllLinksWithFolders } = await import('./get-all-links');
    const { storyblokSdk } = await import('..');
    const mockLinks = [
      { id: 1, real_path: 'page1', is_folder: false },
      { id: 2, real_path: '_common/header', is_folder: false },
      { id: 3, real_path: 'folder/_common/footer', is_folder: true },
      { id: 4, real_path: 'page2', is_folder: false },
    ] as never;
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue(mockLinks);

    const result = await getAllLinksWithFolders();

    expect(result).toHaveLength(2);
    expect(result).toEqual([mockLinks[0], mockLinks[3]]);
  });

  it('passes params to storyblokSdk.getAllLinks', async () => {
    const { getAllLinksWithFolders } = await import('./get-all-links');
    const { storyblokSdk } = await import('..');
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue([] as never);

    const params = { starts_with: 'docs/' };
    await getAllLinksWithFolders(params);

    expect(storyblokSdk.getAllLinks).toHaveBeenCalledWith(params, undefined);
  });

  it('passes options to storyblokSdk.getAllLinks', async () => {
    const { getAllLinksWithFolders } = await import('./get-all-links');
    const { storyblokSdk } = await import('..');
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue([] as never);

    const options = { perPage: 50, maxPages: 10 };
    await getAllLinksWithFolders(undefined, options);

    expect(storyblokSdk.getAllLinks).toHaveBeenCalledWith(undefined, options);
  });

  it('calls cacheLife with default', async () => {
    const { getAllLinksWithFolders } = await import('./get-all-links');
    const { cacheLife } = await import('next/dist/server/use-cache/cache-life');
    const { storyblokSdk } = await import('..');
    vi.mocked(storyblokSdk.getAllLinks).mockResolvedValue([] as never);

    await getAllLinksWithFolders();

    expect(cacheLife).toHaveBeenCalledWith('default');
  });
});
