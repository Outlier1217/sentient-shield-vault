// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

// ✅ NexaID Interface for ZK Identity
interface INexaID {
    function verify(address user) external view returns (bool);
    function getScore(address user) external view returns (uint);
}

contract Vault {

    IERC20 public usdc;
    INexaID public nexaid;

    // User data
    mapping(address => uint) public balances;
    mapping(address => uint) public lastHarvest;
    mapping(address => uint) public rewards;
    
    // ✅ Gamification
    mapping(address => uint) public xp;
    mapping(address => uint) public level;
    
    // ✅ Bounty system
    mapping(address => uint) public bountiesEarned;
    
    // Vault stats
    uint public totalDeposits;
    uint public totalYield;
    
    // Allocation
    uint public alphaVault;
    uint public stableCore;
    uint public riskGuard;
    
    // Settings
    uint public harvestCooldown = 60;
    uint public performanceFee = 10;
    uint public rebalanceBounty = 5; // 0.05% of totalDeposits
    
    address public owner;
    bool public paused;
    
    // ✅ Events
    event Deposited(address indexed user, uint amount);
    event Withdrawn(address indexed user, uint amount);
    event Harvested(address indexed user, uint reward, uint bonus);
    event YieldGenerated(uint amount);
    event Rebalanced(uint signal, uint alpha, uint stable, uint risk);
    event XPEarned(address indexed user, uint amount, uint newXP);
    event LevelUp(address indexed user, uint newLevel);
    event BountyPaid(address indexed user, uint amount);
    event NexaIDVerified(address indexed user, bool verified, uint score);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Paused");
        _;
    }
    
    // ✅ Only verified users can deposit/withdraw
    modifier onlyVerified() {
        if (address(nexaid) != address(0)) {
            require(nexaid.verify(msg.sender), "NexaID: Identity not verified");
        }
        _;
    }

    constructor(address _usdc, address _nexaid) {
        usdc = IERC20(_usdc);
        if (_nexaid != address(0)) {
            nexaid = INexaID(_nexaid);
        }
        owner = msg.sender;
    }

    // ✅ Deposit with NexaID verification
    function deposit(uint amount) external notPaused onlyVerified {
        require(amount > 0, "Invalid amount");
        
        usdc.transferFrom(msg.sender, address(this), amount);
        
        balances[msg.sender] += amount;
        totalDeposits += amount;
        
        _allocate(amount);
        
        // ✅ Add XP for deposit
        _addXP(msg.sender, 10);
        
        emit Deposited(msg.sender, amount);
    }

    // ✅ Withdraw
    function withdraw(uint amount) external notPaused onlyVerified {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        uint contractBalance = usdc.balanceOf(address(this));
        require(contractBalance >= amount, "Vault liquidity low");
        
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        
        usdc.transfer(msg.sender, amount);
        
        // ✅ Add XP for withdrawal
        _addXP(msg.sender, 5);
        
        emit Withdrawn(msg.sender, amount);
    }

    // ✅ Generate yield (owner only)
    function generateYield(uint amount) external onlyOwner {
        require(usdc.balanceOf(address(this)) >= amount, "Not enough USDC");
        totalYield += amount;
        
        emit YieldGenerated(amount);
    }

    // ✅ Harvest with XP and level bonus
    function harvest() external notPaused {
        require(totalYield > 0, "No yield");
        require(block.timestamp >= lastHarvest[msg.sender] + harvestCooldown, "Cooldown");
        
        uint userShare = (balances[msg.sender] * 1e18) / totalDeposits;
        uint gross = (totalYield * userShare) / 1e18;
        require(gross > 0, "No reward");
        
        uint fee = (gross * performanceFee) / 100;
        uint netReward = gross - fee;
        
        // ✅ Apply level bonus
        uint bonusPercent = _getLevelBonus(msg.sender);
        uint bonus = (netReward * bonusPercent) / 100;
        uint finalReward = netReward + bonus;
        
        lastHarvest[msg.sender] = block.timestamp;
        
        rewards[msg.sender] += finalReward;
        rewards[owner] += fee;
        
        totalYield -= gross;
        
        // ✅ Add XP for harvesting
        _addXP(msg.sender, 25);
        
        emit Harvested(msg.sender, finalReward, bonus);
    }

    // ✅ Claim rewards
    function claim() external {
        uint reward = rewards[msg.sender];
        require(reward > 0, "No reward");
        
        uint contractBalance = usdc.balanceOf(address(this));
        require(contractBalance >= reward, "Vault liquidity low");
        
        rewards[msg.sender] = 0;
        usdc.transfer(msg.sender, reward);
        
        // ✅ Add XP for claiming
        _addXP(msg.sender, 15);
    }

    // ✅ Rebalance with bounty
    function rebalance() external notPaused {
        uint signal = _getSignal();
        
        if (signal > 70) {
            alphaVault = (totalDeposits * 60) / 100;
            stableCore = (totalDeposits * 25) / 100;
            riskGuard = (totalDeposits * 15) / 100;
        } else if (signal < 40) {
            alphaVault = (totalDeposits * 30) / 100;
            stableCore = (totalDeposits * 30) / 100;
            riskGuard = (totalDeposits * 40) / 100;
        } else {
            alphaVault = (totalDeposits * 50) / 100;
            stableCore = (totalDeposits * 30) / 100;
            riskGuard = (totalDeposits * 20) / 100;
        }
        
        // ✅ Pay bounty
        uint bounty = (totalDeposits * rebalanceBounty) / 10000;
        if (bounty > 0 && usdc.balanceOf(address(this)) >= bounty) {
            usdc.transfer(msg.sender, bounty);
            bountiesEarned[msg.sender] += bounty;
            emit BountyPaid(msg.sender, bounty);
        }
        
        // ✅ Add XP for rebalancing
        _addXP(msg.sender, 20);
        
        emit Rebalanced(signal, alphaVault, stableCore, riskGuard);
    }

    // ✅ Internal: Add XP and handle level ups
    function _addXP(address user, uint amount) internal {
        xp[user] += amount;
        uint newLevel = _calculateLevel(xp[user]);
        
        if (newLevel > level[user]) {
            level[user] = newLevel;
            emit LevelUp(user, newLevel);
        }
        
        emit XPEarned(user, amount, xp[user]);
    }
    
    // ✅ Calculate level from XP
    function _calculateLevel(uint xpAmount) internal pure returns (uint) {
        if (xpAmount < 100) return 1;
        if (xpAmount < 300) return 2;
        if (xpAmount < 600) return 3;
        if (xpAmount < 1000) return 4;
        if (xpAmount < 1500) return 5;
        return 5 + (xpAmount - 1500) / 500;
    }
    
    // ✅ Get level bonus (5% per level, max 50%)
    function _getLevelBonus(address user) internal view returns (uint) {
        uint userLevel = level[user];
        if (userLevel > 10) return 50;
        return userLevel * 5;
    }
    
    // ✅ Get reputation bonus from NexaID
    function getReputationBonus(address user) public view returns (uint) {
        if (address(nexaid) == address(0)) return 0;
        try nexaid.getScore(user) returns (uint score) {
            if (score > 800) return 20;
            if (score > 500) return 10;
        } catch {}
        return 0;
    }
    
    // ✅ Get NexaID verification status
    function isVerified(address user) public view returns (bool) {
        if (address(nexaid) == address(0)) return true;
        try nexaid.verify(user) returns (bool verified) {
            return verified;
        } catch {
            return false;
        }
    }
    
    // ✅ Allocation
    function _allocate(uint amount) internal {
        uint signal = _getSignal();
        
        if (signal > 70) {
            alphaVault += (amount * 60) / 100;
            stableCore += (amount * 25) / 100;
            riskGuard += (amount * 15) / 100;
        } else if (signal < 40) {
            alphaVault += (amount * 30) / 100;
            stableCore += (amount * 30) / 100;
            riskGuard += (amount * 40) / 100;
        } else {
            alphaVault += (amount * 50) / 100;
            stableCore += (amount * 30) / 100;
            riskGuard += (amount * 20) / 100;
        }
        
        emit Rebalanced(signal, alphaVault, stableCore, riskGuard);
    }
    
    // ✅ Signal (can be upgraded to use Chainlink)
    function _getSignal() internal pure returns (uint) {
        return 75;
    }
    
    // ✅ Get user's next level XP requirement
    function getNextLevelXP(address user) external view returns (uint) {
        uint currentLevel = level[user];
        if (currentLevel == 1) return 100;
        if (currentLevel == 2) return 300;
        if (currentLevel == 3) return 600;
        if (currentLevel == 4) return 1000;
        if (currentLevel == 5) return 1500;
        return (currentLevel - 4) * 500 + 1500;
    }
    
    // ✅ Pause system
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    // ✅ Set NexaID address (owner only)
    function setNexaID(address _nexaid) external onlyOwner {
        nexaid = INexaID(_nexaid);
    }
    
    // ✅ Set bounty percentage
    function setRebalanceBounty(uint _bounty) external onlyOwner {
        rebalanceBounty = _bounty;
    }
}