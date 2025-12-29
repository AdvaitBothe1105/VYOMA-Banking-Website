const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying VyomaToken from:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("VyomaToken");
  const token = await Factory.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("VyomaToken deployed at:",  await token.getAddress());

  // Save for backend
  const configPath = path.join(__dirname, "..", "deployed-token-local.json");
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      {
        VyomaToken: address,
        network: "localhost",
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("Saved deployment info to deployed-token-local.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
