// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ─────────────────────────────────────────────
//  FILE 2 — VaultOracle.sol
//  Deploy order: Deploy LAST via Vault.sol
//  (This file is inherited, not deployed directly)
// ─────────────────────────────────────────────

import "./VaultBase.sol";

abstract contract VaultOracle is VaultBase {

    // ─── Keeper management ────────────────────
    function setKeeper(address _keeper, bool _status) external onlyOwner {
        require(_keeper != address(0), "Invalid keeper address");
        keepers[_keeper] = _status;
        emit KeeperUpdated(_keeper, _status);
    }

    // ─── Signal management ────────────────────
    function setSignal(uint _signal) external onlyKeeper {
        require(!useDEXSignal, "DEX signal mode is enabled");
        require(_signal <= 100, "Signal must be between 0 and 100");
        require(block.timestamp > lastUpdate + 60, "Cooldown active - wait before updating signal again");

        marketSignal = _signal;
        lastUpdate   = block.timestamp;

        emit SignalUpdated(_signal, msg.sender);
    }

    function setUseDEXSignal(bool _useDEX) external onlyOwner {
        useDEXSignal = _useDEX;
        emit DEXSignalModeUpdated(_useDEX);
    }

    function setPair(address _pair) external onlyOwner {
        require(_pair != address(0), "Invalid pair address");
        pair = _pair;
        emit PairUpdated(_pair);
    }

    function setThresholds(uint _bullish, uint _bearish) external onlyOwner {
        require(_bullish > _bearish, "Bullish must be greater than bearish");
        bullishThreshold = _bullish;
        bearishThreshold = _bearish;
        emit ThresholdsUpdated(_bullish, _bearish);
    }

    function setPriceBounds(uint _minPrice, uint _maxPrice) external onlyOwner {
        require(_minPrice > 0,         "Min price must be greater than 0");
        require(_minPrice < _maxPrice, "Min price must be less than max price");
        minValidPrice = _minPrice;
        maxValidPrice = _maxPrice;
        emit PriceBoundsUpdated(_minPrice, _maxPrice);
    }

    // ─── Price oracle ─────────────────────────
    function getPrice() public view returns (uint) {
        if (pair == address(0)) return 0;

        (uint112 reserve0, uint112 reserve1, ) = IUniswapV2Pair(pair).getReserves();
        require(reserve0 > 0 && reserve1 > 0, "Invalid reserves");

        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        uint price;
        if (token0 == address(usdc)) {
            price = (uint(reserve0) * PRICE_DECIMALS) / uint(reserve1);
        } else if (token1 == address(usdc)) {
            price = (uint(reserve1) * PRICE_DECIMALS) / uint(reserve0);
        } else {
            revert("USDC not found in pair");
        }

        require(
            price >= minValidPrice && price <= maxValidPrice,
            "Price anomaly detected - possible flash loan attack"
        );

        return price;
    }

    function getSignalFromDEX() public view returns (uint) {
        uint price;
        try this.getPrice() returns (uint _price) {
            price = _price;
        } catch {
            return marketSignal;
        }

        uint mid = (bullishThreshold + bearishThreshold) / 2;

        if (price > bullishThreshold) {
            return 80;
        } else if (price > mid) {
            return 65;
        } else if (price < bearishThreshold) {
            return 30;
        } else if (price < mid) {
            return 40;
        } else {
            return 50;
        }
    }

    // Override base virtual function
    function _signalFromDEX() internal view override returns (uint) {
        return getSignalFromDEX();
    }

    function getCurrentSignal() external view returns (uint) {
        return _getSignal();
    }

    // ─── DEX view info ────────────────────────
    function getDEXInfo() external view returns (
        uint currentPrice,
        uint currentSignal,
        uint bullishThreshold_,
        uint bearishThreshold_,
        bool usingDEX,
        uint minPrice,
        uint maxPrice
    ) {
        uint price;
        try this.getPrice() returns (uint _price) {
            price = _price;
        } catch {
            price = 0;
        }

        return (
            price,
            getSignalFromDEX(),
            bullishThreshold,
            bearishThreshold,
            useDEXSignal,
            minValidPrice,
            maxValidPrice
        );
    }
}
