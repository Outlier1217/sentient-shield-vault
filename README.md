# 🔥 Sentient Shield Vault (SSV)

> **Self-Operating DeFi Engine — AI · Identity · Gamification · Security · Telegram**
>
> Built for the **HashKey Chain Horizon Hackathon**

---

## 🚀 Overview

**Sentient Shield Vault (SSV)** is an on-chain DeFi protocol that goes far beyond a standard yield vault. It combines AI-driven capital allocation, identity-based access control, gamified rewards, pre-transaction risk analysis, and a Telegram-native control layer — all fully deployed and operational on **HashKey Testnet**.

Unlike traditional vaults with static strategies and no user layer, SSV is a **trust-aware, self-operating financial system** where every action is verified, incentivized, and secured.

---

## ❗ Problem

Traditional DeFi vaults suffer from fundamental issues:

- No identity verification → Sybil attacks, bot abuse, and reward farming
- Static allocation strategies → Inefficient capital in changing market conditions
- No user engagement model → Low retention, no loyalty
- No risk filtering → Users unknowingly execute unsafe transactions
- No participation incentives → Only passive depositors, no active contributors

---

## 💡 Solution

SSV addresses each problem with a dedicated module:

| Problem | SSV Module |
|---|---|
| No identity | NexaID — on-chain verification + reputation scoring |
| Static strategy | Signal-based allocation engine (DEX oracle or keeper-set) |
| No engagement | XP & Level system with reward multipliers |
| No risk filter | ShieldBot — pre-transaction risk scoring (frontend) |
| No incentives | Rebalance bounty, harvest bonuses, level-up rewards |

---

## 🏗️ Architecture

```
User → Frontend (React + Ethers.js)
         ↓
  NexaID Verification Gate
         ↓
  Vault.sol ← VaultOracle.sol ← VaultBase.sol
         ↓
  MockUSDC.sol   MockNexaID.sol   MockPair.sol
         ↓
  HashKey Chain Testnet
```

```
User → Telegram Bot (@ssv_defi_bot)
         ↓
  Node.js Backend (Grammy + Ethers.js)
         ↓
  Smart Contracts (read-only queries + alerts)
```

---

## 📦 Smart Contracts

### Contract Inheritance

```
VaultBase.sol        (storage, events, modifiers, XP logic)
    └── VaultOracle.sol    (DEX price oracle, signal engine, keeper management)
            └── Vault.sol        (core DeFi: deposit, withdraw, harvest, claim, rebalance)
```

> **Deploy only `Vault.sol`** — it inherits everything automatically.

### Constructor Arguments

```solidity
constructor(address _usdc, address _nexaid, address _pair)
```

| Argument | Description |
|---|---|
| `_usdc` | USDC token address (required) |
| `_nexaid` | NexaID contract address (`address(0)` to skip identity checks) |
| `_pair` | Uniswap V2-compatible pair address for DEX price oracle |

---

## 🌐 Deployed Contracts — HashKey Testnet

| Contract | Address |
|---|---|
| 💰 MockUSDC | `0xfD36e42d57DdEF313457FFf750fEd831958E5cd2` |
| 🔐 MockNexaID | `0x83660B2dc4C917558CAc56b24EeF98A1524D0bAE` |
| 🔗 MockPair | `0xB6Ab09336698DE498966bD5b522adD93C7CB78da` |
| 🏦 Vault | `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4` |

**Owner Wallet:** `0xAb06a17af1425F499E302B639c69f8ce29a967E0`

**Network:** HashKey Testnet — Chain ID `133` — RPC: `https://testnet.hsk.xyz`

---

## ⚙️ Core Features

### 💰 Deposit & Withdraw

- Only NexaID-verified users can interact (when NexaID is set)
- Funds are dynamically allocated across three sub-strategies on deposit
- Reentrancy-protected with `nonReentrant` modifier

### 🌾 Yield Generation & Harvest

- Owner calls `generateYield()` to inject yield into the vault
- Users call `harvest()` to accrue their proportional share
- Rewards are boosted by:
  - **Level Bonus** — up to +50% based on XP level
  - **Reputation Bonus** — up to +20% based on NexaID score
