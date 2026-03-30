// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ─────────────────────────────────────────────
//  FILE 3 — Vault.sol  ← DEPLOY THIS ONE ONLY
//  Deploy order:
//    1. Deploy Vault.sol (it imports VaultOracle + VaultBase automatically)
//    2. Constructor args: (_usdc, _nexaid, _pair)
//       • _nexaid can be address(0) if not using NexaID
// ─────────────────────────────────────────────

import "./VaultOracle.sol";

contract Vault is VaultOracle {

    // ─── Structs ──────────────────────────────
    struct UserInfo {
        uint balance;
        uint reward;
        uint userXP;
        uint userLevel;
        uint lastHarvestTime;
        uint nextLevelXP;
        uint levelBonus;
        uint reputationBonus;
    }

    // ─── Constructor ──────────────────────────
    constructor(address _usdc, address _nexaid, address _pair) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_pair != address(0), "Invalid pair address");

        usdc = IERC20(_usdc);
        if (_nexaid != address(0)) {
            nexaid = INexaID(_nexaid);
        }
        pair  = _pair;
        owner = msg.sender;

        harvestCooldown  = 60;
        performanceFee   = 10;
        rebalanceBounty  = 5;
        maxLevelBonus    = 50;
        marketSignal     = 50;
        useDEXSignal     = true;

        bullishThreshold = 3000e18;
        bearishThreshold = 2000e18;

        minValidPrice = 1000e18;
        maxValidPrice = 10000e18;

        keepers[msg.sender] = true;
        locked = false;
    }

    // ─── Core vault actions ───────────────────
    function deposit(uint amount) external nonReentrant notPaused onlyVerified {
        require(amount > 0, "Invalid amount");

        uint balBefore = usdc.balanceOf(address(this));
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        uint balAfter  = usdc.balanceOf(address(this));
        require(balAfter == balBefore + amount, "Transfer amount mismatch");

        balances[msg.sender] += amount;
        totalDeposits        += amount;

        _allocate(amount);
        _addXP(msg.sender, 10);

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint amount) external nonReentrant notPaused onlyVerified {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(usdc.balanceOf(address(this)) >= amount, "Vault liquidity low");

        balances[msg.sender] -= amount;
        totalDeposits        -= amount;

        require(usdc.transfer(msg.sender, amount), "Transfer failed");

        _addXP(msg.sender, 5);

        emit Withdrawn(msg.sender, amount);
    }

    function generateYield(uint amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.balanceOf(address(this)) >= amount, "Not enough USDC");
        totalYield += amount;

        emit YieldGenerated(amount);
    }

    function harvest() external nonReentrant notPaused {
        require(totalYield > 0,    "No yield available");
        require(totalDeposits > 0, "No deposits in vault");
        require(
            block.timestamp >= lastHarvest[msg.sender] + harvestCooldown,
            "Harvest cooldown active"
        );
        require(balances[msg.sender] > 0, "No balance to harvest");

        uint userShare = (balances[msg.sender] * 1e18) / totalDeposits;
        uint gross     = (totalYield * userShare) / 1e18;
        require(gross > 0, "No reward for user");

        uint fee       = (gross * performanceFee) / 100;
        uint netReward = gross - fee;

        uint bonusPercent = _getLevelBonus(msg.sender);
        uint bonus        = (netReward * bonusPercent) / 100;
        uint finalReward  = netReward + bonus;

        uint reputationBonus = getReputationBonus(msg.sender);
        if (reputationBonus > 0) {
            finalReward += (finalReward * reputationBonus) / 100;
        }

        lastHarvest[msg.sender] = block.timestamp;

        totalYield          -= gross;
        rewards[msg.sender] += finalReward;
        rewards[owner]      += fee;

        _addXP(msg.sender, 25);

        emit Harvested(msg.sender, finalReward, bonus);
    }

    function claim() external nonReentrant notPaused {
        uint reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        require(usdc.balanceOf(address(this)) >= reward, "Insufficient vault liquidity");

        rewards[msg.sender] = 0;
        require(usdc.transfer(msg.sender, reward), "Transfer failed");

        _addXP(msg.sender, 15);
    }

    function rebalance() external nonReentrant notPaused {
        uint signal = _getSignal();

        uint newAlpha;
        uint newStable;
        uint newRisk;

        if (signal > 70) {
            newAlpha  = (totalDeposits * 60) / 100;
            newStable = (totalDeposits * 25) / 100;
            newRisk   = (totalDeposits * 15) / 100;
        } else if (signal < 40) {
            newAlpha  = (totalDeposits * 30) / 100;
            newStable = (totalDeposits * 30) / 100;
            newRisk   = (totalDeposits * 40) / 100;
        } else {
            newAlpha  = (totalDeposits * 50) / 100;
            newStable = (totalDeposits * 30) / 100;
            newRisk   = (totalDeposits * 20) / 100;
        }

        alphaVault = newAlpha;
        stableCore = newStable;
        riskGuard  = newRisk;

        uint bounty = (totalDeposits * rebalanceBounty) / 10000;
        if (bounty > 0 && usdc.balanceOf(address(this)) >= bounty) {
            bountiesEarned[msg.sender] += bounty;
            require(usdc.transfer(msg.sender, bounty), "Bounty transfer failed");
            emit BountyPaid(msg.sender, bounty);
        }

        _addXP(msg.sender, 20);

        emit Rebalanced(signal, alphaVault, stableCore, riskGuard);
    }

    // ─── NexaID helpers ───────────────────────
    function getReputationBonus(address user) public view returns (uint) {
        if (address(nexaid) == address(0)) return 0;
        try nexaid.getScore(user) returns (uint score) {
            if (score > 800) return 20;
            if (score > 500) return 10;
            if (score > 300) return 5;
        } catch {}
        return 0;
    }

    function isVerified(address user) public view returns (bool) {
        if (address(nexaid) == address(0)) return true;
        try nexaid.verify(user) returns (bool verified) {
            return verified;
        } catch {
            return false;
        }
    }

    // ─── Level / XP view helpers ──────────────
    function getNextLevelXP(address user) public view returns (uint) {
        uint lvl = level[user];
        if (lvl == 0) return 100;
        if (lvl == 1) return 100;
        if (lvl == 2) return 300;
        if (lvl == 3) return 600;
        if (lvl == 4) return 1000;
        if (lvl == 5) return 1500;
        return (lvl - 4) * 500 + 1500;
    }

    function getLevelBonus(address user) external view returns (uint) {
        return _getLevelBonus(user);
    }

    // ─── Admin config ─────────────────────────
    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function setNexaID(address _nexaid) external onlyOwner {
        require(_nexaid != address(0), "Invalid address");
        nexaid = INexaID(_nexaid);
    }

    function setHarvestCooldown(uint _cooldown) external onlyOwner {
        harvestCooldown = _cooldown;
        emit CooldownUpdated(_cooldown);
    }

    function setPerformanceFee(uint _fee) external onlyOwner {
        require(_fee <= 50, "Fee cannot exceed 50%");
        performanceFee = _fee;
        emit FeeUpdated(_fee);
    }

    function setRebalanceBounty(uint _bounty) external onlyOwner {
        require(_bounty <= 100, "Bounty cannot exceed 1%");
        rebalanceBounty = _bounty;
        emit BountyPercentUpdated(_bounty);
    }

    function setMaxLevelBonus(uint _maxBonus) external onlyOwner {
        require(_maxBonus <= 100, "Max bonus cannot exceed 100%");
        maxLevelBonus = _maxBonus;
        emit MaxLevelBonusUpdated(_maxBonus);
    }

    function emergencyWithdraw(address token, uint amount) external onlyOwner {
        if (token == address(0)) {
            (bool ok, ) = payable(owner).call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            require(IERC20(token).transfer(owner, amount), "Token transfer failed");
        }
    }

    // ─── View functions ───────────────────────
    function getVaultInfo() external view returns (
        uint totalDeposits_,
        uint totalYield_,
        uint alphaVault_,
        uint stableCore_,
        uint riskGuard_,
        uint currentSignal
    ) {
        return (totalDeposits, totalYield, alphaVault, stableCore, riskGuard, _getSignal());
    }

    function getUserBasicInfo(address user) external view returns (
        uint balance,
        uint reward,
        uint userXP,
        uint userLevel,
        uint lastHarvestTime
    ) {
        return (
            balances[user],
            rewards[user],
            xp[user],
            level[user],
            lastHarvest[user]
        );
    }

    function getUserBonusInfo(address user) external view returns (
        uint nextLevelXP,
        uint levelBonus,
        uint reputationBonus
    ) {
        return (
            getNextLevelXP(user),
            _getLevelBonus(user),
            getReputationBonus(user)
        );
    }

    function getUserInfo(address user) external view returns (UserInfo memory) {
        return UserInfo({
            balance:         balances[user],
            reward:          rewards[user],
            userXP:          xp[user],
            userLevel:       level[user],
            lastHarvestTime: lastHarvest[user],
            nextLevelXP:     getNextLevelXP(user),
            levelBonus:      _getLevelBonus(user),
            reputationBonus: getReputationBonus(user)
        });
    }
}
