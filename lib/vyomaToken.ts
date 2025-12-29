import { ethers } from "ethers";
import VyomaTokenABI from "@/lib/abis/VyomaToken.json";

/**
 * Provider (local / private blockchain)
 */
const RPC_URL = process.env.LOCAL_RPC_URL!;
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * Owner wallet (for minting only)
 */
const OWNER_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY!;
const ownerWallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);

/**
 * Contract address
 */
const TOKEN_ADDRESS = process.env.VYO_TOKEN_ADDRESS!;

/**
 * Read-only contract (no signer)
 */
const tokenRead = new ethers.Contract(
  TOKEN_ADDRESS,
  VyomaTokenABI,
  provider
) as any;

/**
 * Owner contract (minting)
 */
const tokenOwner = new ethers.Contract(
  TOKEN_ADDRESS,
  VyomaTokenABI,
  ownerWallet
);

// --------------------
// Helpers
// --------------------

/**
 * Mint Vyoma tokens (bank action)
 */
export async function mintVyo(to: string, amount: number) {
  const value = ethers.parseUnits(amount.toString(), 18);
  const tx = await tokenOwner.mint(to, value);
  return await tx.wait();
}

/**
 * Get on-chain VYO balance (SOURCE OF TRUTH)
 */
export async function getVyoBalance(address: string): Promise<number> {
  const balance = await tokenRead.balanceOf(address);
  return Number(ethers.formatUnits(balance, 18));
}

/**
 * Transfer tokens FROM a user wallet (custodial)
 */
export async function transferVyoFromUser(
  userPrivateKey: string,
  to: string,
  amount: number
) {
  const userWallet = new ethers.Wallet(userPrivateKey, provider);
  const tokenUser = tokenRead.connect(userWallet);

  const value = ethers.parseUnits(amount.toString(), 18);
  const tx = await tokenUser.transfer(to, value);
  return await tx.wait();
}
