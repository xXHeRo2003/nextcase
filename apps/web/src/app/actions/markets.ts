"use server";

import { getLiveMarkets } from "@/lib/services/market-queries";

export async function fetchLiveMarkets(category?: string, search?: string) {
  try {
    return await getLiveMarkets(category, search);
  } catch (error) {
    console.error("Failed to fetch markets:", error);
    return [];
  }
}
