import { db } from "../packages/database/src/index.ts";
import { markets, marketOutcomes, marketPools } from "../packages/database/src/schema/schema.ts";
import { randomUUID } from "crypto";

async function seed() {
  console.log("🌱 Seeding markets...");

  const testMarkets = [
    {
      id: randomUUID(),
      question: "Will Bitcoin hit $100,000 by the end of 2026?",
      description: "This market resolves to 'Yes' if Bitcoin reaches $100,000 at any point before Dec 31, 2026.",
      category: "Crypto",
      resolutionDate: new Date("2026-12-31T23:59:59Z"),
      outcomes: ["Yes", "No"],
      initialLiquidity: ["500", "500"] 
    },
    {
      id: randomUUID(),
      question: "Who will win the 2026 FIFA World Cup?",
      description: "Resolves to the winner of the 2026 World Cup Final.",
      category: "Sports",
      resolutionDate: new Date("2026-07-19T20:00:00Z"),
      outcomes: ["Brazil", "France", "Argentina", "Other"],
      initialLiquidity: ["250", "250", "250", "250"]
    },
    {
      id: randomUUID(),
      question: "Will a human set foot on Mars before 2030?",
      description: "Resolves to 'Yes' if any space agency confirms a manned landing on Mars.",
      category: "Science",
      resolutionDate: new Date("2029-12-31T23:59:59Z"),
      outcomes: ["Yes", "No"],
      initialLiquidity: ["100", "900"] 
    }
  ];

  for (const m of testMarkets) {
    // 1. Create Market
    await db.insert(markets).values({
      id: m.id,
      question: m.question,
      description: m.description,
      category: m.category,
      resolutionDate: m.resolutionDate,
    });

    // 2. Create Outcomes & Pools
    for (let i = 0; i < m.outcomes.length; i++) {
      await db.insert(marketOutcomes).values({
        marketId: m.id,
        name: m.outcomes[i],
        index: i,
      });

      await db.insert(marketPools).values({
        marketId: m.id,
        outcomeIndex: i,
        liquidity: m.initialLiquidity[i],
      });
    }
    console.log(`✅ Created market: ${m.question}`);
  }

  console.log("✨ Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
