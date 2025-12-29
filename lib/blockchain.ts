// lib/blockchain.ts
import { ethers } from "ethers";

const abi = ["function record(bytes32 hash) external"];

// Cache both provider + contract to avoid re-instantiating every call
let cachedContract: ethers.Contract | null = null;
let cachedProvider: ethers.Provider | null = null;

function getConfig() {
  // Prefer local RPC for development
  const rpcUrl =
    process.env.LOCAL_RPC_URL ||
    process.env.SEPOLIA_RPC_URL ||
    null;

  const privateKey = process.env.WALLET_PRIVATE_KEY || null;
  const contractAddress = process.env.TX_HASH_STORE_ADDRESS || null;

  return { rpcUrl, privateKey, contractAddress };
}

export function isBlockchainConfigured(): boolean {
  const { rpcUrl, privateKey, contractAddress } = getConfig();
  const ok = !!(rpcUrl && privateKey && contractAddress);

  if (!ok) {
    console.warn("[Blockchain] Missing configuration:", {
      rpcUrl: !!rpcUrl,
      privateKey: !!privateKey,
      contractAddress: !!contractAddress,
    });
  }

  return ok;
}

function getProvider(): ethers.Provider {
  if (cachedProvider) return cachedProvider;

  const { rpcUrl } = getConfig();
  if (!rpcUrl) throw new Error("RPC URL missing");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  cachedProvider = provider;

  console.log("[Blockchain] Using RPC:", rpcUrl);
  return provider;
}

function getContract(): ethers.Contract {
  if (cachedContract) return cachedContract;

  const { privateKey, contractAddress } = getConfig();
  const provider = getProvider();

  if (!privateKey) throw new Error("Missing WALLET_PRIVATE_KEY");
  if (!contractAddress) throw new Error("Missing TX_HASH_STORE_ADDRESS");

  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  cachedContract = contract;

  console.log("[Blockchain] Contract initialized:", {
    address: contractAddress,
    signer: wallet.address,
  });

  return contract;
}

export function toBytes32Hash(input: string): `0x${string}` {
  const hash = ethers.keccak256(ethers.toUtf8Bytes(input));
  console.log("[Blockchain] Hash → bytes32:", { input, hash });
  return hash as `0x${string}`;
}

export async function recordHashOnChain(hashBytes32: `0x${string}`) {
  const contract = getContract();
  console.log("[Blockchain] Sending tx:", { hashBytes32 });

  const tx = await contract.record(hashBytes32);
  console.log("[Blockchain] Tx sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("[Blockchain] Tx mined:", receipt.hash);

  return receipt;
}

// Debug summary
console.log("[Blockchain] ENV check:", {
  rpcLocal: process.env.LOCAL_RPC_URL ? "yes" : "no",
  rpcSepolia: process.env.SEPOLIA_RPC_URL ? "yes" : "no",
  hasKey: !!process.env.WALLET_PRIVATE_KEY,
  hasAddr: !!process.env.TX_HASH_STORE_ADDRESS,
});
