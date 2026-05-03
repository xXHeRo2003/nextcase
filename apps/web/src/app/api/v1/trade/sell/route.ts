import { auth } from "@/auth";
import { sellShares } from "@/lib/services/market";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  marketId: z.string().uuid(),
  outcomeIndex: z.number(),
  shareAmount: z.string(), 
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { marketId, outcomeIndex, shareAmount } = schema.parse(body);

    const result = await sellShares(session.user.id, marketId, outcomeIndex, shareAmount);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Trade Sell Error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute trade" }, { status: 400 });
  }
}
