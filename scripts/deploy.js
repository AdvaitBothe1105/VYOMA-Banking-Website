async function main() {
  const Factory = await hre.ethers.getContractFactory("TxHashStore");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  console.log("TxHashStore deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
