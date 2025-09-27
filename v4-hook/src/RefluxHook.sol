// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {LiquidityRangeManager} from "./LiquidityManager.sol";
import {LiquidityRange, LiquidityManagerLib} from "./LiquidityManager.sol";
import {SwapParams} from "@uniswap/v4-core/src/types/PoolOperation.sol";
import {StateLibrary} from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import "./BaseHook.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropyV2} from "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";

contract RefluxHook is BaseHook, LiquidityRangeManager, IEntropyConsumer {
    IEntropyV2 public entropy;
    uint256 public randomFactor;
    constructor(
        address _poolManager,
        address _aavePool,
        address _weth,
        IEntropyV2 _entropyAddress
    ) LiquidityRangeManager(_poolManager, _aavePool, _weth) {
        entropy = _entropyAddress;
    }

    function beforeAddLiquidity(
        address sender,
        PoolKey calldata,
        ModifyLiquidityParams calldata,
        bytes calldata
    ) external view override onlyPoolManager returns (bytes4) {
        // @dev - user are allowed to add liquidity only through this hook
        require(sender == address(this), "Error: Add liquidity from hook");
        return (this.beforeAddLiquidity.selector);
    }

    function beforeSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata params,
        bytes calldata
    )
        external
        override
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        _rebalanceLiquidity(key, params.zeroForOne, true);
        return (
            this.beforeSwap.selector,
            toBeforeSwapDelta(0, 0),
            _swapFee(key)
        );
    }

    function afterSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata params,
        BalanceDelta,
        bytes calldata
    ) external override onlyPoolManager returns (bytes4, int128) {
        (, int24 tick, , ) = StateLibrary.getSlot0(poolManager, key.toId());
        (, LiquidityRange memory next) = LiquidityManagerLib.getLiquidityRanges(
            _getPool(key.toId()),
            key.tickSpacing,
            params.zeroForOne
        );

        if (params.zeroForOne) {
            require(next.tickLower < tick, "Slippage");
        } else {
            require(next.tickUpper > tick, "Slippage");
        }

        _rebalanceLiquidity(key, params.zeroForOne, false);

        return (this.afterSwap.selector, 0);
    }

    /**
     * @notice Returns the swap fee for a given pool
     * @dev Virtual function that can be overridden for dynamic fee logic
     * @param key The pool key
     * @return The swap fee for the pool
     */
    function _swapFee(PoolKey memory key) internal virtual returns (uint24) {
        uint32 customGasLimit = 6500000;
        uint256 pythFee = entropy.getFeeV2(customGasLimit);
        require(msg.value >= pythFee, "Insufficient fee");
        uint64 sequenceNumber = entropy.requestV2{value: pythFee}(
            customGasLimit
        );
        uint24 baseFee = key.fee;
        uint24 randomizedComponent = uint24(randomFactor % 100);
        return baseFee;
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomNumber
    ) internal override {
        randomFactor = uint256(randomNumber);
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
}
