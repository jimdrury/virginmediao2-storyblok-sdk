import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getStory } from './get-story';

// Mock the storyblok SDK
vi.mock('..', () => ({
  storyblokSdk: {
    getStory: vi.fn(),
  },
}));

describe('getStory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls storyblokSdk.getStory with slug', async () => {
    const { storyblokSdk } = await import('..');
    const mockStory = { data: { story: { id: 1, slug: 'test-story' } } };
    vi.mocked(storyblokSdk.getStory).mockResolvedValue(mockStory as never);

    await getStory('test-story');

    expect(storyblokSdk.getStory).toHaveBeenCalledWith('test-story', undefined);
  });

  it('calls storyblokSdk.getStory with options', async () => {
    const { storyblokSdk } = await import('..');
    const mockStory = { data: { story: { id: 1, slug: 'test-story' } } };
    vi.mocked(storyblokSdk.getStory).mockResolvedValue(mockStory as never);

    const options = { version: 'draft' as const };
    await getStory('test-story', options);

    expect(storyblokSdk.getStory).toHaveBeenCalledWith('test-story', options);
  });

  it('returns story data', async () => {
    const { storyblokSdk } = await import('..');
    const mockStoryData = { id: 1, slug: 'test-story', name: 'Test Story' };
    const mockResponse = { data: { story: mockStoryData } };
    vi.mocked(storyblokSdk.getStory).mockResolvedValue(mockResponse as never);

    const result = await getStory('test-story');

    expect(result).toEqual(mockStoryData);
  });
});
