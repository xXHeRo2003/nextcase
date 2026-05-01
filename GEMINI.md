# Project: NextCase

NextCase is a Web3 trading platform inspired by Polymarket, built on the Polygon network. It features automated market makers (AMM), decentralized market creation, and a modern trading interface.

### Economic Model & Payments
- **Virtual Coin System:** Users purchase "NextCase Coins" (similar to Gems in Clash of Clans). This is a centralized virtual currency managed in our database.
- **User Experience:** No crypto-wallet or gas fees required for the user. They just see their coin balance.
- **On-Ramp:** Integration of PayPal for direct fiat-to-coin purchase.
- **Betting:** Users place bets using their virtual coins. The backend manages the ledger and ensures payouts.

## Core Technologies
- **Frontend:** Next.js (TypeScript), Tailwind CSS, shadcn/ui.
- **Web3:** RainbowKit, wagmi, Viem, Foundry (Smart Contracts), Subgraph (The Graph).
- **Backend:** Node.js, PostgreSQL.
- **Features:** AMM Liquidity Pools, Market Discovery, Advanced Charting (TradingView), Portfolio Tracking.

## Development Workflow & Agent Usage

Follow this guide to determine which agent to invoke for specific tasks:

| Task Category | Primary Agent | Secondary Agent |
| :--- | :--- | :--- |
| **Architectural Planning** | `project-manager` | `codebase_investigator` |
| **Frontend/UI Implementation** | `react-expert` | `ui-ux-designer` / `frontend-expert` |
| **Smart Contracts / Web3** | `blockchain-expert` | `security-expert` |
| **API & Database Logic** | `backend-expert` | `security-expert` |
| **DevOps & Deployment** | `devops-expert` | - |
| **Testing & QA** | `test-architect` | - |
| **Security Audits** | `security-expert` | - |

### GitHub Issue Workflow

Ich bearbeite Issues schrittweise nach folgendem Prozess:

1. **Planung:** Für jedes Issue erstelle ich zuerst einen detaillierten Lösungsplan und lege fest, welche Experten-Agenten beteiligt sind.
2. **Umsetzung:** Schritt-für-Schritt Bearbeitung des Issues unter Einbeziehung der gewählten Agenten.
3. **Abschluss & Push:** Sobald ein Issue vollständig gelöst und verifiziert ist, wird das Issue auf GitHub als erledigt markiert und der fertige Stand mit einem Commit/Push auf GitHub hochgeladen.
4. **Nächster Schritt:** Erst nach erfolgreichem Push widme ich mich dem nächsten Issue.

## Engineering Mandates

1. **Clean Code:** Adhere to SOLID principles. Keep components small and logic modular. Use descriptive naming.
2. **Security First:** Always validate inputs, handle private keys securely (never commit!), and follow Web3 security best practices (e.g., Reentrancy protection).
3. **Mandatory Testing:** No feature is complete without tests. 
    - Frontend: Unit tests for components/hooks.
    - Contracts: Foundry tests for all logic paths.
    - Backend: Integration tests for API endpoints.
4. **Documentation:** Update `GEMINI.md` or relevant READMEs when introducing major architectural changes.
5. **Validation:** Always run local tests and linting before finalizing a task.
