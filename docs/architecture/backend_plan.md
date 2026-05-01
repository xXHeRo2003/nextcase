# Backend & Virtual Coin System Architectural Plan

## 1. Overview
NextCase implements a "Virtual Coin" system to abstract away blockchain complexities (gas fees, wallets) for the end-user. The backend serves as the bridge between the centralized virtual currency and the decentralized prediction market contracts.

## 2. Core Components

### 2.1 Centralized Ledger (PostgreSQL)
Tracks user balances, virtual transactions, and off-chain representations of on-chain positions.

### 2.2 Payment Processor (PayPal)
Handles fiat-to-coin conversions.

### 2.3 Blockchain Relayer
A backend service (hot wallet) that executes trades on the Polygon network when users spend their virtual coins.

## 3. Database Schema (Proposed)

We will use **Drizzle ORM** for type-safe database access.

### Tables:

#### `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `email` | Text (Unique) | User's email |
| `password_hash` | Text | For email/password auth |
| `wallet_address` | Text (Unique) | (Optional) Linked Web3 wallet |
| `created_at` | Timestamp | Account creation date |

#### `accounts`
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | UUID (FK) | Reference to `users.id` |
| `balance` | Decimal(20, 2) | Current NextCase Coin balance |
| `updated_at` | Timestamp | Last balance update |

#### `transactions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Transaction ID |
| `user_id` | UUID (FK) | Reference to `users.id` |
| `type` | Enum | `PURCHASE`, `BET_BUY`, `BET_SELL`, `REWARD` |
| `amount` | Decimal(20, 2) | Amount of coins |
| `status` | Enum | `PENDING`, `COMPLETED`, `FAILED` |
| `external_id` | Text | PayPal ID or Blockchain Tx Hash |
| `metadata` | JSONB | Additional info (Market ID, Outcome index) |
| `created_at` | Timestamp | Transaction date |

#### `user_positions` (Virtual Portfolio)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Position ID |
| `user_id` | UUID (FK) | Reference to `users.id` |
| `market_address` | Text | Smart contract address |
| `outcome_index` | Integer | The outcome the user bet on |
| `shares` | Decimal(20, 6) | Virtualized outcome tokens held |
| `total_invested` | Decimal(20, 2) | Total coins spent on this position |

## 4. API Design (Next.js API Routes)

Base path: `/api/v1`

### 4.1 Wallet & Coins
- `GET /wallet/balance`: Returns current coin balance.
- `GET /wallet/history`: Returns transaction history.
- `POST /coins/purchase/create`: Initiates a PayPal order.
- `POST /coins/purchase/capture`: Confirms PayPal payment and credits coins.

### 4.2 Trading (Proxy to Smart Contracts)
- `POST /trade/buy`: 
    - Input: `marketAddress`, `outcomeIndex`, `coinAmount`.
    - Logic: 
        1. Check balance.
        2. Backend calculates expected shares via on-chain `getAmountOut`.
        3. Backend executes `buy` on `FixedProductMarketMaker.sol`.
        4. Deduct coins, update `user_positions` and `transactions`.
- `POST /trade/sell`:
    - Input: `marketAddress`, `outcomeIndex`, `shareAmount`.
    - Logic:
        1. Check user has enough virtual shares.
        2. Backend executes `sell` on-chain.
        3. Credit coins, update `user_positions` and `transactions`.

### 4.3 Market Discovery
- `GET /markets`: Returns list of markets (cached from subgraph/contracts).
- `GET /markets/:address`: Returns detailed market state.

## 5. Security Considerations
- **Hot Wallet Management:** The backend hot wallet must be secured. Use environment variables (AWS Secrets Manager or similar) and implement rate limiting.
- **Atomic Transactions:** Use SQL transactions to ensure that coin deductions and blockchain relaying are consistent. If a blockchain transaction fails, the coins must be returned (or held in a pending state).
- **Idempotency:** Implement idempotency keys for all trade and purchase requests to prevent double-spending.
- **Input Validation:** Strict validation of all API inputs using Zod.

## 6. Implementation Steps

1. **Setup Database:** Initialize PostgreSQL and Drizzle.
2. **Auth Integration:** Configure NextAuth for user management.
3. **Coin Ledger:** Implement balance management and transaction logging.
4. **PayPal Integration:** Set up sandbox environment for coin purchases.
5. **Blockchain Bridge:** Develop the service that interacts with `/contracts` using Viem and a private key.
6. **Testing:** Integration tests for the Ledger-Blockchain synchronization.
