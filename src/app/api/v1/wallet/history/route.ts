import { auth } from "@/auth";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const history = await db.query.transactions.findMany({
      where: eq(transactions.userId, session.user.id),
      orderBy: [desc(transactions.createdAt)],
      limit: 50,
    });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transaction history" }, { status: 500 });
  }
}
