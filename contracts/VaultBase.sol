// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ─────────────────────────────────────────────
//  FILE 1 — VaultBase.sol
//  Deploy order: Deploy LAST via Vault.sol
//  (This file is a base contract, not deployed directly)
// ─────────────────────────────────────────────

// ─── Interfaces ───────────────────────────────
interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

interface INexaID {
    function verify(address user) external view returns (bool);
    function getScore(address user) external view returns (uint);
}

interface IUniswapV2Pair {
    function getReserves() external view returns (
        uint112 reserve0,
        uint112 reserve1,
        uint32 blockTimestampLast
    );
    function token0() external view returns (address);
    function token1() external view returns (address);
}

// ─── Base Contract ────────────────────────────
abstract contract VaultBase {

    // ─── State variables ──────────────────────
    IERC20 public usdc;
    INexaID public nexaid;

    address public pair;
    uint public constant PRICE_DECIMALS = 1e18;

    uint public minValidPrice;
    uint public maxValidPrice;

    uint public marketSignal;
    uint public lastUpdate;
    bool public useDEXSignal;

    mapping(address => uint) public balances;
    mapping(address => uint) public lastHarvest;
    mapping(address => uint) public rewards;

    mapping(address => uint) public xp;
    mapping(address => uint) public level;

    mapping(address => uint) public bountiesEarned;

    uint public totalDeposits;
    uint public totalYield;

    uint public alphaVault;
    uint public stableCore;
    uint public riskGuard;

    uint public harvestCooldown;
    uint public performanceFee;
    uint public rebalanceBounty;
    uint public maxLevelBonus;

    uint public bullishThreshold;
    uint public bearishThreshold;

    address public owner;
    bool public paused;

    bool internal locked;

    mapping(address => bool) public keepers;

    // ─── Events ───────────────────────────────
    event Deposited(address indexed user, uint amount);
    event Withdrawn(address indexed user, uint amount);
    event Harvested(address indexed user, uint reward, uint bonus);
    event YieldGenerated(uint amount);
    event Rebalanced(uint signal, uint alpha, uint stable, uint risk);
    event XPEarned(address indexed user, uint amount, uint newXP);
    event LevelUp(address indexed user, uint newLevel);
    event BountyPaid(address indexed user, uint amount);
    event NexaIDVerified(address indexed user, bool verified, uint score);
    event SignalUpdated(uint newSignal, address indexed updater);
    event CooldownUpdated(uint newCooldown);
    event FeeUpdated(uint newFee);
    event BountyPercentUpdated(uint newBounty);
    event MaxLevelBonusUpdated(uint newMaxBonus);
    event DEXSignalModeUpdated(bool useDEX);
    event ThresholdsUpdated(uint bullish, uint bearish);
    event PriceBoundsUpdated(uint minPrice, uint maxPrice);
    event PairUpdated(address newPair);
    event KeeperUpdated(address indexed keeper, bool status);
    event PriceAnomalyDetected(uint price, uint minValid, uint maxValid);

    // ─── Modifiers ────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyKeeper() {
        require(keepers[msg.sender], "Not keeper");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier onlyVerified() {
        if (address(nexaid) != address(0)) {
            require(nexaid.verify(msg.sender), "NexaID: Identity not verified");
        }
        _;
    }

    // ─── Internal: XP & Level ─────────────────
    function _addXP(address user, uint amount) internal {
        xp[user]   += amount;
        uint newLvl = _calculateLevel(xp[user]);

        if (newLvl > level[user]) {
            level[user] = newLvl;
            emit LevelUp(user, newLvl);
        }

        emit XPEarned(user, amount, xp[user]);
    }

    function _calculateLevel(uint xpAmount) internal pure returns (uint) {
        if (xpAmount < 100)  return 1;
        if (xpAmount < 300)  return 2;
        if (xpAmount < 600)  return 3;
        if (xpAmount < 1000) return 4;
        if (xpAmount < 1500) return 5;
        return 5 + (xpAmount - 1500) / 500;
    }

    function _getLevelBonus(address user) internal view returns (uint) {
        uint bonus = level[user] * 5;
        return bonus > maxLevelBonus ? maxLevelBonus : bonus;
    }

    // ─── Internal: Signal ─────────────────────
    function _getSignal() internal view returns (uint) {
        return useDEXSignal ? _signalFromDEX() : marketSignal;
    }

    // Defined here so VaultOracle can override via public getSignalFromDEX()
    function _signalFromDEX() internal view virtual returns (uint) {
        return marketSignal;
    }

    // ─── Internal: Allocation ─────────────────
    function _allocate(uint amount) internal {
        uint signal = _getSignal();

        if (signal > 70) {
            alphaVault += (amount * 60) / 100;
            stableCore += (amount * 25) / 100;
            riskGuard  += (amount * 15) / 100;
        } else if (signal < 40) {
            alphaVault += (amount * 30) / 100;
            stableCore += (amount * 30) / 100;
            riskGuard  += (amount * 40) / 100;
        } else {
            alphaVault += (amount * 50) / 100;
            stableCore += (amount * 30) / 100;
            riskGuard  += (amount * 20) / 100;
        }

        emit Rebalanced(signal, alphaVault, stableCore, riskGuard);
    }
}
