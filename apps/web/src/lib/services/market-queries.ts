import { db } from "@nextcase/database";
import { markets, marketOutcomes, marketPools } from "@nextcase/database";
import { eq } from "drizzle-orm";
import { Market, Category, MarketStatus } from "@nextcase/shared";

export async function getLiveMarkets(category?: string, search?: string): Promise<Market[]> {
  const allMarkets = await db.query.markets.findMany({
    with: {
      outcomes: true,
      pools: true,
    },
    where: (markets, { eq, and, ilike }) => {
      const filters = [];
      if (category && category !== "All") {
        filters.push(eq(markets.category, category));
      }
      if (search) {
        filters.push(ilike(markets.question, `%${search}%`));
      }
      return filters.length > 0 ? and(...filters) : undefined;
    },
  });

  // Transform to match the 'Market' type expected by frontend
  return allMarkets.map((m) => {
    // Calculate probabilities from liquidity pools
    const totalLiquidity = m.pools.reduce((sum, p) => sum + Number(p.liquidity), 0);
    
    return {
      id: m.id,
      title: m.question,
      category: (m.category as Category) || "Other",
      volume: totalLiquidity, 
      endDate: m.resolutionDate.toISOString(),
      status: (m.status === 'OPEN' ? 'active' : m.status.toLowerCase()) as MarketStatus,
      options: m.outcomes.map((o) => {
        const pool = m.pools.find((p) => p.outcomeIndex === o.index);
        const liquidity = pool ? Number(pool.liquidity) : 0;
        const probability = totalLiquidity > 0 ? (liquidity / totalLiquidity) * 100 : 0;
        
        return {
          id: o.id,
          index: o.index,
          name: o.name,
          probability: Math.round(probability),
        };
      }),
    };
  });
}
