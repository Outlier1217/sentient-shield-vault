const hre = require("hardhat");

async function main() {

  // 1. Deploy MockUSDC
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();

  const usdcAddress = await usdc.getAddress();
  console.log("✅ USDC deployed:", usdcAddress);

  // 2. NexaID address (use zero address for now, update later with real address)
  const nexaidAddress = "0x3a21b6C601B599AB9460e689f4cBb051e5737d0e";
  
  // 3. Deploy Vault with USDC and NexaID addresses
  const Vault = await hre.ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(usdcAddress, nexaidAddress);
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("✅ Vault deployed:", vaultAddress);
  
  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("MockUSDC:", usdcAddress);
  console.log("Vault:", vaultAddress);
  console.log("NexaID:", nexaidAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n🔧 Update frontend with these addresses:");
  console.log(`const usdcAddress = "${usdcAddress}";`);
  console.log(`const vaultAddress = "${vaultAddress}";`);
  console.log(`const nexaidAddress = "${nexaidAddress}";`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});