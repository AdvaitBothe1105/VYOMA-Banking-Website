import { prisma } from "@/lib/prisma";

export async function aggregateVotes(loanId: number) {
  const votes = await prisma.loanVote.findMany({
    where: { loanId },
  });

  const total = votes.length;
  const yes = votes.filter((v) => v.vote === "yes").length;
  const no = votes.filter((v) => v.vote === "no").length;
  const abstain = votes.filter((v) => v.vote === "abstain").length;

  const yesRatio = total > 0 ? yes / total : 0;

  return {
    total,
    yes,
    no,
    abstain,
    yesRatio,
    recommendation: getRecommendation(yesRatio, total),
  };
}

function getRecommendation(
  yesRatio: number,
  totalVotes: number
): "Insufficient Data" | "Positive Signal" | "Negative Signal" {
  if (totalVotes < 5) return "Insufficient Data";
  if (yesRatio >= 0.65) return "Positive Signal";
  if (yesRatio <= 0.35) return "Negative Signal";
  return "Insufficient Data";
}
