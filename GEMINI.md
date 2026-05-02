# Project: NextCase

NextCase is a Web3 trading platform inspired by Polymarket, built on the Polygon network. It features automated market makers (AMM), decentralized market creation, and a modern trading interface.

## Monorepo Architecture
The project is organized as a Turborepo-based monorepo using NPM workspaces:

- `apps/web`: Next.js Frontend (TypeScript, Tailwind CSS, shadcn/ui).
- `packages/contracts`: Foundry Smart Contracts.
- `packages/database`: Drizzle ORM, schema definitions, and migrations.
- `packages/shared`: Shared TypeScript types and utilities.

### Economic Model & Payments
- **Virtual Coin System:** Users purchase "NextCase Coins" managed in our database.
- **User Experience:** No crypto-wallet or gas fees required for the user.
- **On-Ramp:** Integration of PayPal for direct fiat-to-coin purchase.
- **Betting:** Users place bets using virtual coins; backend manages the ledger and ensures payouts.

## Core Technologies
- **Frontend:** Next.js (TypeScript), Tailwind CSS, shadcn/ui.
- **Web3:** Viem, Foundry (Smart Contracts).
- **Backend:** Node.js, PostgreSQL (Drizzle ORM).
- **Features:** AMM Liquidity Pools, Market Discovery, Portfolio Tracking.

## Development Workflow

### Useful Commands (Root)
- `npm run dev`: Start the development server for the web app (via Turbo).
- `npm run build`: Build all workspaces (Web app, database, and contracts).
- `npm run test`: Run tests across all workspaces.
- `npm run format`: Format the entire codebase using Prettier.
- `npm run contracts:build`: Build only the smart contracts.

### Agent Usage
Refer to this guide to determine which agent to invoke for specific tasks:

| Task Category | Primary Agent | Secondary Agent |
| :--- | :--- | :--- |
| **Architectural Planning** | `project-manager` | `codebase_investigator` |
| **Frontend/UI Implementation** | `react-expert` | `ui-ux-designer` |
| **Smart Contracts / Web3** | `blockchain-expert` | `security-expert` |
| **API & Database Logic** | `backend-expert` | `security-expert` |
| **DevOps & Deployment** | `devops-expert` | - |
| **Testing & QA** | `test-architect` | - |

## Engineering Mandates
1. **Clean Code:** Adhere to SOLID principles. Keep components small and logic modular.
2. **Security First:** Always validate inputs and handle private keys securely.
3. **Mandatory Testing:** No feature is complete without tests (Frontend, Contracts, and Backend).
4. **Validation:** Always run local tests (`npm run test`) and linting before finalizing a task.
