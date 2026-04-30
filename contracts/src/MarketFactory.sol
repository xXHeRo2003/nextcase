// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";
import "./FixedProductMarketMaker.sol";
import "./interfaces/IMarketFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketFactory is IMarketFactory, Ownable {
    address[] private _allMarkets;
    address[] private _allFPMMs;
    address public protocolFeeRecipient;

    constructor(address _protocolFeeRecipient) Ownable(msg.sender) {
        protocolFeeRecipient = _protocolFeeRecipient;
    }

    function createMarket(
        string calldata title,
        string calldata description,
        string[] calldata outcomeNames,
        uint256 endDate,
        address collateralToken
    ) external override returns (address, address) {
        require(outcomeNames.length >= 2, "At least 2 outcomes required");
        
        // 1. Deploy Market
        Market newMarket = new Market(
            title,
            description,
            outcomeNames,
            endDate,
            collateralToken,
            msg.sender
        );
        
        // 2. Deploy FPMM
        FixedProductMarketMaker newFPMM = new FixedProductMarketMaker(
            address(newMarket),
            collateralToken,
            newMarket.getOutcomeTokens()
        );
        
        address marketAddress = address(newMarket);
        address fpmmAddress = address(newFPMM);
        
        _allMarkets.push(marketAddress);
        _allFPMMs.push(fpmmAddress);
        
        emit MarketCreated(marketAddress, fpmmAddress, msg.sender, title);
        
        return (marketAddress, fpmmAddress);
    }

    function getMarketCount() external view override returns (uint256) {
        return _allMarkets.length;
    }

    function allMarkets() external view override returns (address[] memory) {
        return _allMarkets;
    }

    function allFPMMs() external view override returns (address[] memory) {
        return _allFPMMs;
    }
    
    function setProtocolFeeRecipient(address _newRecipient) external onlyOwner {
        protocolFeeRecipient = _newRecipient;
    }
}
