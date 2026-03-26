# 🔥 Sentient Shield Vault (SSV)

> **Self-Operating DeFi Engine | AI + DeFi + Identity on HashKey Chain**

---

## 🚀 Overview

**Sentient Shield Vault (SSV)** is an advanced DeFi protocol that combines:

* 🧠 **AI-driven allocation**
* 🔐 **Identity-based access (NexaID)**
* 🎮 **Gamified rewards system**
* 🛡️ **Pre-transaction security (ShieldBot)**

Unlike traditional DeFi vaults, SSV introduces a **trust-aware, intelligent, and self-operating financial system**.

---

## ❗ Problem

Traditional DeFi systems suffer from:

* ❌ No identity → Sybil attacks, bots, abuse
* ❌ Static yield strategies → Inefficient capital allocation
* ❌ No user engagement → Low retention
* ❌ No risk filtering → Unsafe transactions
* ❌ No incentives for active participation

---

## 💡 Solution

SSV solves these issues by integrating:

### 🔐 Identity Layer (NexaID)

* Only verified users can interact
* Reputation score-based benefits

### 🧠 AI Strategy Engine

* Dynamic allocation based on market signal
* Bull / Neutral / Bear regimes

### 🎮 Gamification

* XP & Level system
* Reward multipliers

### 🛡️ ShieldBot Security

* Pre-transaction risk analysis
* Blocks unsafe actions

---

## 🏗️ Architecture

### 📦 Smart Contracts

* **Vault.sol** → Core DeFi engine 
* **MockUSDC.sol** → Test token
* **MockNexaID.sol** → Identity + reputation system

---

## ⚙️ Core Features

### 💰 Deposit & Withdraw

* Only verified users allowed
* Funds allocated dynamically

### 🌾 Yield Farming

* Owner generates yield
* Distributed proportionally

### 🎁 Harvest & Claim

* Rewards based on:

  * deposit share
  * level bonus
  * reputation bonus

### 🔄 Rebalance (Keeperless)

* Anyone can rebalance
* Earn bounty

### 🎮 Gamification System

| Action    | XP  |
| --------- | --- |
| Deposit   | +10 |
| Harvest   | +25 |
| Claim     | +15 |
| Rebalance | +20 |
| Withdraw  | +5  |

---

## 🧠 Strategy Logic

### Signal-Based Allocation

| Market    | AlphaVault | StableCore | RiskGuard |
| --------- | ---------- | ---------- | --------- |
| Bull (75) | 60%        | 25%        | 15%       |
| Neutral   | 50%        | 30%        | 20%       |
| Bear      | 30%        | 30%        | 40%       |

---

## 🔐 NexaID (Identity System)

* Users must verify before interacting
* Score determines rewards:

| Score | Bonus |
| ----- | ----- |
| >800  | +20%  |
| >500  | +10%  |

---

## 🎮 Gamification

* XP increases with actions
* Levels unlock higher rewards

Example:

* Level 1 → +5%
* Level 5 → +25%
* Max → +50%

---

## 🛡️ Security Layer

### ShieldBot (Frontend)

* Risk scoring before transactions
* Blocks high-risk actions

---

## 🌐 Deployed Contracts (HashKey Testnet)

| Contract    | Address                                      |
| ----------- | -------------------------------------------- |
| 💰 MockUSDC | `0x84b6a3e3a7ffE62D339524d7C678c252aBD2d4b0` |
| 🏦 Vault    | `0x78c37Dcb5C3C072DAfb9D4e28638BBcdf297FeeB` |
| 🔐 NexaID   | `0x3a21b6C601B599AB9460e689f4cBb051e5737d0e` |

### 👤 Owner Wallet

```
0xAb06a17af1425F499E302B639c69f8ce29a967E0
```

---

## 🖥️ Frontend

* Built with **React + Vite + Ethers.js**
* Real-time blockchain interaction 
* Includes:

  * Wallet connect
  * NexaID verification
  * Deposit / Withdraw
  * Yield generation
  * XP tracking
  * ShieldBot modal

---

## 📊 Strategy Page

Detailed technical documentation available in UI


---

## ⚙️ Tech Stack

### Smart Contracts

* Solidity ^0.8.24
* Hardhat

### Frontend

* React (Vite)
* Ethers.js

### Blockchain

* HashKey Chain Testnet

---

## 🛠️ Setup & Run

### 1️⃣ Clone repo

```bash
git clone <your-repo>
cd defi-vault
```

---

### 2️⃣ Install dependencies

```bash
npm install
cd frontend
npm install
```

---

### 3️⃣ Setup `.env`

```env
PRIVATE_KEY=your_private_key
RPC_URL=https://testnet.hsk.xyz
```

---

### 4️⃣ Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network hashkey
```

Deploy NexaID separately:

```bash
npx hardhat run scripts/deployNexa.js --network hashkey
```

---

### 5️⃣ Run Frontend

```bash
cd frontend
npm run dev
```

---

## 🧪 Demo Flow

1. Connect wallet
2. Verify with NexaID
3. Mint USDC
4. Approve Vault
5. Deposit
6. Generate Yield
7. Harvest rewards
8. Claim rewards
9. Rebalance for bounty

---

## 🔥 Innovation

* Identity + DeFi fusion
* Gamified yield farming
* Keeperless incentives
* AI-driven allocation
* Security-first UX

---

## 🚀 Future Roadmap

* Chainlink / Pyth integration
* Real AI signal engine
* ZK identity (production NexaID)
* DAO governance
* NFT-based reputation

---

## 👨‍💻 Author

**Mustak Aalam**

* Web3 Developer
* AI + DeFi Builder
* Hackathon Enthusiast

---

## 🏁 Conclusion

Sentient Shield Vault is not just a vault —
it is a **next-generation DeFi system** combining:

> **AI + Identity + Incentives + Security**

---

🔥 Built for HashKey Chain Horizon Hackathon
