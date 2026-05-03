import { db } from "@nextcase/database";
import { 
  coinBalances, 
  transactions, 
  marketPools, 
  userPositions, 
  markets 
} from "@nextcase/database";
import { eq, and, sql } from "drizzle-orm";
import { Decimal } from "decimal.js";
import { calcBuyAmount, calcSellAmount } from "./market-logic";

/**
 * Handles the business logic of buying shares in a prediction market.
 * Uses a database transaction to ensure atomicity and consistency.
 * 
 * @param userId The ID of the user buying shares.
 * @param marketId The ID of the market.
 * @param outcomeIndex The index of the outcome being bought.
 * @param collateralAmount The amount of NextCase Coins to spend.
 * @returns An object containing the amount of shares bought and collateral spent.
 */
export async function buyShares(
  userId: string,
  marketId: string,
  outcomeIndex: number,
  collateralAmount: number | string
) {
  const amount = new Decimal(collateralAmount);

  if (amount.lte(0)) {
    throw new Error("Amount must be greater than 0");
  }

  return await db.transaction(async (tx) => {
    // 1. Check market status and lock for shared access
    const [market] = await tx
      .select()
      .from(markets)
      .where(eq(markets.id, marketId))
      .for('share');

    if (!market) {
      throw new Error("Market not found");
    }

    if (market.status !== 'OPEN') {
      throw new Error("Market is not open for trading");
    }

    // 2. Get and lock user balance
    const [userBalance] = await tx
      .select()
      .from(coinBalances)
      .where(eq(coinBalances.userId, userId))
      .for('update');

    if (!userBalance) {
      throw new Error("User balance record not found");
    }

    if (new Decimal(userBalance.balance).lt(amount)) {
      throw new Error("Insufficient balance");
    }

    // 3. Get all pool balances for the market and lock them
    const pools = await tx
      .select()
      .from(marketPools)
      .where(eq(marketPools.marketId, marketId))
      .orderBy(marketPools.outcomeIndex)
      .for('update');

    if (pools.length === 0) {
      throw new Error("Market pools not found");
    }

    // Ensure the outcomeIndex exists in the pools
    const targetPool = pools.find(p => p.outcomeIndex === outcomeIndex);
    if (!targetPool) {
      throw new Error("Invalid outcome index for this market");
    }

    const poolBalances = pools.map(p => p.liquidity);
    
    // 4. Calculate shares using FPMM formula
    const shares = calcBuyAmount(outcomeIndex, amount, poolBalances);

    if (shares.lte(0)) {
      throw new Error("Calculated shares must be greater than 0");
    }

    // 5. Update user balance
    await tx
      .update(coinBalances)
      .set({
        balance: sql`${coinBalances.balance} - ${amount.toFixed(2)}`,
        updatedAt: new Date(),
      })
      .where(eq(coinBalances.userId, userId));

    // 6. Update market pools to maintain Constant Product Invariant
    for (const pool of pools) {
      let liquidityChange: Decimal;
      if (pool.outcomeIndex === outcomeIndex) {
        // For the bought outcome: balance = balance + collateral - shares
        liquidityChange = amount.minus(shares);
      } else {
        // For other outcomes: balance = balance + collateral
        liquidityChange = amount;
      }
      
      await tx
        .update(marketPools)
        .set({
          liquidity: sql`${marketPools.liquidity} + ${liquidityChange.toFixed(18)}`,
          updatedAt: new Date(),
        })
        .where(eq(marketPools.id, pool.id));
    }

    // 7. Create or update user position
    const [existingPosition] = await tx
      .select()
      .from(userPositions)
      .where(and(
        eq(userPositions.userId, userId),
        eq(userPositions.marketId, marketId),
        eq(userPositions.outcomeIndex, outcomeIndex)
      ))
      .for('update');

    if (existingPosition) {
      await tx
        .update(userPositions)
        .set({
          shares: sql`${userPositions.shares} + ${shares.toFixed(18)}`,
          totalInvested: sql`${userPositions.totalInvested} + ${amount.toFixed(2)}`,
          updatedAt: new Date(),
        })
        .where(eq(userPositions.id, existingPosition.id));
    } else {
      await tx.insert(userPositions).values({
        userId,
        marketId,
        outcomeIndex,
        shares: shares.toFixed(18),
        totalInvested: amount.toFixed(2),
      });
    }

    // 8. Create transaction record for audit trail
    await tx.insert(transactions).values({
      userId,
      type: 'BET_BUY',
      amount: amount.toFixed(2),
      status: 'COMPLETED',
      metadata: {
        marketId,
        outcomeIndex,
        shares: shares.toFixed(18),
        collateralAmount: amount.toFixed(2),
      },
    });

    return {
      shares: shares.toFixed(18),
      collateralSpent: amount.toFixed(2),
    };
  });
}

