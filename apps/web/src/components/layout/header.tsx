"use client";

import { useSession, signOut } from "next-auth/react";
import { CircleDollarSign, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  const { data: balanceData } = useQuery({
    queryKey: ["balance", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const res = await fetch("/api/v1/wallet/balance");
      return res.json();
    },
    enabled: !!session?.user?.id,
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090A0C]/80 backdrop-blur-xl">
      <div className="max-w-7xl flex h-14 items-center justify-between mx-auto px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo-full.png" 
              alt="NextCase Logo" 
              width={120} 
              height={30} 
              className="h-7 w-auto object-contain drop-shadow-[0_0_8px_rgba(4,140,250,0.3)] hover:drop-shadow-[0_0_12px_rgba(4,140,250,0.5)] transition-all duration-300"
              priority
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-white/90 hover:text-white transition-colors">Markets</Link>
            <Link href="/activity" className="text-sm font-bold text-[#94A3B8] hover:text-white transition-colors">Activity</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-[#121418] border border-white/5 px-3 py-1.5 rounded-lg">
                <CircleDollarSign className="w-4 h-4 text-[#09B9A4]" />
                <span className="text-xs font-bold text-white tabular-nums">
                  {balanceData?.balance ? Number(balanceData.balance).toLocaleString() : "0.00"}
                </span>
              </div>
              
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-white">
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#94A3B8] hover:text-red-500"
                onClick={() => signOut()}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="h-9 px-4 rounded-lg bg-[#048CFA] text-white text-xs font-bold hover:bg-[#048CFA]/90 transition-colors">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
