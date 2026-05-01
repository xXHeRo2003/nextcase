"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { CircleDollarSign, Search } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090A0C]/80 backdrop-blur-xl">
      <div className="max-w-7xl flex h-14 items-center justify-between mx-auto px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-black text-xl tracking-tighter text-white">
            NEXT<span className="text-[#048CFA]">CASE</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-white/90 hover:text-white transition-colors">Markets</Link>
            <Link href="/activity" className="text-sm font-bold text-[#94A3B8] hover:text-white transition-colors">Activity</Link>
            <Link href="/learn" className="text-sm font-bold text-[#94A3B8] hover:text-white transition-colors">Learn</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#121418] border border-white/5 px-3 py-1.5 rounded-lg">
             <CircleDollarSign className="w-4 h-4 text-[#09B9A4]" />
             <span className="text-xs font-bold text-white tabular-nums">1,250.00</span>
          </div>
          
          <button className="h-9 px-4 rounded-lg bg-[#048CFA] text-white text-xs font-bold hover:bg-[#048CFA]/90 transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}
