import { describe, expect, it } from 'vitest';
import type {
  BaseStoryblokOptions,
  GetLinksParams,
  GetStoriesParams,
  GetStoryParams,
  StoryblokDatasourceEntriesResponse,
  StoryblokDatasourceEntry,
  StoryblokFilterOperators,
  StoryblokFilterQuery,
  StoryblokLink,
  StoryblokLinksResponse,
  StoryblokManagerSdkOptions,
  StoryblokRetryOptions,
  StoryblokStoriesResponse,
  StoryblokStory,
  StoryblokStoryResponse,
  StoryblokTag,
  StoryblokTagsResponse,
} from './types';

describe('types validation', () => {
  describe('StoryblokStory interface', () => {
    it('should accept valid story objects', () => {
      const story: StoryblokStory = {
        id: 123,
        uuid: 'test-uuid',
        name: 'Test Story',
        slug: 'test-story',
        full_slug: 'blog/test-story',
        content: { title: 'Test Content' },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        published_at: '2024-01-01T00:00:00.000Z',
        first_published_at: '2024-01-01T00:00:00.000Z',
        sort_by_date: null,
        tag_list: ['featured', 'blog'],
        is_startpage: false,
        parent_id: null,
        meta_data: null,
        group_id: 'test-group',
        alternates: [],
        translated_slugs: [],
      };

      expect(story.id).toBe(123);
      expect(story.content.title).toBe('Test Content');
      expect(story.tag_list).toContain('featured');
    });

    it('should accept story with typed content', () => {
      interface BlogContent {
        title: string;
        body: string;
        author: string;
      }

      const story: StoryblokStory<BlogContent> = {
        id: 123,
        uuid: 'test-uuid',
        name: 'Test Story',
        slug: 'test-story',
        full_slug: 'blog/test-story',
        content: {
          title: 'Blog Title',
          body: 'Blog content here',
          author: 'John Doe',
        },
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
      };

      expect(story.content.title).toBe('Blog Title');
      expect(story.content.author).toBe('John Doe');
    });
  });

  describe('StoryblokStoriesResponse interface', () => {
    it('should accept valid stories response', () => {
      const response: StoryblokStoriesResponse = {
        stories: [],
        cv: 123456,
        rels: [],
        links: [],
      };

      expect(response.stories).toEqual([]);
      expect(response.cv).toBe(123456);
    });
  });

  describe('StoryblokStoryResponse interface', () => {
    it('should accept valid story response', () => {
      const response: StoryblokStoryResponse = {
        story: {
          id: 123,
          uuid: 'test-uuid',
          name: 'Test Story',
          slug: 'test-story',
          full_slug: 'blog/test-story',
          content: {},
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
      expect(response.cv).toBe(123456);
    });
  });

  describe('StoryblokFilterOperators interface', () => {
    it('should accept all filter operators', () => {
      const filters: StoryblokFilterOperators = {
        is: 'blog_post',
        not_in: 'draft',
        in: 'published,featured',
        not_in_array: 'hidden',
        in_array: 'featured',
        all_in_array: 'required',
        gt: 100,
        gte: '2024-01-01',
        lt: 1000,
        lte: '2024-12-31',
        like: 'Next.js',
        not_like: 'deprecated',
        regex: '^blog.*',
      };

      expect(filters.is).toBe('blog_post');
      expect(filters.gt).toBe(100);
      expect(filters.like).toBe('Next.js');
    });

    it('should accept boolean values', () => {
      const filters: StoryblokFilterOperators = {
        is: true,
        not_in: false,
      };

      expect(filters.is).toBe(true);
      expect(filters.not_in).toBe(false);
    });
  });

  describe('StoryblokFilterQuery type', () => {
    it('should accept complex filter queries', () => {
      const filterQuery: StoryblokFilterQuery = {
        component: { is: 'blog_post' },
        published: { is: true },
        created_at: { gte: '2024-01-01', lt: '2024-12-31' },
        tags: { in_array: 'featured' },
        title: { like: 'Next.js' },
        author: { not_in: 'draft-author' },
        priority: { gt: 5 },
      };

      expect(filterQuery.component).toEqual({ is: 'blog_post' });
      expect(filterQuery.published).toEqual({ is: true });
      expect(filterQuery.created_at).toEqual({
        gte: '2024-01-01',
        lt: '2024-12-31',
      });
    });

    it('should accept simple filter values', () => {
      const filterQuery: StoryblokFilterQuery = {
        component: 'blog_post',
        published: true,
        priority: 5,
        status: 'active',
      };

      expect(filterQuery.component).toBe('blog_post');
      expect(filterQuery.published).toBe(true);
      expect(filterQuery.priority).toBe(5);
    });
  });

  describe('GetStoriesParams interface', () => {
    it('should accept all valid parameters', () => {
      const params: GetStoriesParams = {
        starts_with: 'blog/',
        is_startpage: false,
        filter_query: {
          component: { is: 'blog_post' },
          published: { is: true },
        },
        sort_by: 'created_at',
        search_term: 'Next.js',
        page: 1,
        per_page: 25,
        cv: 123456,
        resolve_relations: ['blog_post:author', 'page:featured_story'],
        resolve_links: 'url',
        language: 'en',
        fallback_lang: 'default',
        version: 'published',
        custom_param: 'custom_value',
      };

      expect(params.starts_with).toBe('blog/');
      expect(params.filter_query?.component).toEqual({ is: 'blog_post' });
      expect(params.resolve_relations).toContain('blog_post:author');
    });

    it('should accept minimal parameters', () => {
      const params: GetStoriesParams = {};

      expect(params).toEqual({});
    });
  });

  describe('GetStoryParams interface', () => {
    it('should accept all valid parameters', () => {
      const params: GetStoryParams = {
        cv: 123456,
        resolve_relations: 'blog_post.author',
        resolve_links: 'story',
        language: 'en',
        fallback_lang: 'default',
        version: 'draft',
        find_by: 'uuid',
        custom_param: 'custom_value',
      };

      expect(params.resolve_relations).toBe('blog_post.author');
      expect(params.version).toBe('draft');
      expect(params.find_by).toBe('uuid');
    });

    it('should accept resolve_relations as array', () => {
      const params: GetStoryParams = {
        resolve_relations: ['blog_post.author', 'page.featured_story'],
      };

      expect(params.resolve_relations).toHaveLength(2);
    });
  });

  describe('GetLinksParams interface', () => {
    it('should accept all valid parameters', () => {
      const params: GetLinksParams = {
        starts_with: 'blog/',
        version: 'published',
        cv: 123456,
        with_parent: 0,
        include_dates: 1,
        page: 1,
        per_page: 100,
        paginated: 1,
      };

      expect(params.starts_with).toBe('blog/');
      expect(params.include_dates).toBe(1);
      expect(params.paginated).toBe(1);
    });
  });

  describe('BaseStoryblokOptions interface', () => {
    it('should accept all valid options', () => {
      const options: BaseStoryblokOptions = {
        baseURL: 'https://api.storyblok.com/v2/cdn',
        timeout: 15000,
        retry: {
          baseDelay: 100,
          maxDelay: 5000,
        },
        middlewares: [],
      };

      expect(options.baseURL).toBe('https://api.storyblok.com/v2/cdn');
      expect(options.retry?.baseDelay).toBe(100);
    });

    it('should accept minimal options', () => {
      const options: BaseStoryblokOptions = {};

      expect(options).toEqual({});
    });
  });

  describe('StoryblokManagerSdkOptions interface', () => {
    it('should accept management SDK options', () => {
      const options: StoryblokManagerSdkOptions = {
        personalAccessToken: 'personal-token',
        oauthToken: 'oauth-token',
        baseURL: 'https://mapi.storyblok.com/v1',
        timeout: 20000,
      };

      expect(options.personalAccessToken).toBe('personal-token');
      expect(options.oauthToken).toBe('oauth-token');
    });
  });

  describe('StoryblokRetryOptions interface', () => {
    it('should accept retry configuration', () => {
      const retryOptions: StoryblokRetryOptions = {
        baseDelay: 50,
        maxDelay: 2000,
      };

      expect(retryOptions.baseDelay).toBe(50);
      expect(retryOptions.maxDelay).toBe(2000);
    });
  });

  describe('StoryblokTag interface', () => {
    it('should accept valid tag objects', () => {
      const tag: StoryblokTag = {
        name: 'featured',
        taggings_count: 42,
      };

      expect(tag.name).toBe('featured');
      expect(tag.taggings_count).toBe(42);
    });
  });

  describe('StoryblokTagsResponse interface', () => {
    it('should accept valid tags response', () => {
      const response: StoryblokTagsResponse = {
        tags: [
          { name: 'featured', taggings_count: 42 },
          { name: 'blog', taggings_count: 15 },
        ],
      };

      expect(response.tags).toHaveLength(2);
      expect(response.tags[0].name).toBe('featured');
    });
  });

  describe('StoryblokLink interface', () => {
    it('should accept valid link objects', () => {
      const link: StoryblokLink = {
        id: 123,
        uuid: 'link-uuid',
        slug: 'my-page',
        path: '/my-page',
        real_path: '/my-page',
        name: 'My Page',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 1,
      };

      expect(link.id).toBe(123);
      expect(link.published).toBe(true);
    });

    it('should accept link with optional fields', () => {
      const link: StoryblokLink = {
        id: 123,
        uuid: 'link-uuid',
        slug: 'my-page',
        path: '/my-page',
        real_path: '/my-page',
        name: 'My Page',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 1,
        published_at: '2024-01-01T00:00:00.000Z',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        alternates: [
          {
            path: '/en/my-page',
            name: 'My Page EN',
            lang: 'en',
            published: true,
            translated_slug: 'my-page-en',
          },
        ],
      };

      expect(link.published_at).toBe('2024-01-01T00:00:00.000Z');
      expect(link.alternates).toHaveLength(1);
    });
  });

  describe('StoryblokLinksResponse interface', () => {
    it('should accept valid links response', () => {
      const response: StoryblokLinksResponse = {
        links: {
          '123': {
            id: 123,
            uuid: 'link-uuid',
            slug: 'my-page',
            path: '/my-page',
            real_path: '/my-page',
            name: 'My Page',
            published: true,
            parent_id: null,
            is_folder: false,
            is_startpage: false,
            position: 1,
          },
        },
      };

      expect(response.links['123'].id).toBe(123);
      expect(response.links['123'].name).toBe('My Page');
    });
  });

  describe('StoryblokDatasourceEntry interface', () => {
    it('should accept valid datasource entries', () => {
      const entry: StoryblokDatasourceEntry = {
        name: 'United States',
        value: 'us',
        dimension_value: 'north-america',
      };

      expect(entry.name).toBe('United States');
      expect(entry.value).toBe('us');
      expect(entry.dimension_value).toBe('north-america');
    });

    it('should accept entry without dimension_value', () => {
      const entry: StoryblokDatasourceEntry = {
        name: 'United States',
        value: 'us',
      };

      expect(entry.name).toBe('United States');
      expect(entry.dimension_value).toBeUndefined();
    });
  });

  describe('StoryblokDatasourceEntriesResponse interface', () => {
    it('should accept valid datasource entries response', () => {
      const response: StoryblokDatasourceEntriesResponse = {
        datasource_entries: [
          { name: 'United States', value: 'us' },
          { name: 'Canada', value: 'ca', dimension_value: 'north-america' },
        ],
      };

      expect(response.datasource_entries).toHaveLength(2);
      expect(response.datasource_entries[0].name).toBe('United States');
    });
  });

  describe('type compatibility and inference', () => {
    it('should infer types correctly in function parameters', () => {
      function processStory<T>(story: StoryblokStory<T>): T {
        return story.content;
      }

      interface BlogContent {
        title: string;
        body: string;
      }

      const story: StoryblokStory<BlogContent> = {
        id: 123,
        uuid: 'test-uuid',
        name: 'Test Story',
        slug: 'test-story',
        full_slug: 'blog/test-story',
        content: {
          title: 'Blog Title',
          body: 'Blog content',
        },
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
      };

      const content = processStory(story);
      expect(content.title).toBe('Blog Title');
      expect(content.body).toBe('Blog content');
    });

    it('should work with union types', () => {
      function processVersion(version: 'draft' | 'published'): string {
        return version;
      }

      expect(processVersion('draft')).toBe('draft');
      expect(processVersion('published')).toBe('published');
    });

    it('should work with template literal types', () => {
      function processRelation(
        relation: `${string}.${string}`,
      ): [string, string] {
        const [component, field] = relation.split('.');
        return [component, field];
      }

      const [component, field] = processRelation('blog_post.author');
      expect(component).toBe('blog_post');
      expect(field).toBe('author');
    });
  });
});
