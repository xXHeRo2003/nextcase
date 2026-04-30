import { Market } from "@/types/market";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {market.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Vol: ${market.volume.toLocaleString()}
          </span>
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {market.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="space-y-2">
          {market.options.map((option) => (
            <div key={option.id} className="flex justify-between items-center text-sm">
              <span>{option.name}</span>
              <span className="font-medium">{option.probability}%</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-stretch gap-2">
        <div className="text-xs text-muted-foreground text-center">
          Ends {format(new Date(market.endDate), "MMM d, yyyy")}
        </div>
        <Button size="sm" className="w-full">
          Trade
        </Button>
      </CardFooter>
    </Card>
  );
}
