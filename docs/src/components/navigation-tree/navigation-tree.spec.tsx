import { render, screen } from '@testing-library/react';
import type { StoryblokLink } from '@virginmediao2/storyblok-sdk/src';
import { describe, expect, it } from 'vitest';
import { NavigationTree } from './navigation-tree';

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
    slug: 'about',
    path: 'about',
    real_path: '/about',
    name: 'About',
    published: true,
    parent_id: null,
    is_folder: true,
    is_startpage: false,
    position: 1,
  },
  {
    id: 3,
    uuid: 'uuid-3',
    slug: 'team',
    path: 'about/team',
    real_path: '/about/team',
    name: 'Team',
    published: true,
    parent_id: 2,
    is_folder: false,
    is_startpage: false,
    position: 0,
  },
  {
    id: 4,
    uuid: 'uuid-4',
    slug: 'contact',
    path: 'about/contact',
    real_path: '/about/contact',
    name: 'Contact',
    published: true,
    parent_id: 2,
    is_folder: false,
    is_startpage: false,
    position: 1,
  },
  {
    id: 5,
    uuid: 'uuid-5',
    slug: 'services',
    path: 'services',
    real_path: '/services',
    name: 'Services',
    published: true,
    parent_id: null,
    is_folder: false,
    is_startpage: false,
    position: 2,
  },
];

