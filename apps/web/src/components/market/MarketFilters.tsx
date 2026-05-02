"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category } from "@nextcase/shared";

const CATEGORIES: (Category | "All")[] = ["All", "Crypto", "Sports", "Politics", "Science"];

interface MarketFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function MarketFilters({
  selectedCategory,
  onCategoryChange,
  search,
  onSearchChange,
}: MarketFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search markets..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
