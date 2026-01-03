const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const KYCRegistry = await hre.ethers.getContractFactory("KYCRegistry");
  const kycRegistry = await KYCRegistry.deploy(deployer.address);

  await kycRegistry.waitForDeployment();

  console.log(
    "KYCRegistry deployed to:",
    await kycRegistry.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
