import { auth } from "@/auth";
import { createOrder } from "@/lib/services/paypal";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  coins: z.number().min(100), // Min 100 coins (1 EUR)
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { coins } = schema.parse(body);

    const order = await createOrder(coins);

    return NextResponse.json(order);
  } catch (error) {
    console.error("PayPal Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
