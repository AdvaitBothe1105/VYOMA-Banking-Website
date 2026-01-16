interface RiskInput {
  amount: number;
  tenureMonths: number;
  reputationScore: number;
}

export function calculateRiskBand({
  amount,
  tenureMonths,
  reputationScore,
}: RiskInput): "A" | "B" | "C" {
  let score = 0;

  // Amount factor
  if (amount <= 50_000) score += 2;
  else if (amount <= 200_000) score += 1;
  else score -= 1;

  // Tenure factor
  if (tenureMonths <= 12) score += 2;
  else if (tenureMonths <= 24) score += 1;
  else score -= 1;

  // Reputation factor
  if (reputationScore >= 600) score += 2;
  else if (reputationScore >= 300) score += 1;
  else score -= 2;

  if (score >= 4) return "A";
  if (score >= 2) return "B";
  return "C";
}
