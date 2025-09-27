// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
import {IWETH} from "./interfaces/IWETH.sol";
import {LiquidityManagerLib} from "./lib/LiquidityManagerLib.sol";

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
    using LiquidityManagerLib for Pool.State;
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

    IWETH internal WETH;

    constructor(
        address poolManager,
        address _aavePool,
        address _weth
    ) Ownable(msg.sender) SafeCallback(IPoolManager(poolManager)) {
        aavePool = IPool(_aavePool);
        WETH = IWETH(_weth);
    }

    /// @notice Fallback to wrap ETH into WETH
    receive() external payable {
        if (msg.sender != address(WETH)) WETH.deposit{value: msg.value}();
    }

    function updateLiquidity(PoolKey memory key, ModifyLiquidityParams memory params)
        external
        payable
        onlyOwner
        returns (bytes32 positionId, BalanceDelta principalDelta, BalanceDelta feesAccrued)
    {
        uint16 multiplier = uint16(uint256(params.salt));
        int128 totalLiquidity = int128(int256(params.liquidityDelta) * int256(uint256(multiplier)));
        int24 nRanges = (params.tickUpper - params.tickLower) / key.tickSpacing;

        int24 lower = params.tickLower;

        for (int24 i = 0; i < nRanges; i++) {
            params.tickLower = lower;
            params.tickUpper = lower + key.tickSpacing;
            params.liquidityDelta = totalLiquidity;

            (BalanceDelta pd, BalanceDelta fa) = _updateLiquidity(key, params);
            principalDelta = principalDelta + pd;
            feesAccrued = feesAccrued + fa;

            lower += key.tickSpacing;
        }

        positionId = Position.calculatePositionKey(msg.sender, params.tickLower, params.tickUpper, params.salt);
        PositionInfo storage info = positionInfo[key.toId()][positionId];

        info.owner = msg.sender;
        info.tickLower = params.tickLower;
        info.tickUpper = params.tickUpper;
        info.liquidity = uint128(int128(info.liquidity) + int128(params.liquidityDelta));
        info.multiplier = multiplier;

        _resolve(key, principalDelta + feesAccrued, positionId);

        _sweep(key);
    }


     /// @notice Modify liquidity in the pool
    function _updateLiquidity(PoolKey memory key, ModifyLiquidityParams memory params)
        internal
        returns (BalanceDelta principalDelta, BalanceDelta feesAccrued)
    {
        PoolId id = key.toId();
        {
            Pool.State storage pool = _getPool(id);
            pool.checkPoolInitialized();

            (principalDelta, feesAccrued) = pool.modifyLiquidity(
                Pool.ModifyLiquidityParams({
                    owner: msg.sender,
                    tickLower: params.tickLower,
                    tickUpper: params.tickUpper,
                    liquidityDelta: int128(params.liquidityDelta),
                    tickSpacing: key.tickSpacing,
                    salt: params.salt
                })
            );
        }
    }

    function poolId(PoolKey memory key) external pure returns (PoolId) {
        return key.toId();
    }

    function supply(address asset, uint128 amount) external onlyOwner {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        aavePool.supplyToAave(asset, amount);
    }

    /// @notice Performs flash-like JIT operations
    function _resolve(PoolKey memory key, BalanceDelta deltas, bytes32 positionId) internal {
        poolManager.unlock(abi.encode(key, deltas, positionId));
    }

    /// @notice Repays debt to Aave
    function repay(address asset, uint256 amount, bool max) external onlyOwner returns (uint256) {
        return aavePool.repay(asset, amount, max);
    }

    /// @notice Repays using aTokens directly
    function repayWithATokens(address asset, uint256 amount, bool max) external onlyOwner returns (uint256) {
        return aavePool.paybackWithATokens(asset, amount, max);
    }

    /// @notice Settles JIT swap and liquidity interactions
    function _settleJIT(PoolKey memory key) internal {
        int128 d0 = int128(TransientStateLibrary.currencyDelta(poolManager, address(this), key.currency0));
        int128 d1 = int128(TransientStateLibrary.currencyDelta(poolManager, address(this), key.currency1));
        address a0 = key.currency0.isAddressZero() ? address(WETH) : Currency.unwrap(key.currency0);
        address a1 = Currency.unwrap(key.currency1);

        if (d0 > 0) poolManager.take(key.currency0, address(this), uint128(d0));
        if (d1 > 0) poolManager.take(key.currency1, address(this), uint128(d1));

        aavePool.swap(AaveSwapParams(a0, a1, toBalanceDelta(d0, d1)));

        if (d0 < 0) _settle(key.currency0, address(this), d0);
        if (d1 < 0) _settle(key.currency1, address(this), d1);
    }


    /// @notice Initializes a new pool
    /// @param key PoolKey
    /// @param sqrtPriceX96 Initial sqrt price
    /// @return tick Initial tick
    function initialize(PoolKey memory key, uint160 sqrtPriceX96) public onlyOwner returns (int24 tick) {
        uint24 lpFee = key.fee;
        PoolId id = key.toId();
        Pool.State storage pool = _getPool(id);
        tick = pool.initialize(sqrtPriceX96, lpFee);
        poolManager.initialize(key, sqrtPriceX96);
        poolSpacing[id] = key.tickSpacing;
    }



    function withdraw(address asset, uint128 amount) external onlyOwner {
        aavePool.safeWithdraw(asset, amount, msg.sender);
    }
    
    /// @notice Borrows assets from Aave pool
    function borrow(address asset, uint256 amount) external onlyOwner {
        aavePool.borrow(asset, amount);
        IERC20(asset).transfer(msg.sender, amount);
    }


     /// @notice Retrieves current Aave pool metrics
    /// @return PoolMetrics including health factor, utilization, and other position data
    function getPositionData() public view returns (PoolMetadata memory) {
        return aavePool.getPoolMetadata();
    }

    /// @notice Ensures pool slot0 is synchronized with PoolManager
    function _checkSlot0Update(PoolId id) internal view {
        Slot0 slot0 = _getPool(id).slot0;
        (uint160 pmSqrtPrice, int24 pmTick,,) = poolManager.getSlot0(id);
        require(slot0.sqrtPriceX96() == pmSqrtPrice && slot0.tick() == pmTick);
    }

    /// @notice Synchronizes pool state with PoolManager data
    function _updatePoolState(PoolId id) internal {
        Pool.State storage pool = _pools[id];
        (uint160 sqrtPrice, int24 tick,, uint24 fee) = poolManager.getSlot0(id);
        (uint256 feeGrowth0, uint256 feeGrowth1) = poolManager.getFeeGrowthGlobals(id);
        pool.slot0 = _pools[id].slot0.setSqrtPriceX96(sqrtPrice).setTick(tick).setLpFee(fee);
        pool.feeGrowthGlobal0X128 = feeGrowth0;
        pool.feeGrowthGlobal1X128 = feeGrowth1;
    }

    /// @notice Settles asset amounts with pool manager
    function _settle(Currency currency, address from, int256 amount) internal {
        uint256 _amount = uint256(-amount);

        if (currency.isAddressZero()) {
            if (address(this).balance < _amount) {
                require(WETH.balanceOf(address(this)) >= _amount);
                WETH.withdraw(_amount);
            }
            poolManager.settle{value: _amount}();
        } else {
            address token = Currency.unwrap(currency);
            poolManager.sync(currency);
            from == address(this)
                ? IERC20(token).transfer(address(poolManager), _amount)
                : IERC20(token).transferFrom(from, address(poolManager), _amount);
            poolManager.settle();
        }
    }


    /// @notice Returns pool state metrics
    function getPoolState(PoolId id)
        public
        view
        returns (Slot0 slot0, uint256 feeGrowthGlobal0X128, uint256 feeGrowthGlobal1X128, uint128 liquidity)
    {
        Pool.State storage pool = _getPool(id);
        slot0 = pool.slot0;
        liquidity = pool.liquidity;
        feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
        feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
    }


    function _borrowAndModify(
        Currency currency0,
        Currency currency1,
        address a0,
        address a1,
        int128 d0,
        int128 d1,
        int128 userD0,
        int128 userD1,
        BalanceDelta deltas,
        PositionInfo storage info
    ) internal {
        // bring liquidity in
        if (d0 < 0) poolManager.take(currency0, address(this), uint128(-d0));
        if (d1 < 0) poolManager.take(currency1, address(this), uint128(-d1));

        // deposit into Aave
        aavePool.modifyLiquidity(UpdateLiquidityAave(address(this), a0, a1, deltas));

        // settle user share
        _settle(currency0, info.owner, userD0);
        _settle(currency1, info.owner, userD1);

        // recalc post-modification deltas
        (d0, d1) = _currencyDeltas(currency0, currency1);

        // borrow if necessary
        if (d0 < 0) {
            aavePool.borrow(a0, uint128(-d0));
            _settle(currency0, address(this), d0);
        }
        if (d1 < 0) {
            aavePool.borrow(a1, uint128(-d1));
            _settle(currency1, address(this), d1);
        }

        info.debt = toBalanceDelta(d0, d1);
    }



    function _rebalanceLiquidity(PoolKey memory key, bool zeroForOne, bool add) internal {
        PoolId id = key.toId();
        Pool.State storage pool = _getPool(id);

        // Compute the active range and its liquidity
        (LiquidityRange memory active, LiquidityRange memory next) = pool.getLiquidityRanges(key.tickSpacing, zeroForOne);

        // Track active liquidity for next JIT operation
        if (add) {
            _checkSlot0Update(id);
            LiquidityManagerLib.modify(poolManager, key, active);
            LiquidityManagerLib.modify(poolManager, key, next);
        } else {
            active.liquidity = -active.liquidity;
            next.liquidity = -next.liquidity;
            LiquidityManagerLib.modify(poolManager, key, active);
            LiquidityManagerLib.modify(poolManager, key, next);
            _updatePoolState(id);
            _resolveJIT(key);
        }
    }



    /// @notice Sweeps leftover tokens back to the caller
    function _sweep(PoolKey memory key) internal {
        (address t0, address t1,,) = _get(key, toBalanceDelta(0, 0));
        uint256 b0 = IERC20(t0).balanceOf(address(this));
        if (b0 > 0) IERC20(t0).transfer(msg.sender, b0);
        uint256 b1 = IERC20(t1).balanceOf(address(this));
        if (b1 > 0) IERC20(t1).transfer(msg.sender, b1);
    }

    /// @notice Returns the currently active range for a pool
    function getActiveRange(PoolId id) external view returns (LiquidityRange memory) {
        return _getActiveRange(id);
    }

    
    function _get(PoolKey memory key, BalanceDelta deltas)
        internal
        view
        returns (address a0, address a1, int128 d0, int128 d1)
    {
        d0 = deltas.amount0();
        d1 = deltas.amount1();
        a0 = key.currency0.isAddressZero() ? address(WETH) : Currency.unwrap(key.currency0);
        a1 = Currency.unwrap(key.currency1);
    }


    function _currencyDeltas(Currency c0, Currency c1) private view returns (int128 d0, int128 d1) {
        d0 = int128(TransientStateLibrary.currencyDelta(poolManager, address(this), c0));
        d1 = int128(TransientStateLibrary.currencyDelta(poolManager, address(this), c1));
    }


    function _unlockCallback(bytes calldata data) internal override returns (bytes memory) {
        (PoolKey memory key, BalanceDelta deltas, bytes32 positionId) =
            abi.decode(data, (PoolKey, BalanceDelta, bytes32));

        PoolId id = key.toId();
        Currency c0 = key.currency0;
        Currency c1 = key.currency1;

        PositionInfo storage info = positionInfo[id][positionId];
        (address a0, address a1, int128 d0, int128 d1) = _get(key, deltas);

        int128 userD0;
        int128 userD1;
        if (info.multiplier == 1) {
            userD0 = d0;
            userD1 = d1;
        } else {
            int16 m = int16(info.multiplier);
            userD0 = d0 / m;
            userD1 = d1 / m;
        }

        if (d0 < 0 || d1 < 0) {
            _borrowAndModify(c0, c1, a0, a1, d0, d1, userD0, userD1, deltas, info);
        } else {
            _repayAndModify(c0, c1, a0, a1, d0, d1, deltas, info);
        }
        return data;
    }

     /// @notice Internal getter for pool state
    function _getPool(PoolId id) internal view returns (Pool.State storage) {
        return _pools[id];
    }


    function _getActiveRange(PoolId id) internal view returns (LiquidityRange memory) {
        Pool.State storage pool = _getPool(id);
        int24 spacing = poolSpacing[id];
        return pool.getActiveRange(spacing);
    }


    /// @notice Resolves JIT swap and liquidity interactions
    function _resolveJIT(PoolKey memory key) internal {
        int128 d0 = int128(TransientStateLibrary.currencyDelta(poolManager, address(this), key.currency0));
        int128 d1 = int128(TransientStateLibrary.currencyDelta(poolManager, address(this), key.currency1));
        address a0 = key.currency0.isAddressZero() ? address(WETH) : Currency.unwrap(key.currency0);
        address a1 = Currency.unwrap(key.currency1);

        if (d0 > 0) poolManager.take(key.currency0, address(this), uint128(d0));
        if (d1 > 0) poolManager.take(key.currency1, address(this), uint128(d1));

        aavePool.swap(AaveSwapParams(a0, a1, toBalanceDelta(d0, d1)));

        if (d0 < 0) _settle(key.currency0, address(this), d0);
        if (d1 < 0) _settle(key.currency1, address(this), d1);
    }


    function _repayAndModify(
        Currency currency0,
        Currency currency1,
        address a0,
        address a1,
        int128 d0,
        int128 d1,
        BalanceDelta deltas,
        PositionInfo storage info
    ) internal {
        if (info.multiplier > 1) {
            require(info.liquidity == 0);
        }
        // repay if there is debt
        if (info.debt.amount0() < 0) {
            poolManager.take(currency0, address(this), uint128(-info.debt.amount0()));
            aavePool.repay(a0, uint128(-info.debt.amount0()), false);
        }
        if (info.debt.amount1() < 0) {
            poolManager.take(currency1, address(this), uint128(-info.debt.amount1()));
            aavePool.repay(a1, uint128(-info.debt.amount1()), false);
        }

        // modify liquidity on behalf of owner
        aavePool.modifyLiquidity(UpdateLiquidityAave(address(this), a0, a1, deltas));

        // recalc post-modification deltas
        (d0, d1) = _currencyDeltas(currency0, currency1);

        // settle remaining if still negative
        if (d0 < 0) _settle(currency0, address(this), d0);
        if (d1 < 0) _settle(currency1, address(this), d1);

        // reset debt
        info.debt = BalanceDelta.wrap(0);
    }
}
