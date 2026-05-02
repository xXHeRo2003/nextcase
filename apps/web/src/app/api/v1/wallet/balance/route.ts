import { auth } from "@/auth";
import { getCoinBalance } from "@/lib/services/ledger";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const balance = await getCoinBalance(session.user.id);
    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
