// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockPair {

    address public token0;
    address public token1;

    uint112 public reserve0;
    uint112 public reserve1;

    constructor(address _usdc) {
        token0 = _usdc;
        token1 = address(0x123); // fake ETH
    }

    function setReserves(uint112 _r0, uint112 _r1) external {
        reserve0 = _r0;
        reserve1 = _r1;
    }

    function getReserves() external view returns (
        uint112,
        uint112,
        uint32
    ) {
        return (reserve0, reserve1, uint32(block.timestamp));
    }
}