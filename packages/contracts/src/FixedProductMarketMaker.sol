// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IFixedProductMarketMaker.sol";
import "./interfaces/IMarket.sol";

contract FixedProductMarketMaker is IFixedProductMarketMaker, ERC20, ReentrancyGuard {
    IMarket public immutable market;
    IERC20 public immutable collateralToken;
    IERC20[] public outcomeTokens;

    uint256 public constant FEE_BPS = 100; // 1%
    uint256 public constant ONE = 10**18;

    constructor(
        address _market,
        address _collateralToken,
        address[] memory _outcomeTokens
    ) ERC20("NextCase LP Token", "NC-LP") {
        market = IMarket(_market);
        collateralToken = IERC20(_collateralToken);
        for (uint256 i = 0; i < _outcomeTokens.length; i++) {
            outcomeTokens.push(IERC20(_outcomeTokens[i]));
        }
    }

    function buy(uint256 outcomeIndex, uint256 collateralAmount, uint256 minOutcomeTokens) external override nonReentrant {
        uint256 fee = (collateralAmount * FEE_BPS) / 10000;
        uint256 collateralAfterFee = collateralAmount - fee;

        uint256 outcomeTokensBought = calcBuyAmount(outcomeIndex, collateralAfterFee);
        require(outcomeTokensBought >= minOutcomeTokens, "Slippage too high");

        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        
        // Approve and mint full sets from Market
        collateralToken.approve(address(market), collateralAfterFee);
        market.mintShares(collateralAfterFee);

        // At this point, this contract holds 'collateralAfterFee' of EACH outcome token.
        // It keeps all tokens EXCEPT the one the user is buying.
        // The user receives the outcome tokens already in the pool + the newly minted ones.
        
        outcomeTokens[outcomeIndex].transfer(msg.sender, outcomeTokensBought);

        emit FPMMBuy(msg.sender, outcomeIndex, collateralAmount, outcomeTokensBought);
    }

    function sell(uint256 outcomeIndex, uint256 outcomeTokenAmount, uint256 minCollateral) external override nonReentrant {
        // Selling is inverse of buying. 
        // User provides outcome tokens, pool gives back collateral.
        // Formula: collateralOut = calcSellAmount(...)
        // For simplicity in this first version, we focus on buy and liquidity.
        // Selling can be implemented as swapping outcome i for all other outcomes, then merging.
        revert("Sell not yet implemented");
    }

    function addLiquidity(uint256 collateralAmount) external override nonReentrant {
        uint256 lpTokensToMint;
        uint256 poolShare;

        if (totalSupply() == 0) {
            lpTokensToMint = collateralAmount;
        } else {
            // This is a simplified LP logic. Real one should check ratios.
            // For FPMM, we usually require LPs to provide a "full set" or collateral that is then split.
            lpTokensToMint = (collateralAmount * totalSupply()) / collateralToken.balanceOf(address(this));
        }

        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        collateralToken.approve(address(market), collateralAmount);
        market.mintShares(collateralAmount);

        _mint(msg.sender, lpTokensToMint);
        emit FPMMLiquidityAdded(msg.sender, collateralAmount, lpTokensToMint);
    }

    function removeLiquidity(uint256 lpAmount) external override nonReentrant {
        uint256 collateralToReturn = (lpAmount * collateralToken.balanceOf(address(this))) / totalSupply();
        
        // This is complex because the pool holds outcome tokens, not just collateral.
        // LPs should get their share of all outcome tokens or we merge them if balanced.
        revert("Remove liquidity not yet implemented");
    }

    function calcBuyAmount(uint256 outcomeIndex, uint256 collateralAmount) public view override returns (uint256) {
        uint256[] memory balances = getPoolBalances();
        uint256 outcomeCount = balances.length;
        
        // Formula: s = B_i + c - B_i * product(B_j / (B_j + c)) for j != i
        uint256 product = ONE;
        for (uint256 j = 0; j < outcomeCount; j++) {
            if (j != outcomeIndex) {
                product = (product * balances[j]) / (balances[j] + collateralAmount);
            }
        }
        
        uint256 shares = balances[outcomeIndex] + collateralAmount - (balances[outcomeIndex] * product) / ONE;
        return shares;
    }

    function getPoolBalances() public view override returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](outcomeTokens.length);
        for (uint256 i = 0; i < outcomeTokens.length; i++) {
            balances[i] = outcomeTokens[i].balanceOf(address(this));
        }
        return balances;
    }
}
