import { Market } from "@nextcase/shared";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TradeDialog } from "./TradeDialog";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const yesOption = market.options.find(o => o.id === "yes") || market.options[0];
  const noOption = market.options.find(o => o.id === "no") || market.options[1];

  return (
    <Card className="bg-[#121418] border border-white/5 overflow-hidden transition-all duration-200 hover:border-white/10 group flex flex-col h-full rounded-xl">
      <CardHeader className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="bg-[#1E2025] text-[#94A3B8] hover:bg-[#1E2025] border-none text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
            {market.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8] tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-[#09B9A4] animate-pulse" />
            ${(market.volume / 1000000).toFixed(1)}M Vol
          </div>
        </div>
        <CardTitle className="text-[15px] font-semibold leading-snug min-h-[44px] line-clamp-2 text-white/90 group-hover:text-white transition-colors">
          {market.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex-1">
        <div className="relative h-1 w-full bg-[#1E2025] rounded-full overflow-hidden mb-5">
           <div 
            className="absolute left-0 top-0 h-full bg-[#09B9A4] transition-all duration-500" 
            style={{ width: `${yesOption.probability}%` }}
           />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TradeDialog 
            market={market}
            trigger={
              <Button 
                variant="outline" 
                className="flex flex-col h-14 bg-[#09B9A4]/10 border-[#09B9A4]/20 hover:bg-[#09B9A4]/20 hover:border-[#09B9A4]/30 group/btn transition-all duration-200 rounded-lg"
              >
                <span className="text-[10px] font-bold uppercase text-[#09B9A4] tracking-wider mb-0.5">Bet Yes</span>
                <span className="text-lg font-bold text-white tabular-nums">{yesOption.probability}%</span>
              </Button>
            }
          />
          <TradeDialog 
            market={market}
            trigger={
              <Button 
                variant="outline" 
                className="flex flex-col h-14 bg-[#FF4D4D]/10 border-[#FF4D4D]/20 hover:bg-[#FF4D4D]/20 hover:border-[#FF4D4D]/30 group/btn transition-all duration-200 rounded-lg"
              >
                <span className="text-[10px] font-bold uppercase text-[#FF4D4D] tracking-wider mb-0.5">Bet No</span>
                <span className="text-lg font-bold text-white tabular-nums">{noOption.probability}%</span>
              </Button>
            }
          />
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
         <div className="text-[10px] font-medium text-[#94A3B8] flex items-center gap-1">
           Ends {format(new Date(market.endDate), "MMM d, yyyy")}
         </div>
         <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
               <span className="text-[8px] font-bold">NYT</span>
            </div>
            <span className="text-[9px] text-[#94A3B8] font-medium truncate max-w-[80px]">NY Times source</span>
         </div>
      </CardFooter>
    </Card>
  );
}
