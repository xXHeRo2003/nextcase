import { auth } from "@/auth";
import { captureOrder, COIN_CONVERSION_RATE } from "@/lib/services/paypal";
import { creditCoins } from "@/lib/services/ledger";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId } = schema.parse(body);

    const capture = await captureOrder(orderId);

    // Verify status
    if (capture.status === "COMPLETED") {
      // In a real app, we'd verify the amount from capture.purchase_units[0].payments.captures[0].amount
      // For now, let's assume the amount is correct or passed in metadata.
      // But since we want to be safe, let's try to extract it.
      
      const purchaseUnit = (capture as any).purchaseUnits?.[0];
      const amountValue = purchaseUnit?.payments?.captures?.[0]?.amount?.value;
      
      if (amountValue) {
        const coins = Math.round(parseFloat(amountValue) * COIN_CONVERSION_RATE);
        await creditCoins(session.user.id, coins, 'PURCHASE', orderId, { capture });
        return NextResponse.json({ success: true, coins });
      }
    }

    return NextResponse.json({ error: "Capture failed or incomplete" }, { status: 400 });
  } catch (error) {
    console.error("PayPal Capture Order Error:", error);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
