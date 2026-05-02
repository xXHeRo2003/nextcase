"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "@/lib/mock-data";
import { MarketFilters } from "@/components/market/MarketFilters";
import { MarketList } from "@/components/market/MarketList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, UserCircle } from "lucide-react";

export default function Home() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", category, search],
    queryFn: () => fetchMarkets(category, search),
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#090A0C] text-white selection:bg-[#048CFA]/30">
      {/* Top Search/Filter Bar */}
      <div className="sticky top-14 z-30 bg-[#090A0C]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
              {["All", "Politics", "Crypto", "Sports", "Business", "Science"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    category === cat ? "text-[#048CFA]" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input 
                type="text"
                placeholder="Search markets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121418] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#048CFA]/50 transition-colors placeholder:text-[#94A3B8]/50 font-medium"
              />
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-6">
        <div className="flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-white/5 pb-6">
            <div className="space-y-1">
               <h2 className="text-xl font-bold tracking-tight text-white/90">
                 {category === "All" ? "Featured Markets" : `${category} Markets`}
               </h2>
               <p className="text-xs font-medium text-[#94A3B8]">
                 Real-time prediction probabilities based on market volume.
               </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
               <span className="w-1.5 h-1.5 rounded-full bg-[#09B9A4]" />
               Live Updates
            </div>
          </div>

          <MarketList markets={markets} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
