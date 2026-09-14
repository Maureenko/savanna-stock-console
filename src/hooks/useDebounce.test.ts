import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));

    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 300 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('should cancel pending updates when value changes rapidly', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    // Rapid updates
    rerender({ value: 'update1', delay: 300 });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: 'update2', delay: 300 });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: 'final', delay: 300 });

    // Should still be initial
    expect(result.current).toBe('initial');

    // Wait for debounce
    act(() => vi.advanceTimersByTime(300));

    // Should only get final value
    expect(result.current).toBe('final');
  });

  it('should handle custom delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: 'updated', delay: 500 });

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('initial');

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('updated');
  });
});