describe('NavigationTree', () => {
  it('renders all links except top-level folders', () => {
    render(<NavigationTree links={mockLinks} currentSlug="/" />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    // About is a top-level folder, so it should NOT be rendered
    expect(screen.queryByText('About')).not.toBeInTheDocument();
    expect(screen.queryByText('📁 About')).not.toBeInTheDocument();
    // But its children should be rendered at root level
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('builds hierarchical structure based on parent_id', () => {
    // Add nested structure to test hierarchy
    const nestedLinks: StoryblokLink[] = [
      ...mockLinks,
      {
        id: 6,
        uuid: 'uuid-6',
        slug: 'team-uk',
        path: 'about/team/uk',
        real_path: '/about/team/uk',
        name: 'UK Team',
        published: true,
        parent_id: 3, // Child of Team
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
    ];

    const { container } = render(
      <NavigationTree links={nestedLinks} currentSlug="/about/team" />,
    );

    // Get all ul elements
    const lists = container.querySelectorAll('ul');

    // Should have nested lists for the hierarchy (root ul + nested ul for Team's children)
    expect(lists.length).toBeGreaterThan(1);
  });

  it('sorts links by position attribute', () => {
    render(<NavigationTree links={mockLinks} currentSlug="/" />);

    const links = screen.getAllByRole('link');

    // Root level should be: Home (0), Team (0 from About), Contact (1 from About), Services (2)
    // About folder is filtered out, its children are promoted
    expect(links[0]).toHaveTextContent('Home');
    expect(links[1]).toHaveTextContent('Team'); // Promoted from About folder
    expect(links[2]).toHaveTextContent('Contact'); // Promoted from About folder
    expect(links[3]).toHaveTextContent('Services');
  });

  it('replaces folders with their startpage documents', () => {
    const linksWithFolderAndStartpage: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'api',
        path: 'api',
        real_path: '/api',
        name: 'API',
        published: true,
        parent_id: null,
        is_folder: true,
        is_startpage: false,
        position: 0,
      },
      {
        id: 2,
        uuid: 'uuid-2',
        slug: 'api-overview',
        path: 'api',
        real_path: '/api',
        name: 'API Overview',
        published: true,
        parent_id: 1, // Child of API folder
        is_folder: false,
        is_startpage: true, // This is the startpage of API folder
        position: 0,
      },
      {
        id: 3,
        uuid: 'uuid-3',
        slug: 'api-authentication',
        path: 'api/authentication',
        real_path: '/api/authentication',
        name: 'Authentication',
        published: true,
        parent_id: 1, // Child of API folder
        is_folder: false,
        is_startpage: false,
        position: 1,
      },
    ];

    render(
      <NavigationTree links={linksWithFolderAndStartpage} currentSlug="/api" />,
    );

    // The folder should be replaced by its startpage "API Overview"
    expect(screen.getByText('API Overview')).toBeInTheDocument();
    // The startpage should have the folder's other children
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    // The folder itself should not be rendered
    expect(screen.queryByText('API')).not.toBeInTheDocument();
  });

  it('handles links with missing parent gracefully', () => {
    const linksWithMissingParent: StoryblokLink[] = [
      ...mockLinks,
      {
        id: 99,
        uuid: 'uuid-99',
        slug: 'orphan',
        path: 'orphan',
        real_path: '/orphan',
        name: 'Orphan',
        published: true,
        parent_id: 999, // Parent doesn't exist
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
    ];

    render(<NavigationTree links={linksWithMissingParent} currentSlug="/" />);

    // Orphan should still render (treated as root)
    expect(screen.getByText('Orphan')).toBeInTheDocument();
  });

  it('renders correct links with href attributes', () => {
    render(<NavigationTree links={mockLinks} currentSlug="/" />);

    const homeLink = screen.getByText('Home').closest('a');
    const servicesLink = screen.getByText('Services').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(servicesLink).toHaveAttribute('href', '/services');
  });

  it('replaces top-level folders with startpage and shows children', () => {
    const linksWithStartpage: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'docs',
        path: 'docs',
        real_path: '/docs',
        name: 'Docs',
        published: true,
        parent_id: null,
        is_folder: true,
        is_startpage: false,
        position: 0,
      },
      {
        id: 2,
        uuid: 'uuid-2',
        slug: 'docs-index',
        path: 'docs',
        real_path: '/docs',
        name: 'Docs Index',
        published: true,
        parent_id: 1, // Child of Docs folder
        is_folder: false,
        is_startpage: true, // This is the startpage of the Docs folder
        position: 0,
      },
      {
        id: 3,
        uuid: 'uuid-3',
        slug: 'getting-started',
        path: 'docs/getting-started',
        real_path: '/docs/getting-started',
        name: 'Getting Started',
        published: true,
        parent_id: 1, // Child of Docs folder
        is_folder: false,
        is_startpage: false,
        position: 1,
      },
    ];

    render(<NavigationTree links={linksWithStartpage} currentSlug="/docs" />);

    // The startpage "Docs Index" should be rendered (replaces the folder)
    expect(screen.getByText('Docs Index')).toBeInTheDocument();

    // "Getting Started" should be rendered as a child of the startpage
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });

  it('handles nested folder replacement with startpages', () => {
    const linksWithNestedFolders: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'guides',
        path: 'guides',
        real_path: '/guides',
        name: 'Guides',
        published: true,
        parent_id: null,
        is_folder: true,
        is_startpage: false,
        position: 0,
      },
      {
        id: 2,
        uuid: 'uuid-2',
        slug: 'guides-home',
        path: 'guides',
        real_path: '/guides',
        name: 'Guides Home',
        published: true,
        parent_id: 1, // Child of Guides folder
        is_folder: false,
        is_startpage: true, // Startpage for Guides folder
        position: 0,
      },
      {
        id: 3,
        uuid: 'uuid-3',
        slug: 'beginner',
        path: 'guides/beginner',
        real_path: '/guides/beginner',
        name: 'Beginner',
        published: true,
        parent_id: 1, // Child of Guides folder
        is_folder: true,
        is_startpage: false,
        position: 1,
      },
      {
        id: 4,
        uuid: 'uuid-4',
        slug: 'beginner-intro',
        path: 'guides/beginner',
        real_path: '/guides/beginner',
        name: 'Beginner Intro',
        published: true,
        parent_id: 3, // Child of Beginner folder
        is_folder: false,
        is_startpage: true, // Startpage for Beginner folder
        position: 0,
      },
    ];

    render(
      <NavigationTree links={linksWithNestedFolders} currentSlug="/guides" />,
    );

    // The Guides folder should be replaced by "Guides Home"
    expect(screen.getByText('Guides Home')).toBeInTheDocument();

    // The Beginner folder should be replaced by "Beginner Intro" and shown as child
    expect(screen.getByText('Beginner Intro')).toBeInTheDocument();

    // Folder names themselves should not appear
    expect(screen.queryByText('Guides')).not.toBeInTheDocument();
    expect(screen.queryByText('Beginner')).not.toBeInTheDocument();
  });

  it('respects folder position when replacing with startpage', () => {
    const linksWithMixedPositions: StoryblokLink[] = [
      {
        id: 1,
        uuid: 'uuid-1',
        slug: 'intro',
        path: 'intro',
        real_path: '/intro',
        name: 'Introduction',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 0,
      },
      {
        id: 2,
        uuid: 'uuid-2',
        slug: 'api',
        path: 'api',
        real_path: '/api',
        name: 'API',
        published: true,
        parent_id: null,
        is_folder: true,
        is_startpage: false,
        position: 2, // Folder positioned at 2
      },
      {
        id: 3,
        uuid: 'uuid-3',
        slug: 'api-home',
        path: 'api',
        real_path: '/api',
        name: 'API Reference',
        published: true,
        parent_id: 2,
        is_folder: false,
        is_startpage: true,
        position: 999, // Startpage has different position, should inherit folder's
      },
      {
        id: 4,
        uuid: 'uuid-4',
        slug: 'guides',
        path: 'guides',
        real_path: '/guides',
        name: 'Guides',
        published: true,
        parent_id: null,
        is_folder: false,
        is_startpage: false,
        position: 1,
      },
    ];

    render(<NavigationTree links={linksWithMixedPositions} currentSlug="/" />);

    const links = screen.getAllByRole('link');

    // Should be sorted: Introduction (0), Guides (1), API Reference (2 - inherited from folder)
    expect(links[0]).toHaveTextContent('Introduction');
    expect(links[1]).toHaveTextContent('Guides');
    expect(links[2]).toHaveTextContent('API Reference'); // Should respect folder position (2)
  });

  it('handles undefined currentSlug gracefully', () => {
    render(<NavigationTree links={mockLinks} />);

    // All links should render
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();

    // No items should be marked as current or have children shown
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).not.toHaveClass('font-bold');
      expect(link).not.toHaveClass('underline');
    });
  });
});
