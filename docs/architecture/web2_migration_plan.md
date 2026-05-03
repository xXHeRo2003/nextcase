# Migration Plan: Pure Web2 Transition

## 1. Goal
Remove all blockchain dependencies and move the Market Maker logic (AMM) into the backend. The database will become the single source of truth for all market states, balances, and positions.

## 2. Architectural Changes

### 2.1 Database Schema (packages/database)
We need to add tables to store what was previously on the blockchain:
- **`markets`**: ID, Question, Description, Category, Resolution Date, Status (Open/Closed/Resolved), Winning Outcome.
- **`market_outcomes`**: ID, MarketID, Name (e.g., "Yes", "No").
- **`market_pools`**: MarketID, OutcomeIndex, LiquidityShares (The "balances" of the AMM).
- **`user_positions`**: (Existing, but needs to link to `market_outcomes` instead of contract addresses).

### 2.2 Logic Porting (apps/web/src/lib/services)
- Create `MarketService.ts`: 
    - Port `calcBuyAmount` from Solidity to TypeScript using `decimal.js`.
    - Implement `buyShares(userId, marketId, outcomeIndex, amount)` with SQL Transactions.
    - Implement `sellShares(...)`.
    - Implement `resolveMarket(marketId, winningOutcomeIndex)`.

### 2.3 API Refactoring
- Simplify `/api/v1/trade/*` to directly call the local `MarketService` instead of triggering the Blockchain Relayer.

## 3. Security & Integrity (Web2 Style)
- **ACID Transactions**: Every trade will be wrapped in a database transaction to ensure coin balance and pool shares stay in sync.
- **Precision**: Use `numeric` type in Postgres and `decimal.js` in Node.js to match 18-decimal precision.
- **Audit Logging**: Maintain a `market_history` table to track every trade and price movement for transparency.

## 4. Execution Steps

### Phase 1: Database Setup
- [ ] Update `schema.ts` with new Market and Pool tables.
- [ ] Run `npx drizzle-kit generate` and apply migrations.

### Phase 2: Core Logic Implementation
- [ ] Implement `AMM` math in `apps/web/src/lib/services/market-logic.ts`.
- [ ] Implement `MarketService` for handling trades within DB transactions.

### Phase 3: Cleanup & Deletion
- [ ] Delete `packages/contracts` directory.
- [ ] Remove `viem` and `foundry` related dependencies and configs.
- [ ] Update `GEMINI.md` to reflect the new Web2 architecture.

### Phase 4: Frontend Update
- [ ] Update UI components to fetch market state from the new DB tables instead of mock/contracts.

## 5. Decision on Issue #5
- **Status**: Cancelled (Won't Fix).
- **Action**: Close the issue on GitHub once the migration is complete.
