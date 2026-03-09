import { ethers } from "ethers";
import LoanApprovalABI from "@/lib/abis/LoanApprovalRegistry.json";

const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL);

const adminWallet = new ethers.Wallet(
  process.env.WALLET_PRIVATE_KEY!,
  provider
);

const contract = new ethers.Contract(
  process.env.LOAN_APPROVAL_REGISTRY_ADDRESS!,
  LoanApprovalABI,
  adminWallet
);

export async function recordLoanDecisionOnChain(
  loanId: number,
  approved: boolean
) {
  const decision = approved ? 0 : 1; // enum index
  const tx = await contract.recordDecision(loanId, decision);
  return await tx.wait();
}
