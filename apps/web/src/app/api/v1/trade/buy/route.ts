import { auth } from "@/auth";
import { buyShares } from "@/lib/services/market";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  marketId: z.string().uuid(),
  outcomeIndex: z.number(),
  coinAmount: z.number().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { marketId, outcomeIndex, coinAmount } = schema.parse(body);

    const result = await buyShares(session.user.id, marketId, outcomeIndex, coinAmount);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Trade Buy Error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute trade" }, { status: 400 });
  }
}
