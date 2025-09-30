import { describe, expect, it } from 'vitest';
import type {
  StoryblokApiResponseWithStoryLinks,
  StoryblokApiResponseWithStoryRels,
  StoryblokStoriesResponseWithLinks,
  StoryblokStoriesResponseWithRels,
  StoryblokStoryResponseWithLinks,
  StoryblokStoryResponseWithRels,
} from './shared-types';

describe('shared-types validation', () => {
  describe('StoryblokStoriesResponseWithRels interface', () => {
    it('should accept stories response with resolved relations', () => {
      const response: StoryblokStoriesResponseWithRels = {
        stories: [
          {
            id: 123,
            uuid: 'story-uuid',
            name: 'Test Story',
            slug: 'test-story',
            full_slug: 'blog/test-story',
            content: { title: 'Test' },
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
            published_at: '2024-01-01T00:00:00.000Z',
            first_published_at: '2024-01-01T00:00:00.000Z',
            sort_by_date: null,
            tag_list: [],
            is_startpage: false,
            parent_id: null,
            meta_data: null,
            group_id: 'test-group',
            alternates: [],
            translated_slugs: [],
          },
        ],
        cv: 123456,
        rels: [
          {
            id: 456,
            uuid: 'rel-uuid',
            name: 'Related Story',
            slug: 'related-story',
            full_slug: 'blog/related-story',
            content: { title: 'Related' },
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
            published_at: '2024-01-01T00:00:00.000Z',
            first_published_at: '2024-01-01T00:00:00.000Z',
            sort_by_date: null,
            tag_list: [],
            is_startpage: false,
            parent_id: null,
            meta_data: null,
            group_id: 'test-group',
            alternates: [],
            translated_slugs: [],
          },
        ],
        links: [],
      };

      expect(response.stories).toHaveLength(1);
      expect(response.rels).toHaveLength(1);
      expect(response.rels[0].id).toBe(456);
    });
  });

  describe('StoryblokStoryResponseWithRels interface', () => {
    it('should accept story response with resolved relations', () => {
      const response: StoryblokStoryResponseWithRels = {
        story: {
          id: 123,
          uuid: 'story-uuid',
          name: 'Test Story',
          slug: 'test-story',
          full_slug: 'blog/test-story',
          content: { title: 'Test' },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          published_at: '2024-01-01T00:00:00.000Z',
          first_published_at: '2024-01-01T00:00:00.000Z',
          sort_by_date: null,
          tag_list: [],
          is_startpage: false,
          parent_id: null,
          meta_data: null,
          group_id: 'test-group',
          alternates: [],
          translated_slugs: [],
        },
        cv: 123456,
        rels: [],
        links: [],
      };

      expect(response.story.id).toBe(123);
      expect(Array.isArray(response.rels)).toBe(true);
    });
  });

  describe('StoryblokStoriesResponseWithLinks interface', () => {
    it('should accept stories response with resolved links', () => {
      const response: StoryblokStoriesResponseWithLinks = {
        stories: [],
        cv: 123456,
        rels: [],
        links: [
          {
            id: 789,
            uuid: 'link-uuid',
            name: 'Linked Story',
            slug: 'linked-story',
            full_slug: 'blog/linked-story',
            content: { title: 'Linked' },
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
            published_at: '2024-01-01T00:00:00.000Z',
            first_published_at: '2024-01-01T00:00:00.000Z',
            sort_by_date: null,
            tag_list: [],
            is_startpage: false,
            parent_id: null,
            meta_data: null,
            group_id: 'test-group',
            alternates: [],
            translated_slugs: [],
          },
        ],
      };

      expect(response.links).toHaveLength(1);
      expect(response.links[0].id).toBe(789);
    });
  });

  describe('StoryblokStoryResponseWithLinks interface', () => {
    it('should accept story response with resolved links', () => {
      const response: StoryblokStoryResponseWithLinks = {
        story: {
          id: 123,
          uuid: 'story-uuid',
          name: 'Test Story',
          slug: 'test-story',
          full_slug: 'blog/test-story',
          content: { title: 'Test' },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          published_at: '2024-01-01T00:00:00.000Z',
          first_published_at: '2024-01-01T00:00:00.000Z',
          sort_by_date: null,
          tag_list: [],
          is_startpage: false,
          parent_id: null,
          meta_data: null,
          group_id: 'test-group',
          alternates: [],
          translated_slugs: [],
        },
        cv: 123456,
        rels: [],
        links: [],
      };

      expect(response.story.id).toBe(123);
      expect(Array.isArray(response.links)).toBe(true);
    });
  });

  describe('Union types', () => {
    it('should accept StoryblokApiResponseWithStoryRels union types', () => {
      const storiesResponse: StoryblokApiResponseWithStoryRels = {
        stories: [],
        cv: 123456,
        rels: [],
        links: [],
      };

      const storyResponse: StoryblokApiResponseWithStoryRels = {
        story: {
          id: 123,
          uuid: 'story-uuid',
          name: 'Test Story',
          slug: 'test-story',
          full_slug: 'blog/test-story',
          content: { title: 'Test' },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          published_at: '2024-01-01T00:00:00.000Z',
          first_published_at: '2024-01-01T00:00:00.000Z',
          sort_by_date: null,
          tag_list: [],
          is_startpage: false,
          parent_id: null,
          meta_data: null,
          group_id: 'test-group',
          alternates: [],
          translated_slugs: [],
        },
        cv: 123456,
        rels: [],
        links: [],
      };

      expect('stories' in storiesResponse).toBe(true);
      expect('story' in storyResponse).toBe(true);
    });

    it('should accept StoryblokApiResponseWithStoryLinks union types', () => {
      const storiesResponse: StoryblokApiResponseWithStoryLinks = {
        stories: [],
        cv: 123456,
        rels: [],
        links: [],
      };

      const storyResponse: StoryblokApiResponseWithStoryLinks = {
        story: {
          id: 123,
          uuid: 'story-uuid',
          name: 'Test Story',
          slug: 'test-story',
          full_slug: 'blog/test-story',
          content: { title: 'Test' },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          published_at: '2024-01-01T00:00:00.000Z',
          first_published_at: '2024-01-01T00:00:00.000Z',
          sort_by_date: null,
          tag_list: [],
          is_startpage: false,
          parent_id: null,
          meta_data: null,
          group_id: 'test-group',
          alternates: [],
          translated_slugs: [],
        },
        cv: 123456,
        rels: [],
        links: [],
      };

      expect('stories' in storiesResponse).toBe(true);
      expect('story' in storyResponse).toBe(true);
    });
  });

  describe('type constraints and validation', () => {
    it('should enforce template literal types for resolve_relations', () => {
      function testRelations(relations: `${string}.${string}`[]): string {
        return relations.join(',');
      }

      const validRelations: `${string}.${string}`[] = [
        'blog_post.author',
        'page.featured_story',
        'card.link',
      ];

      expect(testRelations(validRelations)).toBe(
        'blog_post.author,page.featured_story,card.link',
      );
    });

    it('should enforce https protocol for asset domains', () => {
      function testAssetDomain(domain: `https://${string}`): string {
        return domain;
      }

      const validDomain: `https://${string}` = 'https://assets.example.com';
      expect(testAssetDomain(validDomain)).toBe('https://assets.example.com');
    });

    it('should enforce trailing slash for base paths', () => {
      function testBasePath(path: `${string}/`): string {
        return path;
      }

      const validPath: `${string}/` = 'blog/';
      expect(testBasePath(validPath)).toBe('blog/');
    });

    it('should enforce number string format for space IDs', () => {
      function testSpaceIds(ids: `${number}`[]): string[] {
        return ids;
      }

      const validIds: `${number}`[] = ['123456', '789012'];
      expect(testSpaceIds(validIds)).toEqual(['123456', '789012']);
    });
  });
});
