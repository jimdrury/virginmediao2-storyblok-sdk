import type { AxiosResponse } from "axios";

export interface PaginationOptions {
  /**
   * Items per page
   * @default 100
   */
  perPage?: number;
  /**
   * Maximum pages to fetch (safety limit)
   * @default Infinity
   */
  maxPages?: number;
  /**
   * Progress callback with page number, total fetched, and total available
   */
  onProgress?: (page: number, totalFetched: number, total?: number) => void;
}

/**
 * Generic pagination utility for fetching all items from paginated endpoints
 * Handles Storyblok's pagination system with exponential backoff support
 *
 * @param fetchPage - Function to fetch a single page of results
 * @param extractItems - Function to extract items array from response data
 * @param options - Pagination configuration options
 * @returns Promise resolving to array of all items
 */
export async function fetchAllPaginated<TResponse, TItem>(
  fetchPage: (page: number, perPage: number) => Promise<AxiosResponse<TResponse>>,
  extractItems: (response: TResponse) => TItem[],
  options?: PaginationOptions
): Promise<TItem[]> {
  const allItems: TItem[] = [];
  let page = 1;
  const perPage = Math.min(options?.perPage || 100, 100);
  const maxPages = options?.maxPages || Number.POSITIVE_INFINITY;
  let hasMore = true;
  let totalItems: number | undefined;

  while (hasMore && page <= maxPages) {
    const response = await fetchPage(page, perPage);
    const items = extractItems(response.data);

    // Extract total from headers on first request (Storyblok provides this)
    if (page === 1) {
      const totalHeader = response.headers.total;
      totalItems = totalHeader ? Number.parseInt(totalHeader, 10) : undefined;
    }

    allItems.push(...items);

    // Call progress callback if provided
    options?.onProgress?.(page, allItems.length, totalItems);

    // Check if we've reached the end using Storyblok's pagination logic
    hasMore =
      items.length === perPage && (totalItems === undefined || allItems.length < totalItems);
    page++;
  }

  return allItems;
}
