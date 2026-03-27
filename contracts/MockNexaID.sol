// contracts/MockNexaID.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockNexaID {

    address public owner;

    mapping(address => bool) public verified;
    mapping(address => uint) public score;

    // Events
    event UserVerified(address indexed user, uint score);
    event UserSetByOwner(address indexed user, bool verified, uint score);

    constructor() {
        owner = msg.sender;
    }

    // ✅ Owner can set any user
    function setUser(address user, bool _verified, uint _score) external {
        require(msg.sender == owner, "Not owner");
        verified[user] = _verified;
        score[user] = _score;
        emit UserSetByOwner(user, _verified, _score);
    }

    // ✅ NEW: Allow users to self-verify (for demo)
    function selfVerify(uint _score) external {
        require(_score >= 100 && _score <= 1000, "Score must be between 100 and 1000");
        require(!verified[msg.sender], "User already verified");
        
        verified[msg.sender] = true;
        score[msg.sender] = _score;
        
        emit UserVerified(msg.sender, _score);
    }

    // ✅ Update self-verify with default score (750)
    function verifyMe() external {
        require(!verified[msg.sender], "User already verified");
        
        verified[msg.sender] = true;
        score[msg.sender] = 750;
        
        emit UserVerified(msg.sender, 750);
    }

    // ✅ Check verification status
    function verify(address user) external view returns (bool) {
        return verified[user];
    }

    // ✅ Get user's reputation score
    function getScore(address user) external view returns (uint) {
        return score[user];
    }

    // ✅ Check if user is verified and get score in one call
    function getUserStatus(address user) external view returns (bool, uint) {
        return (verified[user], score[user]);
    }

    // ✅ Admin: Reset user verification (emergency only)
    function resetUser(address user) external {
        require(msg.sender == owner, "Not owner");
        verified[user] = false;
        score[user] = 0;
    }

    // ✅ Get owner address
    function getOwner() external view returns (address) {
        return owner;
    }
}