// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMarket {
    enum MarketStatus { Open, Resolved, Cancelled }

    struct MarketInfo {
        string title;
        string description;
        uint256 endDate;
        MarketStatus status;
        uint256 winningOutcome;
        address collateralToken;
        address creator;
    }

    event MarketResolved(uint256 winningOutcome);
    event MarketCancelled();
    event SharesMinted(address indexed minter, uint256 amount);
    event SharesBurned(address indexed burner, uint256 amount);
    event SharesRedeemed(address indexed redeemer, uint256 amount, uint256 payout);

    /**
     * @dev Splits collateral into a full set of outcome tokens (1:1 ratio).
     * User pays X collateral, gets X of EACH outcome token.
     */
    function mintShares(uint256 amount) external;

    /**
     * @dev Merges a full set of outcome tokens back into collateral (1:1 ratio).
     * User burns X of EACH outcome token, gets X collateral.
     */
    function burnShares(uint256 amount) external;

    /**
     * @dev Redeems winning shares for collateral after market resolution.
     */
    function redeemShares() external;

    function resolve(uint256 winningOutcome) external;
    function cancel() external;

    function getMarketInfo() external view returns (MarketInfo memory);
    function getOutcomeTokens() external view returns (address[] memory);
    function getOutcomeTokenCount() external view returns (uint256);
}
