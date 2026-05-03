"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, 
  Wallet,
  History,
  Compass,
  Zap,
  Star,
  Globe,
  CircleDollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Compass, label: "Explore", href: "/" },
  { icon: Zap, label: "New", href: "/new" },
  { icon: Star, label: "Followed", href: "/followed" },
  { icon: History, label: "Activity", href: "/activity" },
];

const categories = [
  { label: "Politics", color: "#048CFA" },
  { label: "Crypto", color: "#F7931A" },
  { label: "Sports", color: "#09B9A4" },
  { label: "Business", color: "#94A3B8" },
  { label: "Entertainment", color: "#EF4444" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-white/5 bg-[#090A0C] h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        <div>
          <nav className="space-y-0.5">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-[#1E2025] text-white" 
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-4 w-4",
                    isActive ? "text-[#048CFA]" : "text-[#94A3B8] group-hover:text-white"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#94A3B8]/50 mb-4">
            Topics
          </h3>
          <nav className="space-y-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/category/${cat.label.toLowerCase()}`}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
              >
                <div 
                  className="mr-3 h-2 w-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" 
                  style={{ backgroundColor: cat.color }}
                />
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-white/5">
        <Link href="/coins/purchase">
          <button className="w-full py-2.5 text-[10px] font-bold bg-[#121418] hover:bg-[#1E2025] text-white border border-white/5 rounded-lg transition-colors uppercase tracking-widest">
            Buy Coins
          </button>
        </Link>
      </div>
    </aside>
  );
}