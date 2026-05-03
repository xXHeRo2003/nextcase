import { pgTable, uuid, text, decimal, timestamp, integer, jsonb, pgEnum, primaryKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const transactionTypeEnum = pgEnum('transaction_type', ['PURCHASE', 'BET_BUY', 'BET_SELL', 'REWARD']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'COMPLETED', 'FAILED']);

// --- Auth Tables (NextAuth) ---

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  passwordHash: text('password_hash'),
  walletAddress: text('wallet_address').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- Application Tables ---

export const coinBalances = pgTable('coin_balances', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  balance: decimal('balance', { precision: 20, scale: 2 }).default('0.00').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: transactionTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 20, scale: 2 }).notNull(),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  externalId: text('external_id'), // PayPal Order ID or Blockchain Tx Hash
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const marketStatusEnum = pgEnum('market_status', ['OPEN', 'CLOSED', 'RESOLVED']);

export const markets = pgTable('markets', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  description: text('description'),
  category: text('category'),
  status: marketStatusEnum('status').default('OPEN').notNull(),
  resolutionDate: timestamp('resolution_date').notNull(),
  winningOutcomeIndex: integer('winning_outcome_index'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const marketOutcomes = pgTable('market_outcomes', {
  id: uuid('id').primaryKey().defaultRandom(),
  marketId: uuid('market_id')
    .references(() => markets.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  index: integer('index').notNull(),
});

export const marketPools = pgTable('market_pools', {
  id: uuid('id').primaryKey().defaultRandom(),
  marketId: uuid('market_id')
    .references(() => markets.id, { onDelete: 'cascade' })
    .notNull(),
  outcomeIndex: integer('outcome_index').notNull(),
  liquidity: decimal('liquidity', { precision: 40, scale: 18 }).default('100.00').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniquePool: unique('unique_pool').on(table.marketId, table.outcomeIndex),
}));

export const userPositions = pgTable('user_positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  marketId: uuid('market_id')
    .references(() => markets.id, { onDelete: 'cascade' })
    .notNull(),
  outcomeIndex: integer('outcome_index').notNull(),
  shares: decimal('shares', { precision: 40, scale: 18 }).notNull(),
  totalInvested: decimal('total_invested', { precision: 20, scale: 2 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniquePosition: unique('unique_position').on(table.userId, table.marketId, table.outcomeIndex),
}));

// --- Relations ---

export const marketRelations = relations(markets, ({ many }) => ({
  outcomes: many(marketOutcomes),
  pools: many(marketPools),
}));

export const marketOutcomeRelations = relations(marketOutcomes, ({ one }) => ({
  market: one(markets, {
    fields: [marketOutcomes.marketId],
    references: [markets.id],
  }),
}));

export const marketPoolRelations = relations(marketPools, ({ one }) => ({
  market: one(markets, {
    fields: [marketPools.marketId],
    references: [markets.id],
  }),
}));
