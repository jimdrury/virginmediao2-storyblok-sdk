import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OSS_BLOK } from '@/storyblok/bloks';
import { OssTileGrid, type OssTileGridBlok } from './oss-tile-grid.blok';

// Mock storyblokEditable
vi.mock('@/storyblok/engine', () => ({
  storyblokEditable: (blok: { _uid: string }) => ({
    'data-blok-c': blok._uid,
    'data-blok-uid': blok._uid,
  }),
}));

describe('OssTileGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlok: OssTileGridBlok = {
    _uid: 'tile-grid-uid',
    component: OSS_BLOK.TILE_GRID,
    content: [
      {
        _uid: 'tile-1',
        component: OSS_BLOK.TEXT,
      },
      {
        _uid: 'tile-2',
        component: OSS_BLOK.TEXT,
      },
      {
        _uid: 'tile-3',
        component: OSS_BLOK.TEXT,
      },
    ],
  };

  const MockStoryblokComponent = vi.fn(({ blok }) => (
    <div data-testid={`blok-${blok._uid}`}>Tile {blok._uid}</div>
  ));

  it('renders all tiles', () => {
    render(
      <OssTileGrid
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(screen.getByTestId('blok-tile-1')).toBeInTheDocument();
    expect(screen.getByTestId('blok-tile-2')).toBeInTheDocument();
    expect(screen.getByTestId('blok-tile-3')).toBeInTheDocument();
  });

  it('applies grid layout classes', () => {
    const { container } = render(
      <OssTileGrid
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('gap-4');
  });

  it('applies storyblok editable attributes', () => {
    const { container } = render(
      <OssTileGrid
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-blok-c', 'tile-grid-uid');
    expect(wrapper).toHaveAttribute('data-blok-uid', 'tile-grid-uid');
  });

  it('renders empty grid when no tiles provided', () => {
    const emptyBlok = { ...mockBlok, content: [] };

    const { container } = render(
      <OssTileGrid
        blok={emptyBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid.children).toHaveLength(0);
  });

  it('calls StoryblokComponent for each tile', () => {
    render(
      <OssTileGrid
        blok={mockBlok}
        StoryblokComponent={MockStoryblokComponent}
      />,
    );

    expect(MockStoryblokComponent).toHaveBeenCalledTimes(3);

    const calls = MockStoryblokComponent.mock.calls;
    expect(calls[0][0]).toMatchObject({ blok: mockBlok.content[0] });
    expect(calls[1][0]).toMatchObject({ blok: mockBlok.content[1] });
    expect(calls[2][0]).toMatchObject({ blok: mockBlok.content[2] });
  });
});
