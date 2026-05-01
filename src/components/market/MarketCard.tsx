import { Market } from "@/types/market";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { TrendingUp, Users } from "lucide-react";
import { TradeDialog } from "./TradeDialog";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Card className="group flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center gap-2 mb-3">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold bg-primary/5 text-primary border-primary/20">
            {market.category}
          </Badge>
          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              ${market.volume.toLocaleString()}
            </div>
          </div>
        </div>
        <CardTitle className="text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {market.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="space-y-4">
          {market.options.map((option, idx) => (
            <div key={option.id} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">{option.name}</span>
                <span className={idx === 0 ? "text-emerald-500" : "text-rose-500"}>
                  {option.probability}%
                </span>
              </div>
              <Progress 
                value={option.probability} 
                className={`h-1.5 bg-muted/30 ${idx === 0 ? "[&>div]:bg-emerald-500" : "[&>div]:bg-rose-500"}`}
              />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-6 flex flex-col items-stretch gap-3">
        <div className="flex justify-between items-center text-[10px] text-muted-foreground/70 font-medium border-t border-border/40 pt-3">
          <div className="flex items-center gap-1">
             <Users className="w-3 h-3" />
             2.4k traders
          </div>
          <div>
            Ends {format(new Date(market.endDate), "MMM d, yyyy")}
          </div>
        </div>
        
        <TradeDialog 
          market={market} 
          trigger={
            <Button size="sm" className="w-full font-bold shadow-sm transition-transform active:scale-95">
              Place Bet
            </Button>
          } 
        />
      </CardFooter>
    </Card>
  );
}
