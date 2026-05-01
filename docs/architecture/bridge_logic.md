# Blockchain Bridge Logic (Virtual Coins to Smart Contracts)

## 1. Interaction Flow: Placing a Bet

When a user clicks "Buy" for an outcome in the UI, the following sequence occurs:

1. **Frontend**: Sends a request to `POST /api/v1/trade/buy` with:
   - `marketAddress`: The address of the `FixedProductMarketMaker` contract.
   - `outcomeIndex`: Which outcome they are betting on (0 or 1).
   - `coinAmount`: How many NextCase Coins they want to spend.

2. **Backend (API Route)**:
   - **Validation**:
     - Verify user session (NextAuth).
     - Check `accounts` table: `balance >= coinAmount`.
     - Validate `marketAddress` and `outcomeIndex` against known markets.
   - **On-Chain Quote**:
     - Backend calls `getAmountOut` on the `FixedProductMarketMaker` contract using `Viem`.
     - This determines how many "Outcome Tokens" the `coinAmount` (converted to on-chain collateral, e.g., USDC) would buy.
   - **Execution**:
     - Backend initiates a database transaction.
     - Deduct `coinAmount` from user's `accounts.balance`.
     - Create a `transactions` record with status `PENDING`.
     - Call `buy` on the smart contract from the **Backend Hot Wallet**.
   - **Confirmation**:
     - Upon successful on-chain transaction:
       - Update `transactions` record to `COMPLETED`.
       - Update/Create `user_positions` for that user and market, adding the `shares` received.
   - **Failure Handling**:
     - If on-chain transaction fails, roll back the coin deduction or refund the user.

## 2. Market Resolution & Payouts

1. **Market Closed**: When a market is resolved on-chain (oracle reports outcome).
2. **Backend Listener**: A background worker or a triggered job detects the resolution.
3. **Payout Calculation**:
   - Backend identifies all `user_positions` for the winning outcome in that market.
   - Backend calculates the coin value of those shares (e.g., 1 share = 1 coin if it's 1:1 parity at resolution).
4. **Distribution**:
   - Backend updates user balances.
   - Backend creates `REWARD` transaction records.
   - Backend sells the winning outcome tokens on-chain to recover the collateral into the hot wallet.

## 3. Hot Wallet Management

The backend needs a wallet with:
- Native tokens (MATIC/POL) for gas.
- Collateral tokens (e.g., USDC or the Market's base token) to buy outcome tokens.

**Security**:
- The private key must NEVER be in the code.
- Use `process.env.BACKEND_PRIVATE_KEY`.
- Limit the amount of collateral held in the hot wallet at any time.

## 4. Why this works for the user
- **Speed**: UI can show "Processing" while the backend handles gas and relaying.
- **Cost**: User pays 0 gas. The platform can absorb gas fees or include them in a small spread/fee.
- **Accessibility**: User doesn't need to know what a "Wallet" or "MATIC" is. They just see "Coins".
