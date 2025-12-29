const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying TxHashStore to LOCAL Hardhat Network...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("TxHashStore");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("📌 TxHashStore deployed at:", address);

  // Save address to a JSON file for backend usage
  const config = {
    TxHashStore: address,
    network: "localhost",
    deployedAt: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, "..", "deployed-local.json");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

  console.log("📝 Saved deployed address to:", filePath);
  console.log("👉 Set this in your .env.local:");
  console.log(`TX_HASH_STORE_ADDRESS=${address}`);
  console.log(`LOCAL_RPC_URL=http://127.0.0.1:8545`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Deploy-local Failed:", err);
    process.exit(1);
  });
