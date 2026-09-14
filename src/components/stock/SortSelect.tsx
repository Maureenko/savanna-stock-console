'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useURLState } from '@/hooks';

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title A-Z', sortBy: 'title', order: 'asc' as const },
  { value: 'title-desc', label: 'Title Z-A', sortBy: 'title', order: 'desc' as const },
  { value: 'price-asc', label: 'Price ↑', sortBy: 'price', order: 'asc' as const },
  { value: 'price-desc', label: 'Price ↓', sortBy: 'price', order: 'desc' as const },
  { value: 'stock-asc', label: 'Stock ↑', sortBy: 'stock', order: 'asc' as const },
  { value: 'stock-desc', label: 'Stock ↓', sortBy: 'stock', order: 'desc' as const },
];

export function SortSelect() {
  const { sortBy, order, setSort } = useURLState();

  const currentValue = `${sortBy}-${order}`;

  const handleValueChange = (value: string | null) => {
    if (value === null) return;
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      setSort(option.sortBy, option.order);
    }
  };

  return (
    <div className="w-full space-y-1 sm:w-auto">
      <Label htmlFor="sort-select" className="text-xs font-medium text-gray-700 sm:text-sm">
        Sort by
      </Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger id="sort-select" className="h-9 w-full text-sm sm:h-10 sm:w-[8.75rem]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
