import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import { OssTile, type OssTileBlok } from './oss-tile.blok';

// Mock Next Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    target,
    rel,
    className,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    className?: string;
  }) => (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      data-testid="tile-link"
      {...props}
    >
      {children}
    </a>
  ),
}));

// Mock storyblokEditable
vi.mock('@/storyblok/engine', () => ({
  storyblokEditable: (blok: { _uid: string }) => ({
    'data-blok-c': blok._uid,
    'data-blok-uid': blok._uid,
  }),
}));

describe('OssTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with story link', () => {
    const mockBlok: OssTileBlok = {
      _uid: 'tile-uid',
      component: OSS_BLOK.TILE,
      title: 'Test Title',
      description: 'Test description',
      link: {
        id: 'link-1',
        url: '/test-page',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: '/test-page',
        story: {
          id: 123,
          uuid: 'test-uuid',
          name: 'Test Page',
          slug: 'test-page',
          full_slug: '/test-page',
          default_full_slug: '/test-page',
          created_at: '2024-01-01',
          published_at: '2024-01-01',
          first_published_at: '2024-01-01',
          is_startpage: false,
          parent_id: 0,
          group_id: 'group-1',
          position: 0,
          tag_list: [],
          content: {},
        },
      },
    };

    render(<OssTile blok={mockBlok} />);

    const link = screen.getByTestId('tile-link');
    expect(link).toHaveAttribute('href', '/test-page');
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders error when link has no story', () => {
    const mockBlok: OssTileBlok = {
      _uid: 'tile-uid',
      component: OSS_BLOK.TILE,
      title: 'Test Title',
      description: 'Test description',
      link: {
        id: 'link-1',
        url: 'https://example.com',
        linktype: 'url',
        fieldtype: 'multilink',
        cached_url: 'https://example.com',
      },
    };

    render(<OssTile blok={mockBlok} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Tiles must have a link.')).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    const mockBlok: OssTileBlok = {
      _uid: 'tile-uid',
      component: OSS_BLOK.TILE,
      title: 'Test Title',
      description: '',
      link: {
        id: 'link-1',
        url: '/test-page',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: '/test-page',
        story: {
          id: 123,
          uuid: 'test-uuid',
          name: 'Test Page',
          slug: 'test-page',
          full_slug: '/test-page',
          default_full_slug: '/test-page',
          created_at: '2024-01-01',
          published_at: '2024-01-01',
          first_published_at: '2024-01-01',
          is_startpage: false,
          parent_id: 0,
          group_id: 'group-1',
          position: 0,
          tag_list: [],
          content: {},
        },
      },
    };

    const { container } = render(<OssTile blok={mockBlok} />);

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('applies card styling classes', () => {
    const mockBlok: OssTileBlok = {
      _uid: 'tile-uid',
      component: OSS_BLOK.TILE,
      title: 'Test Title',
      description: 'Test description',
      link: {
        id: 'link-1',
        url: '/test-page',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: '/test-page',
        story: {
          id: 123,
          uuid: 'test-uuid',
          name: 'Test Page',
          slug: 'test-page',
          full_slug: '/test-page',
          default_full_slug: '/test-page',
          created_at: '2024-01-01',
          published_at: '2024-01-01',
          first_published_at: '2024-01-01',
          is_startpage: false,
          parent_id: 0,
          group_id: 'group-1',
          position: 0,
          tag_list: [],
          content: {},
        },
      },
    };

    const { container } = render(<OssTile blok={mockBlok} />);

    const card = container.querySelector('.card');
    expect(card).toHaveClass('bg-base-100', 'shadow-sm');
  });

  it('applies storyblok editable attributes', () => {
    const mockBlok: OssTileBlok = {
      _uid: 'tile-uid',
      component: OSS_BLOK.TILE,
      title: 'Test Title',
      description: 'Test description',
      link: {
        id: 'link-1',
        url: '/test-page',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: '/test-page',
        story: {
          id: 123,
          uuid: 'test-uuid',
          name: 'Test Page',
          slug: 'test-page',
          full_slug: '/test-page',
          default_full_slug: '/test-page',
          created_at: '2024-01-01',
          published_at: '2024-01-01',
          first_published_at: '2024-01-01',
          is_startpage: false,
          parent_id: 0,
          group_id: 'group-1',
          position: 0,
          tag_list: [],
          content: {},
        },
      },
    };

    const { container } = render(<OssTile blok={mockBlok} />);

    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('data-blok-c', 'tile-uid');
    expect(card).toHaveAttribute('data-blok-uid', 'tile-uid');
  });

  it('renders link with correct href', () => {
    const mockBlok: OssTileBlok = {
      _uid: 'tile-uid',
      component: OSS_BLOK.TILE,
      title: 'Test Title',
      description: 'Test description',
      link: {
        id: 'link-1',
        url: '/custom-page',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: '/custom-page',
        story: {
          id: 123,
          uuid: 'test-uuid',
          name: 'Custom Page',
          slug: 'custom-page',
          full_slug: '/custom-page',
          default_full_slug: '/custom-page',
          created_at: '2024-01-01',
          published_at: '2024-01-01',
          first_published_at: '2024-01-01',
          is_startpage: false,
          parent_id: 0,
          group_id: 'group-1',
          position: 0,
          tag_list: [],
          content: {},
        },
      },
    };

    render(<OssTile blok={mockBlok} />);

    const link = screen.getByTestId('tile-link');
    expect(link).toHaveAttribute('href', '/custom-page');
    expect(link).toHaveClass('btn', 'btn-circle');
  });
});
