"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "@/lib/mock-data";
import { MarketFilters } from "@/components/market/MarketFilters";
import { MarketList } from "@/components/market/MarketList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", category, search],
    queryFn: () => fetchMarkets(category, search),
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-card/30 py-16 px-6 sm:py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/5 text-primary border-primary/20 text-xs font-bold uppercase tracking-widest">
            Next-Gen Prediction Markets
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Predict the Future.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Earn from your Knowledge.</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Trade on politics, sports, crypto and more. Simple, fast, and completely gasless with NextCase Coins.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
             <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]">
                Start Trading
             </Button>
             <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-base font-bold bg-background/50 backdrop-blur-sm transition-all hover:translate-y-[-2px]">
                How it works
             </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-6 sm:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="space-y-1">
               <h2 className="text-2xl font-bold tracking-tight">Active Markets</h2>
               <p className="text-sm text-muted-foreground">Discover opportunities across various categories.</p>
            </div>
            
            <MarketFilters
              selectedCategory={category}
              onCategoryChange={setCategory}
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          <MarketList markets={markets} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
