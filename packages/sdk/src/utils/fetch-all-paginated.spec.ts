import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAllPaginated } from "./fetch-all-paginated";

describe("fetchAllPaginated", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all items from single page", async () => {
    const mockFetchPage = vi.fn().mockResolvedValue({
      data: { items: [{ id: 1 }, { id: 2 }] },
      headers: { total: "2" },
    });

    const mockExtractItems = vi.fn((response) => response.items);

    const result = await fetchAllPaginated(mockFetchPage, mockExtractItems);

    expect(mockFetchPage).toHaveBeenCalledWith(1, 100);
    expect(mockExtractItems).toHaveBeenCalledWith({ items: [{ id: 1 }, { id: 2 }] });
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("should fetch all items from multiple pages", async () => {
    const mockFetchPage = vi
      .fn()
      .mockResolvedValueOnce({
        data: { items: new Array(100).fill(0).map((_, i) => ({ id: i })) },
        headers: { total: "150" },
      })
      .mockResolvedValueOnce({
        data: { items: new Array(50).fill(0).map((_, i) => ({ id: i + 100 })) },
        headers: { total: "150" },
      });

    const mockExtractItems = vi.fn((response) => response.items);

    const result = await fetchAllPaginated(mockFetchPage, mockExtractItems);

    expect(mockFetchPage).toHaveBeenCalledTimes(2);
    expect(mockFetchPage).toHaveBeenNthCalledWith(1, 1, 100);
    expect(mockFetchPage).toHaveBeenNthCalledWith(2, 2, 100);
    expect(result).toHaveLength(150);
  });

  it("should respect custom perPage option", async () => {
    const mockFetchPage = vi.fn().mockResolvedValue({
      data: { items: [{ id: 1 }] },
      headers: {},
    });

    const mockExtractItems = vi.fn((response) => response.items);

    await fetchAllPaginated(mockFetchPage, mockExtractItems, { perPage: 50 });

    expect(mockFetchPage).toHaveBeenCalledWith(1, 50);
  });

  it("should respect maxPages option", async () => {
    const mockFetchPage = vi.fn().mockResolvedValue({
      data: { items: new Array(100).fill(0).map((_, i) => ({ id: i })) },
      headers: { total: "1000" },
    });

    const mockExtractItems = vi.fn((response) => response.items);

    const result = await fetchAllPaginated(mockFetchPage, mockExtractItems, { maxPages: 2 });

    expect(mockFetchPage).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(200);
  });

  it("should call onProgress callback", async () => {
    const mockFetchPage = vi
      .fn()
      .mockResolvedValueOnce({
        data: { items: new Array(100).fill(0).map((_, i) => ({ id: i })) },
        headers: { total: "150" },
      })
      .mockResolvedValueOnce({
        data: { items: new Array(50).fill(0).map((_, i) => ({ id: i + 100 })) },
        headers: { total: "150" },
      });

    const mockExtractItems = vi.fn((response) => response.items);
    const mockOnProgress = vi.fn();

    await fetchAllPaginated(mockFetchPage, mockExtractItems, { onProgress: mockOnProgress });

    expect(mockOnProgress).toHaveBeenCalledTimes(2);
    expect(mockOnProgress).toHaveBeenNthCalledWith(1, 1, 100, 150);
    expect(mockOnProgress).toHaveBeenNthCalledWith(2, 2, 150, 150);
  });

  it("should handle missing total header", async () => {
    const mockFetchPage = vi.fn().mockResolvedValue({
      data: { items: [{ id: 1 }] },
      headers: {}, // No total header
    });

    const mockExtractItems = vi.fn((response) => response.items);
    const mockOnProgress = vi.fn();

    await fetchAllPaginated(mockFetchPage, mockExtractItems, { onProgress: mockOnProgress });

    expect(mockOnProgress).toHaveBeenCalledWith(1, 1, undefined);
  });

  it("should stop when fewer items returned than requested", async () => {
    const mockFetchPage = vi
      .fn()
      .mockResolvedValueOnce({
        data: { items: new Array(100).fill(0).map((_, i) => ({ id: i })) },
        headers: {},
      })
      .mockResolvedValueOnce({
        data: { items: new Array(25).fill(0).map((_, i) => ({ id: i + 100 })) }, // Less than perPage
        headers: {},
      });

    const mockExtractItems = vi.fn((response) => response.items);

    const result = await fetchAllPaginated(mockFetchPage, mockExtractItems);

    expect(mockFetchPage).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(125);
  });

  it("should limit perPage to 100", async () => {
    const mockFetchPage = vi.fn().mockResolvedValue({
      data: { items: [] },
      headers: {},
    });

    const mockExtractItems = vi.fn((response) => response.items);

    await fetchAllPaginated(mockFetchPage, mockExtractItems, { perPage: 200 });

    expect(mockFetchPage).toHaveBeenCalledWith(1, 100); // Should be limited to 100
  });
});
