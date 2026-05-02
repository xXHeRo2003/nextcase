import { describe, it, expect, vi, beforeEach } from 'vitest';
import { creditCoins, getCoinBalance, deductCoins } from './ledger';
import { db } from '@nextcase/database';

vi.mock('@nextcase/database', () => ({
  db: {
    transaction: vi.fn(),
    query: {
      coinBalances: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe('Ledger Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 0.00 for non-existent balance', async () => {
    (db.query.coinBalances.findFirst as any).mockResolvedValue(null);
    const balance = await getCoinBalance('user-1');
    expect(balance).toBe('0.00');
  });

  it('should return correct balance', async () => {
    (db.query.coinBalances.findFirst as any).mockResolvedValue({ balance: '100.00' });
    const balance = await getCoinBalance('user-1');
    expect(balance).toBe('100.00');
  });

  // More complex tests for credit/deduct would need mocking the transaction tx object
});
