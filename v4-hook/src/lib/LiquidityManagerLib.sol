// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {LiquidityRange} from "../LiquidityManager.sol";
import {IPoolManager, ModifyLiquidityParams} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Pool} from "@uniswap/v4-core/src/libraries/Pool.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

library LiquidityManagerLib {
    function getLiquidityRanges(Pool.State storage state, int24 spacing, bool zeroForOne)
        internal
        view
        returns (LiquidityRange memory active, LiquidityRange memory next)
    {
        active = getActiveRange(state, spacing);

        next = zeroForOne
            ? LiquidityRange(active.tickLower - spacing, active.tickLower, 0, false)
            : LiquidityRange(active.tickUpper, active.tickUpper + spacing, 0, false);

        if (zeroForOne) {
            Pool.TickInfo storage info = state.ticks[next.tickUpper];
            next.liquidity = active.liquidity + -info.liquidityNet;
        } else {
            Pool.TickInfo storage info = state.ticks[next.tickLower];
            next.liquidity = active.liquidity + info.liquidityNet;
        }

        return (active, next);
    }

    function getActiveRange(Pool.State storage state, int24 spacing) internal view returns (LiquidityRange memory) {
        int24 currentTick = state.slot0.tick();
        int24 activeTickLower = currentTick - (currentTick % spacing);
        return LiquidityRange({
            tickLower: activeTickLower,
            tickUpper: activeTickLower + spacing,
            liquidity: int128(state.liquidity),
            initialized: true
        });
    }

    function modify(IPoolManager pm, PoolKey memory key, LiquidityRange memory w) internal {
        if (w.liquidity == 0) return;
        pm.modifyLiquidity(key, ModifyLiquidityParams(w.tickLower, w.tickUpper, w.liquidity, bytes32(0)), "");
    }
}