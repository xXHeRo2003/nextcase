import { createWalletClient, createPublicClient, http, parseAbi, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';

// In a real app, these would be loaded from environment variables
const PRIVATE_KEY = (process.env.HOT_WALLET_PRIVATE_KEY as `0x${string}`) || '0x0000000000000000000000000000000000000000000000000000000000000000';
const RPC_URL = process.env.AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology';

const account = privateKeyToAccount(PRIVATE_KEY);

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(RPC_URL),
});

export const walletClient = createWalletClient({
  account,
  chain: polygonAmoy,
  transport: http(RPC_URL),
});

// ABIs (Placeholder until contracts are built/deployed)
// These should match FixedProductMarketMaker.sol
export const FPMM_ABI = parseAbi([
  'function buy(uint256 investmentAmount, uint256 outcomeIndex, uint256 minOutcomeTokensToBuy) external',
  'function sell(uint256 returnAmount, uint256 outcomeIndex, uint256 maxOutcomeTokensToSell) external',
  'function calcBuyAmount(uint256 investmentAmount, uint256 outcomeIndex) public view returns (uint256)',
  'function calcSellAmount(uint256 returnAmount, uint256 outcomeIndex) public view returns (uint256)',
]);

export async function buyOnChain(
  marketAddress: string,
  outcomeIndex: number,
  coinAmount: number
) {
  // 1. Calculate min tokens to buy (for slippage, e.g., 1%)
  const investmentAmount = BigInt(coinAmount); // Assuming coins map 1:1 to some base unit or we handle decimals here
  
  const tokensToBuy = await publicClient.readContract({
    address: marketAddress as Address,
    abi: FPMM_ABI,
    functionName: 'calcBuyAmount',
    args: [investmentAmount, BigInt(outcomeIndex)],
  });

  const minTokens = (tokensToBuy * 99n) / 100n; // 1% slippage

  // 2. Execute buy
  const hash = await walletClient.writeContract({
    address: marketAddress as Address,
    abi: FPMM_ABI,
    functionName: 'buy',
    args: [investmentAmount, BigInt(outcomeIndex), minTokens],
  });

  return { hash, tokensToBuy };
}

export async function sellOnChain(
  marketAddress: string,
  outcomeIndex: number,
  tokenAmount: bigint
) {
  // 1. Calculate return amount
  const returnAmount = await publicClient.readContract({
    address: marketAddress as Address,
    abi: FPMM_ABI,
    functionName: 'calcSellAmount',
    args: [tokenAmount, BigInt(outcomeIndex)],
  });

  const maxTokens = (tokenAmount * 101n) / 100n; // 1% slippage

  // 2. Execute sell
  const hash = await walletClient.writeContract({
    address: marketAddress as Address,
    abi: FPMM_ABI,
    functionName: 'sell',
    args: [returnAmount, BigInt(outcomeIndex), maxTokens],
  });

  return { hash, returnAmount };
}
