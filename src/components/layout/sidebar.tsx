"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  HelpCircle, 
  TrendingUp, 
  Wallet,
  History,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Compass, label: "Explore", href: "/" },
  { icon: History, label: "Activity", href: "/activity" },
  { icon: Wallet, label: "Coins", href: "/coins" },
  { icon: User, label: "Profile", href: "/profile" },
];

const secondaryItems = [
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-sm h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
            Menu
          </h3>
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-4.5 w-4.5 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
            System
          </h3>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-4.5 w-4.5 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-border/40">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tight">Pro Insights</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
            Get advanced analytics and faster market updates.
          </p>
          <button className="w-full py-2 text-[10px] font-extrabold bg-primary text-primary-foreground rounded-lg shadow-sm active:scale-95 transition-transform">
            UPGRADE NOW
          </button>
        </div>
      </div>
    </aside>
  );
}
