import type { StoryblokLink } from '@virginmediao2/storyblok-sdk';
import { describe, expect, it } from 'vitest';
import { buildBreadcrumbTrail } from './build-breadcrumb-trail';

describe('buildBreadcrumbTrail', () => {
  const mockLinks: StoryblokLink[] = [
    {
      id: 1,
      uuid: 'uuid-1',
      slug: 'home',
      path: '',
      real_path: '/',
      name: 'Home',
      published: true,
      parent_id: null,
      is_folder: false,
      is_startpage: true,
      position: 0,
    },
    {
      id: 2,
      uuid: 'uuid-2',
      slug: 'docs',
      path: 'docs',
      real_path: '/docs',
      name: 'Documentation',
      published: true,
      parent_id: null,
      is_folder: true,
      is_startpage: false,
      position: 1,
    },
    {
      id: 3,
      uuid: 'uuid-3',
      slug: 'docs-home',
      path: 'docs',
      real_path: '/docs',
      name: 'Docs Home',
      published: true,
      parent_id: 2,
      is_folder: false,
      is_startpage: true,
      position: 0,
    },
    {
      id: 4,
      uuid: 'uuid-4',
      slug: 'getting-started',
      path: 'docs/getting-started',
      real_path: '/docs/getting-started',
      name: 'Getting Started',
      published: true,
      parent_id: 2,
      is_folder: false,
      is_startpage: false,
      position: 1,
    },
    {
      id: 5,
      uuid: 'uuid-5',
      slug: 'installation',
      path: 'docs/getting-started/installation',
      real_path: '/docs/getting-started/installation',
      name: 'Installation',
      published: true,
      parent_id: 4,
      is_folder: false,
      is_startpage: false,
      position: 0,
    },
  ];

  it('should return empty array when story ID is not found', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 999);
    expect(trail).toEqual([]);
  });

  it('should return single item for root page', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 1);
    expect(trail).toEqual([mockLinks[0]]);
  });

  it('should build trail for nested page', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 5);

    // Installation -> Getting Started -> Documentation folder
    // Folder is kept because Getting Started is NOT a startpage
    expect(trail).toHaveLength(3);
    expect(trail[0].name).toBe('Documentation');
    expect(trail[1].name).toBe('Getting Started');
    expect(trail[2].name).toBe('Installation');
  });

  it('should remove folder when followed by startpage', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 3);

    // Should not include 'Documentation' folder since it's followed by 'Docs Home' startpage
    expect(trail).toHaveLength(1);
    expect(trail[0].name).toBe('Docs Home');
  });

  it('should handle page with direct folder parent', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 4);

    // Getting Started has Documentation folder as parent
    // Folder is kept because Getting Started is NOT a startpage
    expect(trail).toHaveLength(2);
    expect(trail[0].name).toBe('Documentation');
    expect(trail[1].name).toBe('Getting Started');
  });

  it('should handle missing parent gracefully', () => {
    const brokenLinks: StoryblokLink[] = [
      {
        id: 10,
        uuid: 'uuid-10',
        slug: 'orphan',
        path: 'orphan',
        real_path: '/orphan',
        name: 'Orphan Page',
        published: true,
        parent_id: 999, // Parent doesn't exist
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
    ];

    const trail = buildBreadcrumbTrail(brokenLinks, 10);

    // Should still return the page even if parent is missing
    expect(trail).toHaveLength(1);
    expect(trail[0].name).toBe('Orphan Page');
  });

  it('should handle empty links array', () => {
    const trail = buildBreadcrumbTrail([], 1);
    expect(trail).toEqual([]);
  });

  it('should preserve order from root to current page', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 5);

    // Verify the order is correct: root -> intermediate -> current
    expect(trail[0].id).toBe(2); // Documentation folder
    expect(trail[1].id).toBe(4); // Getting Started
    expect(trail[2].id).toBe(5); // Installation (current page)
  });

  it('should handle page with parent_id of 0', () => {
    const linksWithZeroParent: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'page',
        path: 'page',
        real_path: '/page',
        name: 'Page',
        published: true,
        parent_id: 0,
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
    ];

    const trail = buildBreadcrumbTrail(linksWithZeroParent, 1);
    expect(trail).toHaveLength(1);
    expect(trail[0].name).toBe('Page');
  });

  it('should keep folder if not followed by startpage', () => {
    const trail = buildBreadcrumbTrail(mockLinks, 4);

    // Getting Started is not a startpage, so folder is kept
    expect(trail[0].name).toBe('Documentation');
    expect(trail[1].name).toBe('Getting Started');
  });
});
