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
  { value: 'price-asc', label: 'Price Low-High', sortBy: 'price', order: 'asc' as const },
  { value: 'price-desc', label: 'Price High-Low', sortBy: 'price', order: 'desc' as const },
  { value: 'stock-asc', label: 'Stock Low-High', sortBy: 'stock', order: 'asc' as const },
  { value: 'stock-desc', label: 'Stock High-Low', sortBy: 'stock', order: 'desc' as const },
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
    <div className="space-y-1.5">
      <Label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by
      </Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger id="sort-select" className="w-full sm:w-[160px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
