const hre = require("hardhat");

async function main() {

  const Nexa = await hre.ethers.getContractFactory("MockNexaID");
  const nexa = await Nexa.deploy();
  await nexa.waitForDeployment();

  const address = await nexa.getAddress();
  console.log("✅ NexaID deployed:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});