/**
 * Handles the business logic of selling shares in a prediction market.
 * Uses a database transaction to ensure atomicity and consistency.
 * 
 * @param userId The ID of the user selling shares.
 * @param marketId The ID of the market.
 * @param outcomeIndex The index of the outcome being sold.
 * @param shareAmount The amount of shares to sell.
 * @returns An object containing the amount of collateral returned and shares sold.
 */
export async function sellShares(
  userId: string,
  marketId: string,
  outcomeIndex: number,
  shareAmount: number | string
) {
  const sharesToSell = new Decimal(shareAmount);

  if (sharesToSell.lte(0)) {
    throw new Error("Share amount must be greater than 0");
  }

  return await db.transaction(async (tx) => {
    // 1. Check market status
    const [market] = await tx
      .select()
      .from(markets)
      .where(eq(markets.id, marketId))
      .for('share');

    if (!market) {
      throw new Error("Market not found");
    }

    if (market.status !== 'OPEN') {
      throw new Error("Market is not open for trading");
    }

    // 2. Get and lock user position
    const [userPosition] = await tx
      .select()
      .from(userPositions)
      .where(and(
        eq(userPositions.userId, userId),
        eq(userPositions.marketId, marketId),
        eq(userPositions.outcomeIndex, outcomeIndex)
      ))
      .for('update');

    if (!userPosition || new Decimal(userPosition.shares).lt(sharesToSell)) {
      throw new Error("Insufficient shares");
    }

    // 3. Get and lock pool balances
    const pools = await tx
      .select()
      .from(marketPools)
      .where(eq(marketPools.marketId, marketId))
      .orderBy(marketPools.outcomeIndex)
      .for('update');

    if (pools.length === 0) {
      throw new Error("Market pools not found");
    }

    const poolBalances = pools.map(p => p.liquidity);
    
    // 4. Calculate collateral return using FPMM formula
    const collateralReturn = calcSellAmount(outcomeIndex, sharesToSell, poolBalances);

    if (collateralReturn.lte(0)) {
      throw new Error("Calculated collateral return must be greater than 0");
    }

    // 5. Update user position
    if (new Decimal(userPosition.shares).equals(sharesToSell)) {
      await tx
        .delete(userPositions)
        .where(eq(userPositions.id, userPosition.id));
    } else {
      await tx
        .update(userPositions)
        .set({
          shares: sql`${userPositions.shares} - ${sharesToSell.toFixed(18)}`,
          updatedAt: new Date(),
        })
        .where(eq(userPositions.id, userPosition.id));
    }

    // 6. Update market pools
    for (const pool of pools) {
      let liquidityChange: Decimal;
      if (pool.outcomeIndex === outcomeIndex) {
        // For sold outcome: balance = balance + shares - collateral
        liquidityChange = sharesToSell.minus(collateralReturn);
      } else {
        // For other outcomes: balance = balance - collateral
        liquidityChange = collateralReturn.negated();
      }
      
      await tx
        .update(marketPools)
        .set({
          liquidity: sql`${marketPools.liquidity} + ${liquidityChange.toFixed(18)}`,
          updatedAt: new Date(),
        })
        .where(eq(marketPools.id, pool.id));
    }

    // 7. Update user coin balance
    await tx
      .insert(coinBalances)
      .values({
        userId,
        balance: collateralReturn.toFixed(2),
      })
      .onConflictDoUpdate({
        target: coinBalances.userId,
        set: {
          balance: sql`${coinBalances.balance} + ${collateralReturn.toFixed(2)}`,
          updatedAt: new Date(),
        },
      });

    // 8. Create transaction record
    await tx.insert(transactions).values({
      userId,
      type: 'BET_SELL',
      amount: collateralReturn.toFixed(2),
      status: 'COMPLETED',
      metadata: {
        marketId,
        outcomeIndex,
        sharesSold: sharesToSell.toFixed(18),
        collateralReturned: collateralReturn.toFixed(2),
      },
    });

    return {
      collateralReturned: collateralReturn.toFixed(2),
      sharesSold: sharesToSell.toFixed(18),
    };
  });
}
