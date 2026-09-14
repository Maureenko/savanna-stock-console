import { describe, it, expect } from 'vitest';

import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'included', false && 'excluded');
    expect(result).toBe('base included');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should merge tailwind classes correctly', () => {
    // Later classes should override earlier ones
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('should handle object syntax', () => {
    const result = cn('base', { active: true, disabled: false });
    expect(result).toBe('base active');
  });

  it('should handle arrays', () => {
    const result = cn(['foo', 'bar'], 'baz');
    expect(result).toBe('foo bar baz');
  });
});
