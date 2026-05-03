# NextCase

NextCase is a modern prediction market platform built with Next.js and PostgreSQL.

## Features
- **Virtual Coin System:** Trade with NextCase Coins.
- **AMM Trading:** Automated Market Maker logic (FPMM) ensures constant liquidity.
- **Modern UI:** High-fidelity "Obsidian" design system.
- **Secure Ledger:** All trades and balances managed via atomic SQL transactions.

## Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui.
- **Database:** PostgreSQL, Drizzle ORM.
- **Auth:** NextAuth.js (Credentials Provider).

## Getting Started
1. `npm install`
2. `docker compose up -d` (PostgreSQL)
3. Set up `.env` with `DATABASE_URL`
4. `npm run dev`