- 60-second harvest cooldown enforced on-chain

### 🎁 Claim

- Users call `claim()` to withdraw accrued rewards to their wallet
- Vault liquidity is checked before transfer

### 🔄 Rebalance (Keeperless)

- Anyone can call `rebalance()` and earn a bounty (0.05% of total deposits)
- Allocation is adjusted based on the current market signal
- Fully on-chain — no keeper bots required

---

## 🧠 Strategy Engine

Capital is allocated across three internal buckets based on a market signal (0–100):

| Signal | AlphaVault | StableCore | RiskGuard |
|---|---|---|---|
| Bullish > 70 | 60% | 25% | 15% |
| Neutral 40–70 | 50% | 30% | 20% |
| Bearish < 40 | 30% | 30% | 40% |

### Signal Sources

**DEX Mode (default — `useDEXSignal = true`):**

The signal is derived live from the Uniswap V2-compatible pair:

| Price Range | Signal |
|---|---|
| > `bullishThreshold` (3000 USDC) | 80 |
| Between mid and bullish | 65 |
| < `bearishThreshold` (2000 USDC) | 30 |
| Between bearish and mid | 40 |
| At midpoint | 50 |

Flash loan protection is built in — prices outside `[minValidPrice, maxValidPrice]` revert with `"Price anomaly detected"`.

**Manual Mode (`useDEXSignal = false`):**

Keepers call `setSignal()` with a 60-second update cooldown.

---

## 🔐 NexaID — Identity Layer

`MockNexaID.sol` provides on-chain identity and reputation scoring.

| Function | Description |
|---|---|
| `verifyMe()` | Self-verify with default score of 750 |
| `selfVerify(uint score)` | Self-verify with custom score (100–1000) |
| `setUser(address, bool, uint)` | Owner can set any user's status and score |
| `verify(address)` | Returns verification status |
| `getScore(address)` | Returns reputation score |

**Reputation Bonuses applied in `harvest()`:**

| Score | Bonus |
|---|---|
| > 800 | +20% |
| > 500 | +10% |
| > 300 | +5% |

---

## 🎮 Gamification System

Every on-chain action earns XP, which unlocks levels and reward multipliers.

### XP per Action

| Action | XP Earned |
|---|---|
| Deposit | +10 |
| Withdraw | +5 |
| Harvest | +25 |
| Claim | +15 |
| Rebalance | +20 |

### Level Thresholds

| Level | XP Required |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 4 | 600 |
| 5 | 1000 |
| 6+ | 1500 + (level - 5) × 500 |

### Level Bonus

`levelBonus = level × 5%` — capped at `maxLevelBonus` (default 50%).

---

## 🛡️ Security

### On-Chain

- `nonReentrant` guard on all state-modifying functions
- `notPaused` modifier — owner can halt the contract in emergencies
- `onlyVerified` modifier — NexaID gate on deposit and withdraw
- Flash loan protection in the price oracle (min/max price bounds)
- Performance fee capped at 50%, bounty capped at 1%
- Signal update cooldown (60s) prevents rapid manipulation

### Frontend (ShieldBot)

Before executing deposit, withdraw, or harvest, the frontend runs a mock risk-scoring check. Transactions with a risk score ≥ 70 are blocked client-side with a clear warning modal.

---

## 🤖 Telegram Bot

**@ssv_defi_bot** acts as a Web2-friendly control layer on top of the vault.

| Command | Description |
|---|---|
| `/connect` | Link your wallet address |
| `/dashboard` | View live portfolio: balance, rewards, XP, level |
| `/verify` | Check NexaID verification status and score |

**Automatic Alerts:**

- 🎁 Reward available — notifies when harvestable yield exists
- 🛡️ Risk warnings — flags unusual vault conditions
- 🔄 Rebalance opportunities — signals when rebalancing is profitable
- 🏆 Leaderboard — gamified ranking of top depositors

