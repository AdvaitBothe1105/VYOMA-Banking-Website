import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL!);

const bankWallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);

export async function fundUserForGas(
  userAddress: string,
  ethAmount = "0.01"
) {
  console.log("[gasfunding] Starting gas funding", {
    userAddress,
    ethAmount,
    rpcUrl: process.env.LOCAL_RPC_URL,
  });

  const tx = await bankWallet.sendTransaction({
    to: userAddress,
    value: ethers.parseEther(ethAmount),
  });

  console.log("[gasfunding] Sent gas funding tx", {
    hash: tx.hash,
  });

  const receipt = await tx.wait();

  if (receipt) {
    console.log("[gasfunding] Gas funding confirmed", {
      blockNumber: receipt.blockNumber,
      status: receipt.status,
    });
  } else {
    console.warn("[gasfunding] Gas funding tx.wait() returned null receipt", {
      hash: tx.hash,
    });
  }
}
    