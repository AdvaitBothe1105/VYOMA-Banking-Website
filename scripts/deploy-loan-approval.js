import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory("LoanApprovalRegistry");
  const contract = await Factory.deploy(deployer.address);

  await contract.waitForDeployment();

  console.log("LoanApprovalRegistry deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
