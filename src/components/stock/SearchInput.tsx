'use client';

import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useURLState } from '@/hooks';

export function SearchInput() {
  const { search, setSearch } = useURLState();
  const [inputValue, setInputValue] = useState(search);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!isInternalUpdate.current) {
      setInputValue(search);
    }
    isInternalUpdate.current = false;
  }, [search]);

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

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

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex-1 space-y-1">
      <Label htmlFor="search-input" className="text-xs font-medium text-gray-700 sm:text-sm">
        Search
      </Label>
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:left-3 sm:h-4 sm:w-4"
          aria-hidden="true"
        />
        <Input
          id="search-input"
          type="text"
          placeholder="Search items..."
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          className="h-9 pl-8 pr-8 text-sm sm:h-10 sm:pl-10 sm:pr-10"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0.5 top-1/2 h-7 w-7 -translate-y-1/2 p-0 sm:right-1"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
