import { render, screen } from '@testing-library/react';
import type { StoryblokLink } from '@virginmediao2/storyblok-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumbs } from './breadcrumbs';

// Mock getAllLinksWithFolders
vi.mock('@/storyblok/utils/get-all-links', () => ({
  getAllLinksWithFolders: vi.fn(),
}));

// Mock buildBreadcrumbTrail
vi.mock('./build-breadcrumb-trail', () => ({
  buildBreadcrumbTrail: vi.fn(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch,
  }: {
    children: React.ReactNode;
    href: string;
    prefetch?: boolean;
  }) => (
    <a href={href} data-prefetch={prefetch?.toString()}>
      {children}
    </a>
  ),
}));

describe('Breadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render home link', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    vi.mocked(getAllLinksWithFolders).mockResolvedValue([] as StoryblokLink[]);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue([]);

    const result = await Breadcrumbs({ storyId: 1 });
    const { container } = render(result);

    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).toBeInTheDocument();
  });

  it('should render breadcrumb trail for nested page', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    const mockLinks: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'docs',
        path: 'docs',
        real_path: '/docs',
        name: 'Documentation',
        published: true,
        parent_id: null,
        is_folder: true,
        is_startpage: false,
        position: 0,
      },
      {
        id: 2,
        uuid: 'uuid-2',
        slug: 'getting-started',
        path: 'docs/getting-started',
        real_path: '/docs/getting-started',
        name: 'Getting Started',
        published: true,
        parent_id: 1,
        is_folder: false,
        is_startpage: false,
        position: 1,
      },
    ];

    vi.mocked(getAllLinksWithFolders).mockResolvedValue(mockLinks);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue(mockLinks);

    const result = await Breadcrumbs({ storyId: 2 });
    const { container } = render(result);

    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();

    const docsLink = container.querySelector('a[href="/docs"]');
    expect(docsLink).toBeInTheDocument();
  });

  it('should render last breadcrumb as span with aria-current', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    const mockLinks: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'docs',
        path: 'docs',
        real_path: '/docs',
        name: 'Documentation',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
      {
        id: 2,
        uuid: 'uuid-2',
        slug: 'getting-started',
        path: 'docs/getting-started',
        real_path: '/docs/getting-started',
        name: 'Getting Started',
        published: true,
        parent_id: 1,
        is_folder: false,
        is_startpage: false,
        position: 1,
      },
    ];

    vi.mocked(getAllLinksWithFolders).mockResolvedValue(mockLinks);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue(mockLinks);

    const result = await Breadcrumbs({ storyId: 2 });
    const { container } = render(result);

    const currentPage = screen.getByText('Getting Started');
    expect(currentPage.tagName).toBe('SPAN');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
    expect(currentPage).toHaveClass('font-semibold');

    // Documentation should be a link
    const docsLink = container.querySelector('a[href="/docs"]');
    expect(docsLink).toBeInTheDocument();
    expect(docsLink?.textContent).toBe('Documentation');
  });

  it('should render empty trail with only home link', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    vi.mocked(getAllLinksWithFolders).mockResolvedValue([]);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue([]);

    const result = await Breadcrumbs({ storyId: 1 });
    const { container } = render(result);

    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).toBeInTheDocument();

    // Should only have one list item (home)
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(1);
  });

  it('should disable prefetch on all links', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    const mockLinks: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'docs',
        path: 'docs',
        real_path: '/docs',
        name: 'Documentation',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
    ];

    vi.mocked(getAllLinksWithFolders).mockResolvedValue(mockLinks);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue(mockLinks);

    const result = await Breadcrumbs({ storyId: 1 });
    const { container } = render(result);

    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link).toHaveAttribute('data-prefetch', 'false');
    });
  });

  it('should render breadcrumbs with correct CSS classes', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    vi.mocked(getAllLinksWithFolders).mockResolvedValue([]);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue([]);

    const result = await Breadcrumbs({ storyId: 1 });
    const { container } = render(result);

    const breadcrumbsDiv = container.querySelector('.breadcrumbs');
    expect(breadcrumbsDiv).toBeInTheDocument();
    expect(breadcrumbsDiv).toHaveClass('text-sm', 'pl-1');
  });

  it('should call buildBreadcrumbTrail with correct arguments', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    const mockLinks: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'docs',
        path: 'docs',
        real_path: '/docs',
        name: 'Documentation',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
    ];

    vi.mocked(getAllLinksWithFolders).mockResolvedValue(mockLinks);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue(mockLinks);

    await Breadcrumbs({ storyId: 5 });

    expect(buildBreadcrumbTrail).toHaveBeenCalledWith(mockLinks, 5);
  });

  it('should render home icon in first breadcrumb', async () => {
    const { getAllLinksWithFolders } = await import(
      '@/storyblok/utils/get-all-links'
    );
    const { buildBreadcrumbTrail } = await import('./build-breadcrumb-trail');

    vi.mocked(getAllLinksWithFolders).mockResolvedValue([]);
    vi.mocked(buildBreadcrumbTrail).mockReturnValue([]);

    const result = await Breadcrumbs({ storyId: 1 });
    const { container } = render(result);

    const homeLink = container.querySelector('a[href="/"]');
    const svg = homeLink?.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-4', 'h-4');
  });
});
