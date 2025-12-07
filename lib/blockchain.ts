// lib/blockchain.ts
import { ethers } from "ethers";

const abi = ["function record(bytes32 hash) external"];

let cached: { contract: ethers.Contract } | null = null;

function getConfig() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  const contractAddress = process.env.TX_HASH_STORE_ADDRESS;
  return { rpcUrl, privateKey, contractAddress };
}

export function isBlockchainConfigured(): boolean {
  const { rpcUrl, privateKey, contractAddress } = getConfig();
  return !!(rpcUrl && privateKey && contractAddress);
}

function getContract() {
  if (cached) return cached.contract;
  const { rpcUrl, privateKey, contractAddress } = getConfig();
  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error("Missing blockchain env vars");
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  cached = { contract };
  return contract;
}

export async function recordHashOnChain(hashBytes32: `0x${string}`) {
  const contract = getContract();
  const tx = await contract.record(hashBytes32);
  return await tx.wait();
}

export function toBytes32Hash(input: string): `0x${string}` {
  return ethers.keccak256(ethers.toUtf8Bytes(input)) as `0x${string}`;
}
console.log("ENV present:", {
  hasRpc: !!process.env.SEPOLIA_RPC_URL,
  hasKey: !!process.env.WALLET_PRIVATE_KEY,
  hasAddr: !!process.env.TX_HASH_STORE_ADDRESS,
});