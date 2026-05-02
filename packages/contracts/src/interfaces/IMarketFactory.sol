// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMarketFactory {
    event MarketCreated(address indexed marketAddress, address indexed fpmmAddress, address indexed creator, string title);

    function createMarket(
        string calldata title,
        string calldata description,
        string[] calldata outcomeNames,
        uint256 endDate,
        address collateralToken
    ) external returns (address, address);

    function allMarkets() external view returns (address[] memory);
    function allFPMMs() external view returns (address[] memory);
    function getMarketCount() external view returns (uint256);
}
