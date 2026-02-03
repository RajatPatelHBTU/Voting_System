// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Voting.sol";

contract DeployVoting is Script {
    function run() external {
        vm.startBroadcast();
        Voting voting = new Voting();
        console.log("Voting contract deployed at:", address(voting));
        vm.stopBroadcast();
    }
}
