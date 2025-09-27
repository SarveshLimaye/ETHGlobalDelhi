// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "@aave/src/contracts/interfaces/IPool.sol";
import {ICreditDelegationToken} from "@aave/src/contracts/interfaces/ICreditDelegationToken.sol";
import {IAToken} from "@aave/src/contracts/interfaces/IAToken.sol";
import {IERC20} from "@openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IVariableDebtToken} from "@aave/src/contracts/interfaces/IVariableDebtToken.sol";
import {DataTypes} from "@aave/src/contracts/protocol/libraries/types/DataTypes.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";

struct UpdateLiquidityAave {
    address to;
    address asset0;
    address asset1;
    BalanceDelta delta;
}

struct PoolMetadata {
    uint256 totalCollateral;
    uint256 totalDebt;
    uint256 availableBorrows;
    uint256 currentLiquidationThreshold;
    uint256 ltv;
    uint256 healthFactor;
}

struct AssetData {
    address aTokenAddress;
    address variableDebtTokenAddress;
    uint128 liquidityIndex;
    uint128 variableBorrowIndex;
    uint128 currentLiquidityRate;
    uint128 currentVariableBorrowRate;
    uint40 lastUpdateTimestamp;
}

struct AaveSwapParams {
    address asset0;
    address asset1;
    BalanceDelta delta;
}

library AaveConfig {
    using AaveConfig for IPool;

    function supplyToAave(IPool pool, address asset, uint128 amount) internal {
        IERC20(asset).approve(address(pool), amount);
        pool.supply(asset, amount, address(this), 0);
    }

    function safeWithdraw(
        IPool pool,
        address asset,
        uint128 amount,
        address to
    ) internal {
        try pool.withdraw(asset, amount, address(this)) {
            IERC20(asset).transfer(to, amount - _handleDust(pool, asset));
        } catch {
            _handleWithdrawFallback(pool, asset, to, amount);
        }
    }

    uint256 private constant DUST = 1_000;

    function _handleDust(
        IPool pool,
        address asset
    ) private returns (uint256 repaid) {
        uint256 debt = getVariableDebtBal(pool, asset);
        if (debt < DUST && debt != 0) {
            repaid = repay(pool, asset, debt, true);
        }
    }

    function _handleWithdrawFallback(
        IPool pool,
        address asset,
        address to,
        uint256 amount
    ) private {
        uint256 debt = getVariableDebtBal(pool, asset);
        uint256 aBalance = getATokenBal(pool, asset);
        if (debt < DUST && debt != 0) {
            if (amount < aBalance) {
                amount -= paybackWithATokens(pool, asset, debt, true);
            } else {
                repay(pool, asset, debt, true);
            }
        }

        pool.withdraw(asset, amount < aBalance ? amount : aBalance, to);
    }

    function modifyLiquidity(
        IPool pool,
        UpdateLiquidityAave memory params
    ) internal {
        int128 amount0 = params.delta.amount0();
        int128 amount1 = params.delta.amount1();

        // Supplying negative amounts
        if (amount0 < 0) supplyToAave(pool, params.asset0, uint128(-amount0));
        if (amount1 < 0) supplyToAave(pool, params.asset1, uint128(-amount1));

        // Withdrawing positive amounts
        if (amount0 > 0)
            safeWithdraw(pool, params.asset0, uint128(amount0), params.to);
        if (amount1 > 0)
            safeWithdraw(pool, params.asset1, uint128(amount1), params.to);
    }

    function swap(IPool pool, AaveSwapParams memory params) internal {
        int128 amount0 = params.delta.amount0();
        int128 amount1 = params.delta.amount1();
        require(amount0 > 0 || amount1 > 0);

        if (amount0 > amount1) {
            supplyToAave(pool, params.asset0, uint128(amount0));
            safeWithdraw(pool, params.asset1, uint128(-amount1), address(this));
        } else {
            supplyToAave(pool, params.asset1, uint128(amount1));
            safeWithdraw(pool, params.asset0, uint128(-amount0), address(this));
        }
    }

    function borrow(IPool pool, address asset, uint256 amount) internal {
        pool.setUserUseReserveAsCollateral(asset, true);
        pool.borrow(asset, amount, 2, 0, address(this));
    }

    function repay(
        IPool pool,
        address asset,
        uint256 amount,
        bool max
    ) internal returns (uint256) {
        IERC20(asset).approve(address(pool), max ? DUST : amount);
        return
            pool.repay(
                asset,
                max ? type(uint256).max : amount,
                2,
                address(this)
            );
    }

    function paybackWithATokens(
        IPool pool,
        address asset,
        uint256 amount,
        bool max
    ) internal returns (uint256) {
        return
            pool.repayWithATokens(asset, max ? type(uint256).max : amount, 2);
    }

    /**
     * @dev Asset Info from Aave
     */
    function getAssetInfo(
        IPool pool,
        address asset
    ) internal view returns (AssetData memory data) {
        DataTypes.ReserveDataLegacy memory d = pool.getReserveData(asset);
        data.liquidityIndex = d.liquidityIndex;
        data.variableBorrowIndex = d.variableBorrowIndex;
        data.currentLiquidityRate = d.currentLiquidityRate;
        data.currentVariableBorrowRate = d.currentVariableBorrowRate;
        data.lastUpdateTimestamp = d.lastUpdateTimestamp;
        data.aTokenAddress = pool.getReserveAToken(asset);
        data.variableDebtTokenAddress = pool.getReserveVariableDebtToken(asset);
    }

    /**
     * @dev Pool's metadata from Aave
     */
    function getPoolMetadata(
        IPool pool
    ) internal view returns (PoolMetadata memory metrics) {
        (
            metrics.totalCollateral,
            metrics.totalDebt,
            metrics.availableBorrows,
            metrics.currentLiquidationThreshold,
            metrics.ltv,
            metrics.healthFactor
        ) = pool.getUserAccountData(address(this));
    }

    /**
     * @dev Current aToken balance for an asset
     */
    function getATokenBal(
        IPool pool,
        address asset
    ) internal view returns (uint256 balance) {
        AssetData memory data = getAssetInfo(pool, asset);
        if (data.aTokenAddress != address(0)) {
            balance = IAToken(data.aTokenAddress).balanceOf(address(this));
        }
    }

    /**
     * @dev Current variable debt balance for an asset
     */
    function getVariableDebtBal(
        IPool pool,
        address asset
    ) internal view returns (uint256 balance) {
        AssetData memory data = getAssetInfo(pool, asset);
        if (data.variableDebtTokenAddress != address(0)) {
            balance = IERC20(data.variableDebtTokenAddress).balanceOf(
                address(this)
            );
        }
    }
}
