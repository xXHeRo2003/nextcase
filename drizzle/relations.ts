import { relations } from "drizzle-orm/relations";
import { user, coinBalances, markets, marketPools, session, transactions, userPositions, marketOutcomes, account } from "./schema";

export const coinBalancesRelations = relations(coinBalances, ({one}) => ({
	user: one(user, {
		fields: [coinBalances.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	coinBalances: many(coinBalances),
	sessions: many(session),
	transactions: many(transactions),
	userPositions: many(userPositions),
	accounts: many(account),
}));

export const marketPoolsRelations = relations(marketPools, ({one}) => ({
	market: one(markets, {
		fields: [marketPools.marketId],
		references: [markets.id]
	}),
}));

export const marketsRelations = relations(markets, ({many}) => ({
	marketPools: many(marketPools),
	userPositions: many(userPositions),
	marketOutcomes: many(marketOutcomes),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const transactionsRelations = relations(transactions, ({one}) => ({
	user: one(user, {
		fields: [transactions.userId],
		references: [user.id]
	}),
}));

export const userPositionsRelations = relations(userPositions, ({one}) => ({
	user: one(user, {
		fields: [userPositions.userId],
		references: [user.id]
	}),
	market: one(markets, {
		fields: [userPositions.marketId],
		references: [markets.id]
	}),
}));

export const marketOutcomesRelations = relations(marketOutcomes, ({one}) => ({
	market: one(markets, {
		fields: [marketOutcomes.marketId],
		references: [markets.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));