> 👉 [Open Bot on Telegram](https://t.me/ssv_defi_bot)

---

## 🖥️ Frontend

Built with **React + Vite + Ethers.js**.

**Pages:**

- `/` — Main vault dashboard (connect wallet, mint, approve, deposit, withdraw, harvest, claim, rebalance)
- `/strategy` — Detailed strategy documentation and signal visualization

**Key Features:**

- Wallet connection via MetaMask
- NexaID verification flow (auto-prompts if unverified)
- Real-time balance refresh every 5 seconds
- Gamification profile card (XP bar, level, bonuses)
- ShieldBot modal for risky transactions
- Owner-only `generateYield()` button
- Fully responsive layout

---

## 📊 Admin Functions (Owner Only)

| Function | Description |
|---|---|
| `pause()` / `unpause()` | Emergency halt |
| `setNexaID(address)` | Update identity contract |
| `setHarvestCooldown(uint)` | Change harvest cooldown (seconds) |
| `setPerformanceFee(uint)` | Set fee (max 50%) |
| `setRebalanceBounty(uint)` | Set bounty (max 1% = 100 basis points) |
| `setMaxLevelBonus(uint)` | Cap on level bonus (max 100%) |
| `setUseDEXSignal(bool)` | Toggle DEX vs manual signal |
| `setThresholds(uint, uint)` | Set bullish/bearish price thresholds |
| `setPriceBounds(uint, uint)` | Set flash loan protection bounds |
| `setPair(address)` | Update DEX pair address |
| `setKeeper(address, bool)` | Manage keeper whitelist |
| `emergencyWithdraw(address, uint)` | Recover tokens or ETH |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity ^0.8.24, Hardhat |
| Frontend | React (Vite), Ethers.js v6 |
| Telegram Bot | Node.js, Grammy, Ethers.js |
| Blockchain | HashKey Chain Testnet |
| Identity | MockNexaID (on-chain) |
| Oracle | Uniswap V2-compatible MockPair |

---

## 🛠️ Setup & Run

### 1. Clone Repository

```bash
git clone https://github.com/Outlier1217/sentient-shield-vault
cd sentient-shield-vault
```

### 2. Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 3. Configure Environment

Create a `.env` file in the root:

```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://testnet.hsk.xyz
```

### 4. Compile Contracts

```bash
npx hardhat compile
```

### 5. Deploy to HashKey Testnet

```bash
# Deploy MockUSDC, MockNexaID, MockPair, then Vault
npx hardhat run scripts/deploy.js --network hashkey

# Deploy NexaID separately if needed
npx hardhat run scripts/deployNexa.js --network hashkey
```

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

Update contract addresses in `frontend/src/App.jsx` if redeploying.

---

## 🧪 Demo Flow

1. Connect MetaMask wallet
2. Click **Verify with NexaID** → `verifyMe()` sets score to 750
3. **Mint USDC** → get test tokens
4. **Approve** → authorize vault to spend USDC
5. **Deposit** → funds allocated by signal engine, XP +10
6. *(Owner)* **Generate Yield** → injects yield into vault
7. **Harvest** → accrue rewards with level + reputation bonuses, XP +25
8. **Claim** → transfer rewards to wallet, XP +15
9. **Rebalance** → realign allocations, earn bounty, XP +20
10. Open **Telegram Bot** → `/connect` → `/dashboard` to view live stats

---

## 🔗 Links

| Resource | Link |
|---|---|
| 📦 GitHub | [github.com/Outlier1217/sentient-shield-vault](https://github.com/Outlier1217/sentient-shield-vault) |
| 🤖 Telegram Bot | [t.me/ssv_defi_bot](https://t.me/ssv_defi_bot) |
| 📺 Demo Video | [youtu.be/VxmpqMxuk7E](https://youtu.be/VxmpqMxuk7E) |
| 🌐 Live Prototype | [mprot.store](https://mprot.store/) |

---

## 🚀 Roadmap

- Chainlink / Pyth price feed integration (replace MockPair)
- Real AI/ML signal engine with on-chain verification
- DAO governance for fee and strategy parameters
- NFT-based reputation and level badges
- Multi-asset support beyond USDC

---

## 👨‍💻 Author

**Mustak Aalam** — Web3 Developer · AI + DeFi Builder · Hackathon Enthusiast

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

> 🔥 *Sentient Shield Vault — DeFi that doesn't wait, it acts.*
>
> *Built for HashKey Chain Horizon Hackathon*