# NextCase Project Progress

## 📅 Last Update: 2026-04-30

## ✅ Completed Tasks (Phase 1)
- [x] **Smart Contract Architecture**: Implemented `MarketFactory`, `Market`, and `OutcomeToken`.
- [x] **AMM Logic**: Developed `FixedProductMarketMaker` (FPMM) using a constant product invariant ($\prod B_i = K$).
- [x] **Foundry Testing**: Comprehensive test suite in `Market.t.sol` covering liquidity, trading, resolution, and redemption.
- [x] **Infrastructure**: Optimized `.gitignore`, configured `foundry.toml` with `via-ir` for complex deployments.
- [x] **Frontend Basics**: Added `/profile` route to fix navigation errors.
- [x] **Source Control**: Successfully pushed core logic to GitHub.

## 🚀 Active / Next Tasks

### 1. Smart Contract Deployment (Issue #5)
- [ ] Create `contracts/.env` with private keys and Amoy RPC.
- [ ] Execute `Deploy.s.sol` on Polygon Amoy Testnet.
- [ ] Verify contracts on Polygonscan.

### 2. Backend & Virtual Coin System (Issue #19 & #7)
- [ ] Setup Node.js/PostgreSQL backend foundation.
- [ ] Implement the Ledger system for "NextCase Coins" (Centralized database tracking).
- [ ] Define API endpoints for coin balance and transaction history.

### 3. Frontend "Glow-up" & UI Implementation
- [ ] Refactor `MarketCard` for a more premium look (visual probabilities, better spacing).
- [ ] Implement actual "Trade" dialogs using the new FPMM logic.
- [ ] Build the Trading Interface (#11) and Market Details (#10).

### 4. Web3 Integration (#8 & #12)
- [ ] Integrate RainbowKit/wagmi for wallet connection.
- [ ] Connect frontend to the deployed smart contracts on Amoy.

## 📝 Technical Notes
- **AMM Formula**: $A_i = B_i \cdot (1 - \prod_{j \neq i} \frac{B_j}{B_j + c})$
- **Deployment Network**: Polygon Amoy Testnet
- **Key Files**: 
    - `contracts/src/MarketFactory.sol` (Entry Point)
    - `contracts/src/FixedProductMarketMaker.sol` (Trading Engine)
