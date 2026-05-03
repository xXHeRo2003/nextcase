import { db } from "@nextcase/database";
import { markets } from "@nextcase/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allMarkets = await db.select().from(markets);
    return NextResponse.json({ 
      success: true, 
      count: allMarkets.length,
      markets: allMarkets 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      env: process.env.DATABASE_URL ? "Defined" : "Undefined"
    }, { status: 500 });
  }
}
