'use client';

import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useURLState } from '@/hooks';

export function SearchInput() {
  const { search, setSearch } = useURLState();
  // Local state for immediate input feedback
  const [inputValue, setInputValue] = useState(search);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalUpdate = useRef(false);

  // Sync URL state to local state when URL changes externally (e.g., browser back/forward)
  // Using a ref to track if the change came from within this component
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setInputValue(search);
    }
    isInternalUpdate.current = false;
  }, [search]);

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);

      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        isInternalUpdate.current = true;
        setSearch(value);
      }, 300);
    },
    [setSearch]
  );

  const handleClear = useCallback(() => {
    setInputValue('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    isInternalUpdate.current = true;
    setSearch('');
  }, [setSearch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder="Search items..."
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10 pr-10"
        aria-label="Search items"
      />
      {inputValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
