"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useToast } from "@/app/components/toast/ToastContext";

interface DecodedToken {
  userId: string;
  crn: string;
  iat: number;
  exp: number;
}

interface Loan {
  id: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  purposeCategory?: string;
  status: string;
  interestRate: number;
  riskBand: string;
  createdAt: string;
  borrowerReliability?: string;
  loanHistory?: string;
  voted?: boolean;
  userVote?: string | null;
}

interface LoanCardProps {
  loan: Loan;
  showVote?: boolean;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, showVote = false }) => {
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(loan.voted ?? false);
  const [userVote, setUserVote] = useState<string | null>(loan.userVote ?? null);
  const { addToast } = useToast();

  const submitVote = async (voteValue: "yes" | "no") => {
    setVoting(true);
    try {
      const res = await fetch(`/api/loans/${loan.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: voteValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Failed to submit vote", "error");
        return;
      }

      setVoted(true);
      setUserVote(voteValue);
      addToast("Your vote has been recorded", "success");
    } catch (err) {
      addToast("Failed to submit vote", "error");
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          {showVote && loan.purposeCategory ? (
            <>
              <h3 className="text-lg font-semibold text-card-foreground">
                {loan.purposeCategory.charAt(0).toUpperCase() + loan.purposeCategory.slice(1)}
              </h3>
              <p className="text-sm text-muted-foreground">{loan.purpose}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-card-foreground">
                {loan.purpose}
              </h3>
            </>
          )}
          <p className="text-xs text-muted-foreground mt-1">Loan ID: {loan.id}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            loan.status === "approved"
              ? "bg-green-500/15 text-green-700 dark:text-green-400"
              : loan.status === "rejected"
              ? "bg-destructive/15 text-destructive"
              : "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
          }`}
        >
          {loan.status.toUpperCase()}
        </span>
      </div>

      {/* Metrics */}
      {showVote ? (
        <div className="space-y-4 text-sm">
          {/* Financial Exposure - Full Width */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tenure</p>
              <p className="font-semibold">{loan.tenureMonths} months</p>
            </div>
          </div>

          {/* Risk Band with Explanation - Neutral styling */}
          <div className="border border-border rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-medium">Risk Band</p>
              <span className="text-sm font-semibold tracking-wide">{loan.riskBand}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Admin-assigned risk assessment. Band A (low risk) to C (high risk) based on loan profile analysis.
            </p>
          </div>

          {/* Borrower Reliability with Explanation */}
          {loan.borrowerReliability && (
            <div className="bg-muted/40 rounded p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground font-medium">Borrower Reliability</p>
                <p className="font-semibold text-base">{loan.borrowerReliability}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on reputation score. High (600+), Medium (300-599), Low (&lt;300) — reflects on-platform borrowing history.
              </p>
            </div>
          )}

          {/* Loan History - Full Width */}
          {loan.loanHistory && (
            <div>
              <p className="text-muted-foreground font-medium mb-1.5">Loan History</p>
              <p className="text-xs leading-relaxed bg-muted/40 rounded p-3 text-card-foreground">{loan.loanHistory}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tenure</p>
            <p className="font-semibold">{loan.tenureMonths} months</p>
          </div>
          {loan.status === "approved" && (
            <>
              <div>
                <p className="text-muted-foreground">Risk Band</p>
                <p className="font-semibold">{loan.riskBand}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interest</p>
                <p className="font-semibold">{loan.interestRate}%</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
        Applied on {new Date(loan.createdAt).toLocaleDateString()}
      </div>

      {/* Vote Section */}
      {showVote && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            Your vote contributes to an advisory governance signal and is not binding.
          </p>

          {voted ? (
            <div className="rounded-md bg-muted/40 border border-border px-3 py-2 text-sm">
              <p className="text-card-foreground">
                <span className="font-semibold">Your vote:</span>{" "}
                <span className="font-medium capitalize">{userVote}</span>
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => submitVote("yes")}
                disabled={voting}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {voting ? "Recording..." : "Yes"}
              </button>
              <button
                onClick={() => submitVote("no")}
                disabled={voting}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                {voting ? "Recording..." : "No"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function LoansPage() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [votableLoans, setVotableLoans] = useState<Loan[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "vote">("my");

  useEffect(() => {
    fetch("/api/token")
      .then((res) => res.json())
      .then((data) => {
        if (data.token) setUser(jwtDecode<DecodedToken>(data.token));
      })
      .catch(() => setError("Authentication failed"));
  }, []);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/loans");
        if (!res.ok) throw new Error();

        const data = await res.json();
        setMyLoans(data.myLoans || []);
        setVotableLoans(data.votableLoans || []);
      } catch {
        setError("Failed to load loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading loans…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header Card */}
        <div className="flex items-center justify-between bg-card border border-border rounded-lg px-6 py-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">
              My Loans
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your loan applications and approvals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/loans/how-voting-works"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition"
            >
              How voting works?
            </Link>
            <Link
              href="/dashboard/loans/apply"
              className="inline-flex items-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
            >
              Apply for Loan
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Segmented Control (YouTube-style tabs) */}
        <div className="flex gap-2 bg-muted p-1 rounded-full w-fit">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === "my"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Applications
          </button>

          <button
            onClick={() => setActiveTab("vote")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === "vote"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Open for Voting
          </button>
        </div>

        {/* My Applications Tab */}
        {activeTab === "my" && (
          <div>
            {myLoans.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground shadow-sm">
                You have not applied for any loans yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Open for Voting Tab */}
        {activeTab === "vote" && (
          <div>
            {votableLoans.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground shadow-sm">
                No loans are currently open for voting.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {votableLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} showVote />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
