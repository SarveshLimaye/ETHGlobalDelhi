// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Pool, Slot0} from "@uniswap/v4-core/src/libraries/Pool.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId} from "@uniswap/v4-core/src/types/PoolId.sol";
import {BalanceDelta, toBalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IWETH} from "./interfaces/IWETH.sol";
import {IPoolManager, ModifyLiquidityParams} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {TransientStateLibrary} from "@uniswap/v4-core/src/libraries/TransientStateLibrary.sol";
import {StateLibrary} from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import {Position} from "@uniswap/v4-core/src/libraries/Position.sol";
import {SafeCallback} from "@uniswap/v4-periphery/src/base/SafeCallback.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AaveConfig, IPool, UpdateLiquidityAave, AaveSwapParams, PoolMetadata} from "src/strategies/AaveConfig.sol";

/// @notice Stores basic information about a user’s position
struct PositionInfo {
    /// @notice Owner of the position
    address owner;
    /// @notice Lower tick boundary of the position
    int24 tickLower;
    /// @notice Upper tick boundary of the position
    int24 tickUpper;
    /// @notice The amount of liquidity in this position
    uint128 liquidity;
    /// @notice The multiplier of liquidity in this position
    uint16 multiplier;
    /// @notice Position debt
    BalanceDelta debt;
}

/// @notice Represents a liquidity range within a tick range
/// @dev Ranges are used to manage concentrated liquidity across specific tick ranges
struct LiquidityRange {
    /// @notice The lower tick boundary of the window
    int24 tickLower;
    /// @notice The upper tick boundary of the window
    int24 tickUpper;
    /// @notice The amount of liquidity in this window
    int128 liquidity;
    /// @notice Whether this window has been initialized
    bool initialized;
}

contract LiquidityRangeManager is SafeCallback, Ownable {
    using Pool for Pool.State;
    // using JITLib for Pool.State;
    using StateLibrary for IPoolManager;

    using AaveConfig for IPool;

    IPool internal immutable aavePool;

    /// @notice Mapping from PoolId => tickLower => tickUpper => LiquidityRange
    mapping(PoolId => mapping(int24 => LiquidityRange)) public liquidityRanges;

    /// @notice Stores the state of each Uniswap v4 pool
    mapping(PoolId id => Pool.State) internal _pools;

    /// @notice Stores information about positions
    mapping(PoolId => mapping(bytes32 => PositionInfo)) public positionInfo;

    /// @notice Mapping from PoolId => tickSpacing for that pool
    mapping(PoolId => int24) internal poolSpacing;

    constructor(
        address poolManager,
        address _aavePool
    ) Ownable(msg.sender) SafeCallback(IPoolManager(poolManager)) {
        aavePool = IPool(_aavePool);
    }

    function _unlockCallback(
        bytes calldata data
    ) internal override returns (bytes memory) {}
}
