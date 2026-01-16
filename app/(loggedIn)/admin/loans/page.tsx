"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Loan {
  id: string;
  borrowerCrn: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  status: "pending" | "voting" | "approved" | "rejected";
  riskBand: "A" | "B" | "C" | null;
  interestRate: number;
  createdAt: string;
}

interface VotingSummary {
  total: number;
  yes: number;
  no: number;
  abstain: number;
  yesRatio: number;
  recommendation: "Insufficient Data" | "Positive Signal" | "Negative Signal";
}

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingSummaries, setVotingSummaries] = useState<Record<string, VotingSummary>>({});
  const [expandedVotingLoan, setExpandedVotingLoan] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/loans");
      if (!res.ok) throw new Error("Failed to fetch loans");
      const data = await res.json();
      setLoans(data.loans || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchVotingSummary = async (loanId: string) => {
    try {
      const res = await fetch(`/api/admin/loans/${loanId}/votes`);
      if (!res.ok) throw new Error("Failed to fetch voting data");
      const data = await res.json();
      setVotingSummaries((prev) => ({
        ...prev,
        [loanId]: data,
      }));
    } catch (err) {
      console.error("Failed to fetch voting summary:", err);
    }
  };

  const handleToggleVotingDetails = (loanId: string) => {
    if (expandedVotingLoan === loanId) {
      setExpandedVotingLoan(null);
    } else {
      setExpandedVotingLoan(loanId);
      if (!votingSummaries[loanId]) {
        fetchVotingSummary(loanId);
      }
    }
  };

  const submitDecision = async (
    loanId: string,
    decision: "approved" | "rejected",
    interestRate?: number
  ) => {
    try {
      const body: any = { decision };
      if (decision === "approved") {
        if (!interestRate) {
          alert("Please enter an interest rate");
          return;
        }
        body.interestRate = interestRate;
      }

      const res = await fetch(`/api/admin/loans/${loanId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to process decision");
        return;
      }

      alert(data.message || "Decision recorded successfully");
      await fetchLoans();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to process decision");
    }
  };

  const moveToVoting = async (loanId: string) => {
    try {
      const res = await fetch(`/api/admin/loans/${loanId}/move-to-voting`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to move loan to voting");
      await fetchLoans();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to move loan to voting");
    }
  };

  if (loading) {
    return <div className="min-h-screen p-8 bg-background text-foreground">Loading loans…</div>;
  }

  // Split loans by status
  const pendingLoans = loans.filter(l => l.status === "pending");
  const votingLoans = loans.filter(l => l.status === "voting");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Loan Management</h1>
          <p className="text-muted-foreground mt-1">Review pending applications and monitor voting loans</p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Section A: Pending Loans */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Pending Applications</h2>

          {pendingLoans.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground shadow-sm">
              No pending loans.
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-card border border-border rounded-lg p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground text-lg">{loan.purpose}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      CRN: <span className="font-medium">{loan.borrowerCrn}</span> · Amount: <span className="font-medium">₹{Number(loan.amount).toLocaleString()}</span> · Tenure: <span className="font-medium">{loan.tenureMonths} months</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied: {new Date(loan.createdAt).toLocaleDateString()}&nbsp;·&nbsp;
                      Risk: <span className="italic">Not assessed</span>
                    </p>
                  </div>

                  <button
                    onClick={() => moveToVoting(String(loan.id))}
                    className="ml-4 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Assess & Move to Voting
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section B: Loans in Voting */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Loans in Voting</h2>

          {votingLoans.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground shadow-sm">
              No loans currently in voting.
            </div>
          ) : (
            <div className="grid gap-4">
              {votingLoans.map((loan) => (
                <div key={loan.id}>
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-card-foreground text-lg">{loan.purpose}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          CRN: <span className="font-medium">{loan.borrowerCrn}</span> · Amount: <span className="font-medium">₹{Number(loan.amount).toLocaleString()}</span> · Tenure: <span className="font-medium">{loan.tenureMonths} months</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Applied: {new Date(loan.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleVotingDetails(loan.id)}
                        className="ml-4 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            expandedVotingLoan === loan.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex gap-3 flex-wrap">
                      {loan.riskBand && (
                        <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                          Risk Band: <strong className="text-foreground">{loan.riskBand}</strong>
                        </span>
                      )}
                      <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                        Status: <strong className="text-foreground">In Community Vote</strong>
                      </span>
                    </div>
                  </div>

                  {/* Voting Summary (Expandable) */}
                  {expandedVotingLoan === loan.id && (
                    <div className="mt-3 bg-card border border-border rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold">Community Voting Summary</h3>

                      {votingSummaries[loan.id] ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-muted-foreground">Total Votes</div>
                            <div className="font-semibold">
                              {votingSummaries[loan.id].total}
                            </div>

                            <div className="text-muted-foreground">Yes Votes</div>
                            <div className="font-semibold text-green-600">
                              {votingSummaries[loan.id].yes}
                            </div>

                            <div className="text-muted-foreground">No Votes</div>
                            <div className="font-semibold text-red-600">
                              {votingSummaries[loan.id].no}
                            </div>

                            <div className="text-muted-foreground">Abstain</div>
                            <div className="font-semibold">
                              {votingSummaries[loan.id].abstain}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border">
                            <p className="text-sm">
                              Recommendation:{" "}
                              <span
                                className={`font-semibold ${
                                  votingSummaries[loan.id].recommendation === "Positive Signal"
                                    ? "text-green-600"
                                    : votingSummaries[loan.id].recommendation === "Negative Signal"
                                    ? "text-red-600"
                                    : "text-amber-600"
                                }`}
                              >
                                {votingSummaries[loan.id].recommendation}
                              </span>
                            </p>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            This is an advisory signal. Final decisions are made by administrators.
                          </p>

                          {/* Final Decision Panel */}
                          <div className="border-t border-border pt-6 space-y-4 mt-4">
                            <h4 className="text-lg font-semibold">Final Decision</h4>

                            <DecisionPanel
                              loan={loan}
                              onSubmitDecision={submitDecision}
                            />

                            <p className="text-xs text-muted-foreground">
                              Voting results are advisory. Final approval is an administrative decision.
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Loading voting data...</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DecisionPanelProps {
  loan: Loan;
  onSubmitDecision: (
    loanId: string,
    decision: "approved" | "rejected",
    interestRate?: number
  ) => Promise<void>;
}

function DecisionPanel({ loan, onSubmitDecision }: DecisionPanelProps) {
  const [interestRate, setInterestRate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const getRateRange = (riskBand: string | null) => {
    const ranges: Record<string, { min: number; max: number }> = {
      A: { min: 8, max: 10 },
      B: { min: 11, max: 14 },
      C: { min: 15, max: 18 },
    };
    return ranges[riskBand || ""] || null;
  };

  const rateRange = getRateRange(loan.riskBand);

  const handleApprove = async () => {
    setSubmitting(true);
    await onSubmitDecision(loan.id, "approved", parseFloat(interestRate));
    setSubmitting(false);
  };

  const handleReject = async () => {
    setSubmitting(true);
    await onSubmitDecision(loan.id, "rejected");
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {rateRange && (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-card-foreground block mb-2">
              Interest Rate (%) — Risk Band {loan.riskBand}: {rateRange.min}% – {rateRange.max}%
            </label>
            <input
              type="number"
              step="0.1"
              min={rateRange.min}
              max={rateRange.max}
              placeholder={`${rateRange.min}% – ${rateRange.max}%`}
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={handleApprove}
            disabled={submitting || !interestRate}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? "Processing..." : "Approve Loan"}
          </button>
        </div>
      )}

      <button
        onClick={handleReject}
        disabled={submitting}
        className="w-full rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
      >
        {submitting ? "Processing..." : "Reject Loan"}
      </button>
    </div>
  );
}
