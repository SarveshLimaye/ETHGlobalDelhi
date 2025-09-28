# RefluxHook

> **A Uniswap v4 hook integrated with Aave, enabling capital-efficient liquidity provision via Just-In-Time (JIT) liquidity, dual yield, and leveraged borrowing.**

---

## 🚀 Project Overview

**RefluxHook** is a **Uniswap v4 hook** that transforms liquidity provision by integrating with the **Aave lending protocol**. Instead of leaving idle liquidity unutilized inside the Uniswap pool manager, RefluxHook deposits all user-provided capital into Aave where it earns lending yield.

When swaps occur, the hook automatically provides **Just-In-Time (JIT) liquidity** to Uniswap, captures trading fees, and then returns excess liquidity back to Aave. Liquidity Providers (LPs) not only earn **dual yield streams** — Uniswap fees + Aave interest — but can also use their liquidity positions as **leveraged collateral** to borrow more funds within a single transaction via **flash accounting**.

This design ensures **every unit of liquidity is always productive**.

---

## ✨ Key Features

* **Aave Integration**: All idle liquidity is deposited into Aave to continuously earn yield.
* **JIT Liquidity**: Provides liquidity *just before* swaps and removes it immediately afterward.
* **Dual Yield Streams**: LPs earn Uniswap trading fees + Aave lending interest.
* **Leverage & Borrowing**: Positions can be used as collateral for borrowing, enabling leveraged LP strategies.
* **Flash Accounting**: Lending, borrowing, and JIT swaps are executed atomically in one transaction.
* **Verifiable Randomness**: Integrates **Pyth Entropy** to generate collision-resistant salts for `modifyLiquidity()`, ensuring unique and secure `positionIds`.
* **Capital Efficiency**: Liquidity is never idle — always earning yield or facilitating swaps.
* **Slippage Protection**: Built-in checks ensure JIT liquidity is safe and profitable.

---

## 🏗 Architecture

![WhatsApp Image 2025-09-28 at 7 51 30 AM](https://github.com/user-attachments/assets/22bb5e71-7157-430d-a66a-f097ea324189)


---

## ⚙️ How It Works

1. **Liquidity Provision**

   * LPs provide liquidity via `updateLiquidity()`, optionally with leverage multipliers.
   * Liquidity is deposited into Aave where it earns yield.

2. **JIT Provisioning**

   * On `beforeSwap`, RefluxHook calculates the required tick ranges and provides JIT liquidity.
   * On `afterSwap`, liquidity is withdrawn, deltas are settled, and excess tokens are re-supplied to Aave.

3. **Borrowing & Leverage**

   * LPs can borrow against deposited liquidity.
   * Borrowed funds can be re-supplied to create **leveraged LP positions**.

4. **Verifiable Randomness**

   * Each `modifyLiquidity()` call requires a unique salt.
   * RefluxHook integrates **Pyth Entropy** to provide verifiable randomness, preventing predictable or colliding position IDs.

---

## 🧩 Core Components

* **RefluxHook.sol**

  * Main hook contract inheriting from BaseHook + JITPoolManager.
  * Implements `beforeSwap` and `afterSwap` for JIT liquidity lifecycle.

* **LiquidityRangeManager.sol**

  * Abstract contract managing tick windows and liquidity distribution.
  * Handles leverage multipliers, flash loan operations, and Aave integrations.

* **Aave Integration**

  * Deposits idle liquidity into Aave for yield.
  * Supports borrow/repay operations.
  * Settles deltas and re-supplies tokens post-swap.

---

## 🛠 Tech Stack

* **Solidity** — Smart contract logic.
* **Foundry** — Local + fork testing, simulations.
* **Uniswap v4** — Hooks, Pool Manager, Flash Accounting.
* **Aave V3 Protocol** — Lending, borrowing, flash loans.
* **Pyth Entropy** — Verifiable randomness for salts in liquidity updates.

---

## 🤝 Partner Integrations

* **Uniswap v4 Hooks**: *RefluxHook* is built on Uniswap v4’s flexible hook architecture.
* **Pyth Entropy**: Supplies secure randomness for salt generation in `modifyLiquidity()`, ensuring unique position IDs, preventing potential replay attacks.

---

## 🔑 Security Considerations

* **Slippage Checks**: All JIT swaps run with built-in protection against excessive slippage.
* **Randomized Salts**: Pyth entropy prevents predictable or replayable position IDs.
* **Flash Accounting**: Ensures atomic settlement of lending, borrowing, and liquidity provisioning.

---

## 🧪 Foundry Setup

**Install Foundry:**

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Build contracts:**

```bash
forge build
```

**Set up .env**

Add following RPC URL in .env - 

```bash 
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/{API_KEY}
```


**Run fork tests (Arbitrum mainnet):**
We fork the **Arbitrum mainnet** to simulate interactions.

```bash
forge test -vvv
```

This ensures RefluxHook is validated against **real-world state and liquidity conditions**.

---

## 🌐 Future Work

* Extend support to multiple yield generation strategies.
* Introduce risk-adjusted leverage strategies.
* Cross-chain deployment for multi-market liquidity optimization.
* Extra leverage multiplies for already verified users(using ZkPassport / Anonadhar)

---

📌 *RefluxHook is a step toward the next step of liquidity provision — where idle capital is eliminated, yield is maximized, and DeFi primitives work together seamlessly.*

