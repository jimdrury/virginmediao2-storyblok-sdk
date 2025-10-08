import type { StoryblokLink } from '@virginmediao2/storyblok-sdk/src';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

interface NavigationTreeProps {
  links: StoryblokLink[];
  currentSlug?: string;
}

interface TreeNode extends StoryblokLink {
  children: TreeNode[];
}

/**
 * Builds a hierarchical tree structure from flat links array
 */
function buildTree(links: StoryblokLink[]): TreeNode[] {
  // Create a map for quick lookup
  const linkMap = new Map<number, TreeNode>();

  // Initialize all nodes with empty children arrays
  links.forEach((link) => {
    linkMap.set(link.id, { ...link, children: [] });
  });

  const rootNodes: TreeNode[] = [];

  // Build the tree structure
  links.forEach((link) => {
    const node = linkMap.get(link.id);
    if (!node) {
      return;
    }

    if (link.parent_id === null || link.parent_id === 0) {
      // Root level node
      rootNodes.push(node);
    } else {
      // Child node - add to parent's children
      const parent = linkMap.get(link.parent_id);
      if (parent) {
        parent.children.push(node);
      } else {
        // Parent not found, treat as root
        rootNodes.push(node);
      }
    }
  });

  // Replace folders with their startpage documents
  const replaceFoldersWithStartpages = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      if (node.is_folder && node.children.length > 0) {
        // Find the startpage child
        const startpage = node.children.find((child) => child.is_startpage);

        if (startpage) {
          // Get all non-startpage children
          const otherChildren = node.children.filter(
            (child) => !child.is_startpage,
          );

          // Replace the folder with the startpage, inheriting the folder's position
          return {
            ...startpage,
            position: node.position, // Use folder's position for proper sorting
            children: replaceFoldersWithStartpages(otherChildren),
          };
        }
      }

      // For non-folder nodes or folders without startpage, recurse on children
      return {
        ...node,
        children: replaceFoldersWithStartpages(node.children),
      };
    });
  };

  // Sort all levels by position
  const sortByPosition = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => a.position - b.position)
      .map((node) => ({
        ...node,
        children: sortByPosition(node.children),
      }));
  };

  // Replace folders with their startpages first
  const withStartpagesReplaced = replaceFoldersWithStartpages(rootNodes);

  // Remove top-level folders but promote their children to root level
  const filteredRootNodes = withStartpagesReplaced.reduce<TreeNode[]>(
    (acc, node) => {
      if (node.is_folder && node.parent_id === null) {
        acc.push(...node.children);
      } else {
        // Keep non-folder nodes
        acc.push(node);
      }
      return acc;
    },
    [],
  );

  return sortByPosition(filteredRootNodes);
}

interface TreeNodeComponentProps {
  node: TreeNode;
  level?: number;
  currentSlug?: string;
}

/**
 * Renders a tree node and its children recursively
 */
const TreeNodeComponent: FC<TreeNodeComponentProps> = ({
  node,
  level = 0,
  currentSlug,
}) => {
  const hasChildren = node.children.length > 0;

  // Normalize paths for comparison (remove leading/trailing slashes)
  const normalizePath = (path: string) => path.replace(/^\/|\/$/g, '');
  const normalizedCurrentSlug = currentSlug ? normalizePath(currentSlug) : '';
  const normalizedNodePath = normalizePath(node.real_path);

  // Check if this is the current page
  const isCurrentPage = currentSlug
    ? normalizedCurrentSlug === normalizedNodePath
    : false;

  // Check if current page is a child of this node
  const isActiveParent = currentSlug
    ? hasChildren &&
      normalizedCurrentSlug.startsWith(`${normalizedNodePath}/`) &&
      normalizedCurrentSlug !== normalizedNodePath
    : false;

  // Only show children if we're on this page or a child of it
  const shouldShowChildren = hasChildren && (isCurrentPage || isActiveParent);

  return (
    <li>
      <Link
        className={clsx({
          link: true,
          'link-hover': true,
          'font-bold': isCurrentPage || isActiveParent,
          underline: isCurrentPage,
        })}
        href={node.real_path}
      >
        {node.name}
      </Link>
      {shouldShowChildren && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.uuid}
              node={child}
              level={level + 1}
              currentSlug={currentSlug}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Navigation Tree Component
 *
 * Builds and displays a hierarchical navigation structure from a flat array of links.
 * Links are organized by parent_id and sorted by position attribute.
 *
 * Filtering rules:
 * - Top-level folders (folders with parent_id === null) are not rendered,
 *   but their children are promoted to the root level.
 * - Folders are replaced by their startpage document in the navigation hierarchy.
 *   The startpage inherits the folder's children (excluding itself) and position.
 *
 * Active state behavior (requires currentSlug):
 * - Children are only shown if the current page is the parent or a child of the parent.
 * - The current page is rendered bold and underlined.
 * - Parent pages with active children are rendered bold.
 * - If currentSlug is undefined, all items are rendered without active states.
 */
export const NavigationTree: FC<NavigationTreeProps> = ({
  links,
  currentSlug,
}) => {
  const tree = buildTree(links);

  return (
    <ul className="menu w-full">
      {tree.map((node) => (
        <TreeNodeComponent
          key={node.uuid}
          node={node}
          currentSlug={currentSlug}
        />
      ))}
    </ul>
  );
};
