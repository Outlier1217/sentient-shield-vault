require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,  // Contract size 25918 bytes thi, limit 24576 hai — yeh fix karta hai
        runs: 200,
      },
    },
  },
  networks: {
    // Local testing ke liye
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // HashKey testnet ke liye
    hashkey: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 133,
    },
  },
};