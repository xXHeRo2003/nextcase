import { db } from "@/lib/db";
import { coinBalances, transactions } from "@/lib/db/schema/schema";
import { eq, sql } from "drizzle-orm";

export type TransactionType = 'PURCHASE' | 'BET_BUY' | 'BET_SELL' | 'REWARD';

export async function getCoinBalance(userId: string) {
  const balance = await db.query.coinBalances.findFirst({
    where: eq(coinBalances.userId, userId),
  });
  return balance?.balance || "0.00";
}

export async function creditCoins(
  userId: string,
  amount: number,
  type: TransactionType,
  externalId?: string,
  metadata?: any
) {
  return await db.transaction(async (tx) => {
    // 1. Create transaction record
    await tx.insert(transactions).values({
      userId,
      type,
      amount: amount.toString(),
      status: 'COMPLETED',
      externalId,
      metadata,
    });

    // 2. Update or Create balance
    await tx
      .insert(coinBalances)
      .values({
        userId,
        balance: amount.toString(),
      })
      .onConflictDoUpdate({
        target: coinBalances.userId,
        set: {
          balance: sql`${coinBalances.balance} + ${amount.toString()}`,
          updatedAt: new Date(),
        },
      });
  });
}

export async function deductCoins(
  userId: string,
  amount: number,
  type: TransactionType,
  externalId?: string,
  metadata?: any
) {
  return await db.transaction(async (tx) => {
    // 1. Check current balance
    const current = await tx.query.coinBalances.findFirst({
      where: eq(coinBalances.userId, userId),
    });

    if (!current || Number(current.balance) < amount) {
      throw new Error("Insufficient balance");
    }

    // 2. Create transaction record
    await tx.insert(transactions).values({
      userId,
      type,
      amount: amount.toString(),
      status: 'COMPLETED',
      externalId,
      metadata,
    });

    // 3. Update balance
    await tx
      .update(coinBalances)
      .set({
        balance: sql`${coinBalances.balance} - ${amount.toString()}`,
        updatedAt: new Date(),
      })
      .where(eq(coinBalances.userId, userId));
  });
}
