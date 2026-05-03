# Project: NextCase

NextCase is a prediction market platform inspired by Polymarket. It features automated market makers (AMM), virtual currency trading, and a modern terminal aesthetic.
## Pure Web2 Architecture
The project is organized as a Turborepo-based monorepo using NPM workspaces:

- `apps/web`: Next.js Frontend & API (TypeScript, Tailwind CSS, shadcn/ui).
- `packages/database`: Drizzle ORM, schema definitions (PostgreSQL).
- `packages/shared`: Shared TypeScript types and utilities.

### Economic Model & Trading
- **Virtual Coin System:** Users purchase "NextCase Coins" (fiat-to-coin via PayPal) managed in our database.
- **AMM Logic:** Markets use a Constant Product Invariant (FPMM) implemented directly in the backend (`MarketService.ts`).
- **Authentication:** Standard Email/Password login via NextAuth (Credentials Provider).
- **Performance:** Instant trades with 0 gas fees and no wallet required.
- **Trust:** Secured via atomic SQL transactions and high-precision calculations (`decimal.js`).

## Core Technologies
- **Frontend:** Next.js (TypeScript), Tailwind CSS, shadcn/ui.
- **Backend:** Node.js, PostgreSQL (Drizzle ORM).
- **Features:** AMM Liquidity Pools, Market Discovery, Portfolio Tracking.


## Development Workflow

### Useful Commands (Root)
- `npm run dev`: Start the development server for the web app (via Turbo).
- `npm run build`: Build all workspaces (Web app and database).
- `npm run test`: Run tests across all workspaces.
- `npm run format`: Format the entire codebase using Prettier.

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
