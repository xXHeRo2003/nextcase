"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "@/lib/mock-data";
import { MarketFilters } from "@/components/market/MarketFilters";
import { MarketList } from "@/components/market/MarketList";

export default function Home() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", category, search],
    queryFn: () => fetchMarkets(category, search),
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Market Discovery</h1>
        <p className="text-muted-foreground text-lg">
          Browse and predict on the latest markets.
        </p>
      </header>

      <MarketFilters
        selectedCategory={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <MarketList markets={markets} isLoading={isLoading} />
    </div>
  );
}
