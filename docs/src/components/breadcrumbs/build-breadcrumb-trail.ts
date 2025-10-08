import type { StoryblokLink } from '@virginmediao2/storyblok-sdk';

export const buildBreadcrumbTrail = (
  links: StoryblokLink[],
  currentStoryId: number,
): StoryblokLink[] => {
  // Create a map for quick lookup by ID
  const linkMap = new Map<number, StoryblokLink>();
  links.forEach((link) => {
    linkMap.set(link.id, link);
  });

  // Find the current page by story ID
  const currentPage = linkMap.get(currentStoryId);

  if (!currentPage) {
    return [];
  }

  // Build the trail by following parent_id up to the root
  const trail: StoryblokLink[] = [currentPage];
  let currentLink = currentPage;

  while (currentLink.parent_id !== null && currentLink.parent_id !== 0) {
    const parent = linkMap.get(currentLink.parent_id);
    if (!parent) {
      break;
    }
    trail.unshift(parent);
    currentLink = parent;
  }

  // Post-process: Remove folders where the next item is a start page
  // (the start page represents the folder, so we don't need both)
  const filteredTrail: StoryblokLink[] = [];
  for (let i = 0; i < trail.length; i++) {
    const current = trail[i];
    const next = trail[i + 1];

    // Skip folders if the next item is a start page
    if (current.is_folder && next && next.is_startpage) {
      continue;
    }

    filteredTrail.push(current);
  }

  return filteredTrail;
};
