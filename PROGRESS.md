# NextCase Project Progress

## 📅 Last Update: 2026-05-01

## ✅ Completed Tasks (Phase 1)
- [x] **Smart Contract Architecture**: Implemented `MarketFactory`, `Market`, and `OutcomeToken`.
- [x] **AMM Logic**: Developed `FixedProductMarketMaker` (FPMM) using a constant product invariant ($\prod B_i = K$).
- [x] **Foundry Testing**: Comprehensive test suite in `Market.t.sol` covering liquidity, trading, resolution, and redemption.
- [x] **Infrastructure**: Optimized `.gitignore`, configured `foundry.toml` with `via-ir` for complex deployments.
- [x] **Frontend Basics**: Added `/profile` route to fix navigation errors.
- [x] **Source Control**: Successfully pushed core logic to GitHub.
- [x] **Backend Implementation (Issue #19 & #7)**: 
    - [x] Setup Drizzle ORM and PostgreSQL connection.
    - [x] Implement Auth.js (NextAuth) for user management.
    - [x] Create API routes for Ledger system (`/wallet/balance`, `/wallet/history`).
    - [x] Integrate PayPal SDK for coin purchases.
    - [x] Build the Blockchain Relayer service for gasless trading.
- [x] **Frontend "Glow-up" (Issue #10 & #11)**:
    - [x] Redesigned `MarketCard` with a premium look and progress bars.
    - [x] Implemented `TradeDialog` for placing bets.
    - [x] Integrated shadcn/ui components (Dialog, Progress, Tabs, Label).

## 🚀 Active / Next Tasks

### 1. Smart Contract Deployment (Issue #5)
- [x] Install Foundry & setup environment.
- [x] Verify build and run tests (`Market.t.sol`).
- [x] Create `contracts/.env` template.
- [ ] Fill `contracts/.env` with actual private keys and Amoy RPC.
- [ ] Execute `Deploy.s.sol` on Polygon Amoy Testnet.
- [ ] Verify contracts on Polygonscan.

### 2. Web3 Integration (#8 & #12)
- [ ] Integrate RainbowKit/wagmi for wallet connection.
- [ ] Connect frontend to the deployed smart contracts on Amoy.

## 📝 Technical Notes
- **AMM Formula**: $A_i = B_i \cdot (1 - \prod_{j \neq i} \frac{B_j}{B_j + c})$
- **Deployment Network**: Polygon Amoy Testnet
- **Key Files**: 
    - `contracts/src/MarketFactory.sol` (Entry Point)
    - `contracts/src/FixedProductMarketMaker.sol` (Trading Engine)
