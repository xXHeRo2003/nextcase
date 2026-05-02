import { auth } from "@/auth";
import { creditCoins } from "@/lib/services/ledger";
import { sellOnChain } from "@/lib/services/blockchain";
import { db, userPositions } from "@nextcase/database";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  marketAddress: z.string(),
  outcomeIndex: z.number(),
  shareAmount: z.string(), // Tokens are often large numbers, use string for precision
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { marketAddress, outcomeIndex, shareAmount } = schema.parse(body);

    // 1. Check virtual position
    const position = await db.query.userPositions.findFirst({
      where: and(
        eq(userPositions.userId, session.user.id),
        eq(userPositions.marketAddress, marketAddress),
        eq(userPositions.outcomeIndex, outcomeIndex)
      ),
    });

    if (!position || BigInt(position.shares.split('.')[0]) < BigInt(shareAmount)) {
      return NextResponse.json({ error: "Insufficient shares" }, { status: 400 });
    }

    try {
      // 2. Execute on-chain trade
      const { hash, returnAmount } = await sellOnChain(marketAddress, outcomeIndex, BigInt(shareAmount));

      // 3. Credit coins to ledger
      const coinsToCredit = Number(returnAmount); // Assuming 1:1 or appropriate mapping
      await creditCoins(session.user.id, coinsToCredit, 'BET_SELL', hash, { marketAddress, outcomeIndex, shareAmount });

      // 4. Update virtual position
      await db.update(userPositions)
        .set({
          shares: sql`${userPositions.shares} - ${shareAmount}`,
          updatedAt: new Date(),
        })
        .where(and(
          eq(userPositions.userId, session.user.id),
          eq(userPositions.marketAddress, marketAddress),
          eq(userPositions.outcomeIndex, outcomeIndex)
        ));

      return NextResponse.json({ success: true, hash, coinsReceived: coinsToCredit });
    } catch (txError) {
      console.error("Blockchain Sell Error:", txError);
      return NextResponse.json({ error: "Blockchain transaction failed" }, { status: 502 });
    }

  } catch (error: any) {
    console.error("Trade Sell Error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute trade" }, { status: 500 });
  }
}
