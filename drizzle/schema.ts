import { pgTable, foreignKey, uuid, numeric, timestamp, unique, integer, text, jsonb, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const marketStatus = pgEnum("market_status", ['OPEN', 'CLOSED', 'RESOLVED'])
export const transactionStatus = pgEnum("transaction_status", ['PENDING', 'COMPLETED', 'FAILED'])
export const transactionType = pgEnum("transaction_type", ['PURCHASE', 'BET_BUY', 'BET_SELL', 'REWARD'])


export const coinBalances = pgTable("coin_balances", {
	userId: uuid("user_id").primaryKey().notNull(),
	balance: numeric({ precision: 20, scale:  2 }).default('0.00').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "coin_balances_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const marketPools = pgTable("market_pools", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	marketId: uuid("market_id").notNull(),
	outcomeIndex: integer("outcome_index").notNull(),
	liquidity: numeric({ precision: 40, scale:  18 }).default('100.00').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [markets.id],
			name: "market_pools_market_id_markets_id_fk"
		}).onDelete("cascade"),
	unique("unique_pool").on(table.marketId, table.outcomeIndex),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const transactions = pgTable("transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: transactionType().notNull(),
	amount: numeric({ precision: 20, scale:  2 }).notNull(),
	status: transactionStatus().default('PENDING').notNull(),
	externalId: text("external_id"),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "transactions_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const userPositions = pgTable("user_positions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	marketId: uuid("market_id").notNull(),
	outcomeIndex: integer("outcome_index").notNull(),
	shares: numeric({ precision: 40, scale:  18 }).notNull(),
	totalInvested: numeric("total_invested", { precision: 20, scale:  2 }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_positions_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [markets.id],
			name: "user_positions_market_id_markets_id_fk"
		}).onDelete("cascade"),
	unique("unique_position").on(table.userId, table.marketId, table.outcomeIndex),
]);

export const markets = pgTable("markets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	question: text().notNull(),
	description: text(),
	category: text(),
	status: marketStatus().default('OPEN').notNull(),
	resolutionDate: timestamp("resolution_date", { mode: 'string' }).notNull(),
	winningOutcomeIndex: integer("winning_outcome_index"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	passwordHash: text("password_hash"),
	walletAddress: text("wallet_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_wallet_address_unique").on(table.walletAddress),
]);

export const marketOutcomes = pgTable("market_outcomes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	marketId: uuid("market_id").notNull(),
	name: text().notNull(),
	index: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.marketId],
			foreignColumns: [markets.id],
			name: "market_outcomes_market_id_markets_id_fk"
		}).onDelete("cascade"),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
]);

export const account = pgTable("account", {
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
