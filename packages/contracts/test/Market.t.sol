// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MarketFactory.sol";
import "../src/Market.sol";
import "../src/FixedProductMarketMaker.sol";
import "./mocks/MockERC20.sol";

contract MarketTest is Test {
    MarketFactory public factory;
    Market public market;
    FixedProductMarketMaker public fpmm;
    MockERC20 public collateral;
    
    address public admin = address(1);
    address public creator = address(2);
    address public user = address(3);
    address public protocolFeeRecipient = address(4);

    function setUp() public {
        vm.prank(admin);
        factory = new MarketFactory(protocolFeeRecipient);
        
        collateral = new MockERC20("USDC", "USDC");
        
        string[] memory outcomes = new string[](2);
        outcomes[0] = "Yes";
        outcomes[1] = "No";
        
        vm.prank(creator);
        (address marketAddr, address fpmmAddr) = factory.createMarket(
            "Will ETH hit $10k?",
            "Eth 10k prediction",
            outcomes,
            block.timestamp + 1 days,
            address(collateral)
        );
        
        market = Market(marketAddr);
        fpmm = FixedProductMarketMaker(fpmmAddr);
    }

    function testAddLiquidity() public {
        uint256 amount = 1000 * 10**18;
        collateral.mint(user, amount);
        
        vm.startPrank(user);
        collateral.approve(address(fpmm), amount);
        fpmm.addLiquidity(amount);
        vm.stopPrank();
        
        assertEq(fpmm.totalSupply(), amount);
        assertEq(fpmm.balanceOf(user), amount);
        
        uint256[] memory balances = fpmm.getPoolBalances();
        assertEq(balances[0], amount);
        assertEq(balances[1], amount);
    }

    function testBuyShares() public {
        // 1. Add Liquidity first
        uint256 liqAmount = 1000 * 10**18;
        collateral.mint(admin, liqAmount);
        vm.startPrank(admin);
        collateral.approve(address(fpmm), liqAmount);
        fpmm.addLiquidity(liqAmount);
        vm.stopPrank();

        // 2. Buy shares
        uint256 buyAmount = 100 * 10**18;
        collateral.mint(user, buyAmount);
        
        vm.startPrank(user);
        collateral.approve(address(fpmm), buyAmount);
        
        uint256 expected = fpmm.calcBuyAmount(0, buyAmount - (buyAmount * 100 / 10000));
        fpmm.buy(0, buyAmount, 0);
        vm.stopPrank();
        
        address[] memory outcomeTokens = market.getOutcomeTokens();
        uint256 userBalance = IERC20(outcomeTokens[0]).balanceOf(user);
        assertEq(userBalance, expected);
        assertTrue(userBalance > 0);
    }

    function testPriceMovement() public {
        uint256 liqAmount = 1000 * 10**18;
        collateral.mint(admin, liqAmount);
        vm.startPrank(admin);
        collateral.approve(address(fpmm), liqAmount);
        fpmm.addLiquidity(liqAmount);
        vm.stopPrank();

        uint256 buyAmount = 500 * 10**18;
        collateral.mint(user, buyAmount);
        
        // Price before
        uint256 priceBefore = fpmm.calcBuyAmount(0, 1 * 10**18);
        
        vm.startPrank(user);
        collateral.approve(address(fpmm), buyAmount);
        fpmm.buy(0, buyAmount, 0);
        vm.stopPrank();
        
        // Price after (should be more expensive, so we get fewer shares for same collateral)
        uint256 priceAfter = fpmm.calcBuyAmount(0, 1 * 10**18);
        
        assertTrue(priceAfter < priceBefore);
    }

    function testFullLifecycle() public {
        // 1. Initial Liquidity
        uint256 liqAmount = 1000 * 10**18;
        collateral.mint(admin, liqAmount);
        vm.startPrank(admin);
        collateral.approve(address(fpmm), liqAmount);
        fpmm.addLiquidity(liqAmount);
        vm.stopPrank();

        // 2. User buys "Yes" (outcome 0)
        uint256 buyAmount = 100 * 10**18;
        collateral.mint(user, buyAmount);
        vm.startPrank(user);
        collateral.approve(address(fpmm), buyAmount);
        fpmm.buy(0, buyAmount, 0);
        vm.stopPrank();

        address[] memory outcomes = market.getOutcomeTokens();
        uint256 userShares = IERC20(outcomes[0]).balanceOf(user);
        assertTrue(userShares > 0);

        // 3. Resolve market to "Yes"
        vm.prank(creator);
        market.resolve(0);

        // 4. User redeems
        uint256 balanceBefore = collateral.balanceOf(user);
        vm.prank(user);
        market.redeemShares();
        uint256 balanceAfter = collateral.balanceOf(user);

        assertEq(balanceAfter - balanceBefore, userShares);
        assertEq(IERC20(outcomes[0]).balanceOf(user), 0);
    }
}
