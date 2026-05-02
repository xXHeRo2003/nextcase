// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IMarket.sol";
import "./OutcomeToken.sol";

contract Market is IMarket, ReentrancyGuard, Ownable {
    MarketInfo public info;
    OutcomeToken[] public outcomeTokens;
    
    constructor(
        string memory _title,
        string memory _description,
        string[] memory _outcomeNames,
        uint256 _endDate,
        address _collateralToken,
        address _creator
    ) Ownable(_creator) {
        info = MarketInfo({
            title: _title,
            description: _description,
            endDate: _endDate,
            status: MarketStatus.Open,
            winningOutcome: 0,
            collateralToken: _collateralToken,
            creator: _creator
        });
        
        for (uint256 i = 0; i < _outcomeNames.length; i++) {
            outcomeTokens.push(new OutcomeToken(_outcomeNames[i], string(abi.encodePacked("NC-", _outcomeNames[i])), address(this)));
        }
    }

    function mintShares(uint256 amount) external override nonReentrant {
        require(info.status == MarketStatus.Open, "Market not open");
        require(block.timestamp < info.endDate, "Market ended");

        IERC20(info.collateralToken).transferFrom(msg.sender, address(this), amount);
        
        for (uint256 i = 0; i < outcomeTokens.length; i++) {
            outcomeTokens[i].mint(msg.sender, amount);
        }

        emit SharesMinted(msg.sender, amount);
    }

    function burnShares(uint256 amount) external override nonReentrant {
        // Merging can happen anytime if market is open
        require(info.status == MarketStatus.Open, "Market not open");

        for (uint256 i = 0; i < outcomeTokens.length; i++) {
            outcomeTokens[i].burn(msg.sender, amount);
        }

        IERC20(info.collateralToken).transfer(msg.sender, amount);

        emit SharesBurned(msg.sender, amount);
    }

    function redeemShares() external override nonReentrant {
        require(info.status == MarketStatus.Resolved, "Market not resolved");
        
        uint256 winningOutcomeIndex = info.winningOutcome;
        OutcomeToken winningToken = outcomeTokens[winningOutcomeIndex];
        uint256 userShares = winningToken.balanceOf(msg.sender);
        
        require(userShares > 0, "No winning shares");

        // Burn the winning shares
        winningToken.burn(msg.sender, userShares);
        
        // Payout 1:1
        IERC20(info.collateralToken).transfer(msg.sender, userShares);
        
        emit SharesRedeemed(msg.sender, userShares, userShares);
    }

    function resolve(uint256 winningOutcome) external override onlyOwner {
        require(info.status == MarketStatus.Open, "Market not open");
        require(winningOutcome < outcomeTokens.length, "Invalid winning outcome");
        
        info.status = MarketStatus.Resolved;
        info.winningOutcome = winningOutcome;
        
        emit MarketResolved(winningOutcome);
    }

    function cancel() external override onlyOwner {
        require(info.status == MarketStatus.Open, "Market not open");
        
        info.status = MarketStatus.Cancelled;
        
        emit MarketCancelled();
    }

    function getMarketInfo() external view override returns (MarketInfo memory) {
        return info;
    }

    function getOutcomeTokens() external view override returns (address[] memory) {
        address[] memory addresses = new address[](outcomeTokens.length);
        for (uint256 i = 0; i < outcomeTokens.length; i++) {
            addresses[i] = address(outcomeTokens[i]);
        }
        return addresses;
    }

    function getOutcomeTokenCount() external view override returns (uint256) {
        return outcomeTokens.length;
    }
}
