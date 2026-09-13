'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories, useURLState } from '@/hooks';

export function CategorySelect() {
  const { category, setCategory } = useURLState();
  const { data: categories, isLoading } = useCategories();

  const handleValueChange = (value: string | null) => {
    if (value === null) return;
    // "all" is our placeholder for no category filter
    setCategory(value === 'all' ? '' : value);
  };

  return (
    <Select value={category || 'all'} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by category">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories?.map((cat) => (
          <SelectItem key={cat.slug} value={cat.slug}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
