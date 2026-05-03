import { Decimal } from 'decimal.js';

// Configure Decimal for high precision
Decimal.set({ precision: 40, rounding: Decimal.ROUND_DOWN });

/**
 * Calculates the amount of shares a user receives for a given collateral amount.
 * Ported from Gnosis FPMM Solidity implementation.
 * 
 * Formula:
 * For each outcome i != outcomeIndex:
 *   product = product * balance[i] / (balance[i] + collateralAmount)
 * shares = balance[outcomeIndex] + collateralAmount - (balance[outcomeIndex] * product)
 * 
 * @param outcomeIndex The index of the outcome the user is buying.
 * @param collateralAmount The amount of collateral (NextCase Coins) the user is spending.
 * @param poolBalances The current liquidity balances of all outcomes in the pool.
 * @returns The amount of shares the user will receive.
 */
export function calcBuyAmount(
  outcomeIndex: number,
  collateralAmount: Decimal | string | number,
  poolBalances: (Decimal | string | number)[]
): Decimal {
  const b = poolBalances.map((bal) => new Decimal(bal));
  const a = new Decimal(collateralAmount);
  
  if (outcomeIndex < 0 || outcomeIndex >= b.length) {
    throw new Error("Invalid outcome index");
  }

  if (a.lte(0)) {
    return new Decimal(0);
  }

  let product = new Decimal(1);
  for (let j = 0; j < b.length; j++) {
    if (j !== outcomeIndex) {
      // product = (product * balances[j]) / (balances[j] + collateralAmount)
      product = product.times(b[j]).div(b[j].plus(a));
    }
  }

  // shares = balances[outcomeIndex] + collateralAmount - (balances[outcomeIndex] * product)
  const shares = b[outcomeIndex].plus(a).minus(b[outcomeIndex].times(product));
  
  return shares;
}

/**
 * Calculates the amount of collateral (NextCase Coins) a user receives for selling shares.
 * Derived from the constant product invariant: (B_i + S - A) * product_{j != i} (B_j - A) = product B_k
 * 
 * @param outcomeIndex The index of the outcome the user is selling.
 * @param shareAmount The amount of shares the user is selling.
 * @param poolBalances The current liquidity balances of all outcomes in the pool.
 * @returns The amount of collateral the user will receive.
 */
export function calcSellAmount(
  outcomeIndex: number,
  shareAmount: Decimal | string | number,
  poolBalances: (Decimal | string | number)[]
): Decimal {
  const b = poolBalances.map((bal) => new Decimal(bal));
  const s = new Decimal(shareAmount);
  const n = b.length;

  if (outcomeIndex < 0 || outcomeIndex >= n) {
    throw new Error("Invalid outcome index");
  }

  if (s.lte(0)) {
    return new Decimal(0);
  }

  const prodAll = b.reduce((p, val) => p.times(val), new Decimal(1));

  // We solve f(a) = (b[i] + s - a) * product_{j != i} (b[j] - a) - prodAll = 0
  // The solution 'a' is the collateral amount returned.
  
  let minB = b[0];
  for (let k = 1; k < n; k++) if (b[k].lt(minB)) minB = b[k];

  // Initial guess
  let a = s.div(n);
  if (a.gte(minB)) a = minB.times(0.5);

  for (let iter = 0; iter < 64; iter++) {
    let currentProdOthers = new Decimal(1);
    for (let j = 0; j < n; j++) {
      if (j !== outcomeIndex) currentProdOthers = currentProdOthers.times(b[j].minus(a));
    }
    
    const term1 = b[outcomeIndex].plus(s).minus(a);
    const f = term1.times(currentProdOthers).minus(prodAll);
    
    // derivative f'(a)
    let sumOthers = new Decimal(0);
    for (let j = 0; j < n; j++) {
      if (j !== outcomeIndex) {
        let otherProd = new Decimal(1);
        for (let k = 0; k < n; k++) {
          if (k !== outcomeIndex && k !== j) otherProd = otherProd.times(b[k].minus(a));
        }
        sumOthers = sumOthers.plus(otherProd);
      }
    }
    const df = currentProdOthers.negated().minus(term1.times(sumOthers));
    
    const delta = f.div(df);
    const nextA = a.minus(delta);
    
    if (nextA.minus(a).abs().lt(1e-18)) {
      a = nextA;
      break;
    }
    
    a = nextA;
    // Keep a in range [0, minB)
    if (a.lte(0)) a = new Decimal(0);
    if (a.gte(minB)) a = minB.minus(new Decimal(1e-10).times(minB));
  }

  return a;
}
