// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFixedProductMarketMaker {
    event FPMMCreated(address indexed market, address indexed collateralToken);
    event FPMMBuy(address indexed buyer, uint256 outcomeIndex, uint256 collateralAmount, uint256 outcomeTokenAmount);
    event FPMMSell(address indexed seller, uint256 outcomeIndex, uint256 collateralAmount, uint256 outcomeTokenAmount);
    event FPMMLiquidityAdded(address indexed provider, uint256 collateralAmount, uint256 lpTokensMinted);
    event FPMMLiquidityRemoved(address indexed provider, uint256 collateralAmount, uint256 lpTokensBurned);

    function buy(uint256 outcomeIndex, uint256 collateralAmount, uint256 minOutcomeTokens) external;
    function sell(uint256 outcomeIndex, uint256 outcomeTokenAmount, uint256 minCollateral) external;
    
    function addLiquidity(uint256 collateralAmount) external;
    function removeLiquidity(uint256 lpAmount) external;

    function getPoolBalances() external view returns (uint256[] memory);
    function calcBuyAmount(uint256 outcomeIndex, uint256 collateralAmount) external view returns (uint256);
}
