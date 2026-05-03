"use client";

import { useState } from "react";
import { Market, MarketOption } from "@nextcase/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Wallet } from "lucide-react";

interface TradeDialogProps {
  market: Market;
  trigger: React.ReactElement;
}

export function TradeDialog({ market, trigger }: TradeDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<MarketOption>(market.options[0]);
  const [isPending, setIsPending] = useState(false);

  const potentialReturn = amount ? (Number(amount) / (selectedOption.probability / 100)).toFixed(2) : "0.00";

  const handleTrade = async () => {
    setIsPending(true);
    try {
      const response = await fetch("/api/v1/trade/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketId: market.id,
          outcomeIndex: selectedOption.index,
          coinAmount: Number(amount),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Trade failed");
      }

      // Success logic: e.g., show a toast or refresh data
      console.log("Trade successful:", data);
      window.location.reload(); // Refresh to see updated balance/pools
    } catch (error: any) {
      console.error("Trade Error:", error);
      alert(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[425px] border-border/50 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Trade Market</span>
          </div>
          <DialogTitle className="text-xl font-bold leading-tight">{market.title}</DialogTitle>
          <DialogDescription className="text-xs">
            Select an outcome and enter the amount of NextCase Coins to bet.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Pick Outcome</Label>
            <div className="grid grid-cols-2 gap-2">
              {market.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedOption.id === option.id ? "default" : "outline"}
                  className={`h-12 flex flex-col items-center justify-center gap-0.5 transition-all ${
                    selectedOption.id === option.id 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <span className="text-xs font-bold">{option.name}</span>
                  <span className="text-[10px] opacity-70">{option.probability}%</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-xs font-bold uppercase text-muted-foreground">Amount</Label>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Wallet className="w-3 h-3" />
                1,250 Coins
              </div>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                className="h-12 text-lg font-bold pl-4 pr-16 bg-muted/20 border-border/50 focus-visible:ring-primary/30"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                COINS
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["10", "50", "100", "500"].map((v) => (
                <Button 
                  key={v} 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold bg-muted/30 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setAmount(v)}
                >
                  +{v}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Potential Return</span>
              <span className="text-foreground font-bold">{potentialReturn} Coins</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Return if {selectedOption.name}</span>
              <span className="text-emerald-500 font-bold">
                +{(Number(potentialReturn) - (Number(amount) || 0)).toFixed(2)} Coins
              </span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full h-12 text-sm font-extrabold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
          onClick={handleTrade}
          disabled={!amount || Number(amount) <= 0 || isPending}
        >
          {isPending ? "Processing..." : `Place Bet on ${selectedOption.name}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
