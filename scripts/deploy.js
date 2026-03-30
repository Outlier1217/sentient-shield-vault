const { ethers } = require("hardhat");

async function main() {

  const [deployer, user1] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1️⃣ Deploy MockUSDC
  const USDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await USDC.deploy();
  await usdc.waitForDeployment();
  console.log("USDC:", await usdc.getAddress());

  // 2️⃣ Deploy MockNexaID
  const NexaID = await ethers.getContractFactory("MockNexaID");
  const nexa = await NexaID.deploy();
  await nexa.waitForDeployment();
  console.log("NexaID:", await nexa.getAddress());

  // 3️⃣ Deploy MockPair
  const PairMock = await ethers.getContractFactory("MockPair");
  const pair = await PairMock.deploy(await usdc.getAddress());
  await pair.waitForDeployment();
  console.log("Pair:", await pair.getAddress());

  // ⚠️ FIX: Reserves set karna zaroori hai warna getPrice() revert karega
  // ETH price ~$2500 simulate kar rahe hain
  // reserve0 = USDC (6 decimals) = 2500_000000
  // reserve1 = ETH  (18 decimals) = 1_000000000000000000
  await pair.setReserves(
    2500_000_000n,                  // 2500 USDC
    1_000_000_000_000_000_000n      // 1 ETH
  );
  console.log("Pair reserves set: 2500 USDC / 1 ETH ✅");

  // 4️⃣ Deploy Vault
  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(
    await usdc.getAddress(),
    await nexa.getAddress(),
    await pair.getAddress()
  );
  await vault.waitForDeployment();
  console.log("Vault:", await vault.getAddress());

  // 5️⃣ Mint USDC to deployer aur user1
  await usdc.mint(deployer.address, ethers.parseUnits("10000", 6));
  await usdc.mint(user1.address, ethers.parseUnits("10000", 6));
  console.log("Minted 10,000 USDC to deployer and user1 ✅");

  // 6️⃣ NexaID verify karo
  await nexa.connect(user1).verifyMe();         // user1 self-verify (score 750)
  await nexa.setUser(deployer.address, true, 850); // deployer owner se verify
  console.log("NexaID verification done ✅");

  console.log("\n========== DEPLOYMENT SUMMARY ==========");
  console.log("USDC    :", await usdc.getAddress());
  console.log("NexaID  :", await nexa.getAddress());
  console.log("Pair    :", await pair.getAddress());
  console.log("Vault   :", await vault.getAddress());
  console.log("=========================================");
  console.log("Setup done ✅");
}

main().catch(console.error);