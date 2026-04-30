// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MarketFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address protocolFeeRecipient = vm.envAddress("PROTOCOL_FEE_RECIPIENT");

        vm.startBroadcast(deployerPrivateKey);

        MarketFactory factory = new MarketFactory(protocolFeeRecipient);

        console.log("MarketFactory deployed to:", address(factory));

        vm.stopBroadcast();
    }
}
