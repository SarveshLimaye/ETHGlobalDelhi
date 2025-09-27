// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {HookMiner} from "@uniswap/v4-periphery/src/utils/HookMiner.sol";

import {BaseScript} from "./base/BaseScript.sol";

import {RefluxHook} from "../src/RefluxHook.sol";

/// @notice Mines the address and deploys the Counter.sol Hook contract
contract DeployHookScript is BaseScript {
    function run() public {
        // hook contracts must have specific flags encoded in the address
        uint160 flags = uint160(
            Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG | Hooks.BEFORE_ADD_LIQUIDITY_FLAG
                | Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG
        );

        // Mine a salt that will produce a hook address with the correct flags
        bytes memory constructorArgs = abi.encode(poolManager);
        (address hookAddress, bytes32 salt) =
            HookMiner.find(CREATE2_FACTORY, flags, type(RefluxHook).creationCode, constructorArgs);


        // @dev - TODO - Update this addresses while deploying
        address aavePool = address(1);
        address weth = address(2);

        // Deploy the hook using CREATE2
        vm.startBroadcast();
        RefluxHook refluxHook = new RefluxHook{salt: salt}(address(poolManager), aavePool, weth);
        vm.stopBroadcast();

        require(address(refluxHook) == hookAddress, "DeployHookScript: Hook Address Mismatch");
    }
}
