const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("---");

  // 1. Deploy VyomaToken (ERC-20)
  const TokenFactory = await hre.ethers.getContractFactory("VyomaToken");
  const token = await TokenFactory.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("VyomaToken deployed at:", tokenAddress);

  fs.writeFileSync(
    path.join(__dirname, "..", "deployed-token-local.json"),
    JSON.stringify(
      {
        VyomaToken: tokenAddress,
        network: "localhost",
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  // 2. Deploy KYCRegistry
  const KYCFactory = await hre.ethers.getContractFactory("KYCRegistry");
  const kyc = await KYCFactory.deploy(deployer.address);
  await kyc.waitForDeployment();
  const kycAddress = await kyc.getAddress();
  console.log("KYCRegistry deployed at:", kycAddress);

  // 3. Deploy LoanApprovalRegistry
  const LoanFactory = await hre.ethers.getContractFactory("LoanApprovalRegistry");
  const loan = await LoanFactory.deploy(deployer.address);
  await loan.waitForDeployment();
  const loanAddress = await loan.getAddress();
  console.log("LoanApprovalRegistry deployed at:", loanAddress);

  // 4. Deploy TxHashStore
  const TxFactory = await hre.ethers.getContractFactory("TxHashStore");
  const txStore = await TxFactory.deploy();
  await txStore.waitForDeployment();
  const txStoreAddress = await txStore.getAddress();
  console.log("TxHashStore deployed at:", txStoreAddress);

  fs.writeFileSync(
    path.join(__dirname, "..", "deployed-local.json"),
    JSON.stringify(
      {
        TxHashStore: txStoreAddress,
        network: "localhost",
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("---");
  console.log("All contracts deployed. Set these in your .env:");
  console.log(`  VYO_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`  TX_HASH_STORE_ADDRESS=${txStoreAddress}`);
  console.log(`  KYC_REGISTRY_ADDRESS=${kycAddress}`);
  console.log(`  LOAN_APPROVAL_REGISTRY_ADDRESS=${loanAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Deploy failed:", err);
    process.exit(1);
  });
