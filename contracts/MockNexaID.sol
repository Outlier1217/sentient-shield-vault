// contracts/MockNexaID.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockNexaID {

    address public owner;

    mapping(address => bool) public verified;
    mapping(address => uint) public score;

    constructor() {
        owner = msg.sender;
    }

    function setUser(address user, bool _verified, uint _score) external {
        require(msg.sender == owner, "Not owner");
        verified[user] = _verified;
        score[user] = _score;
    }

    function verify(address user) external view returns (bool) {
        return verified[user];
    }

    function getScore(address user) external view returns (uint) {
        return score[user];
    }
}