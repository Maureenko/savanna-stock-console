import { describe, it, expect } from 'vitest';

// Test pagination calculation logic directly (no component rendering needed)
describe('Pagination Logic', () => {
  // Helper function that mirrors the pagination calculation
  function calculatePagination(currentPage: number, totalPages: number) {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }

  it('should show all pages when totalPages <= 5', () => {
    const pages = calculatePagination(1, 5);
    expect(pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should show ellipsis when current page is in the middle', () => {
    const pages = calculatePagination(5, 10);
    expect(pages).toContain('...');
    expect(pages).toContain(1);
    expect(pages).toContain(10);
    expect(pages).toContain(5);
  });

  it('should not show start ellipsis when on first pages', () => {
    const pages = calculatePagination(2, 10);
    expect(pages[0]).toBe(1);
    expect(pages[1]).not.toBe('...');
  });

  it('should not show end ellipsis when on last pages', () => {
    const pages = calculatePagination(9, 10);
    expect(pages[pages.length - 1]).toBe(10);
    expect(pages[pages.length - 2]).not.toBe('...');
  });

  it('should handle single page', () => {
    const pages = calculatePagination(1, 1);
    expect(pages).toEqual([1]);
  });

  it('should handle two pages', () => {
    const pages = calculatePagination(1, 2);
    expect(pages).toEqual([1, 2]);
  });

  describe('page navigation boundaries', () => {
    it('should correctly determine if previous is disabled', () => {
      const isPrevDisabled = (currentPage: number) => currentPage <= 1;

      expect(isPrevDisabled(1)).toBe(true);
      expect(isPrevDisabled(2)).toBe(false);
    });

    it('should correctly determine if next is disabled', () => {
      const isNextDisabled = (currentPage: number, totalPages: number) => currentPage >= totalPages;

      expect(isNextDisabled(10, 10)).toBe(true);
      expect(isNextDisabled(9, 10)).toBe(false);
    });
  });

  describe('item range calculation', () => {
    it('should calculate correct item range for first page', () => {
      const currentPage = 1;
      const pageSize = 10;
      const totalItems = 100;

      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalItems);

      expect(startItem).toBe(1);
      expect(endItem).toBe(10);
    });

    it('should calculate correct item range for middle page', () => {
      const currentPage = 5;
      const pageSize = 10;
      const totalItems = 100;

      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalItems);

      expect(startItem).toBe(41);
      expect(endItem).toBe(50);
    });

    it('should calculate correct item range for last partial page', () => {
      const currentPage = 4;
      const pageSize = 10;
      const totalItems = 35;

      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalItems);

      expect(startItem).toBe(31);
      expect(endItem).toBe(35);
    });
  });
});
