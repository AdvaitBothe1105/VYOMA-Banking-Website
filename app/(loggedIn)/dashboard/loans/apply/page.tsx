"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyLoanPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [purposeCategory, setPurposeCategory] = useState("personal");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          tenureMonths: Number(tenureMonths),
          purposeCategory,
          purpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit loan");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/loans"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Apply for a Loan</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Submit a loan request for review
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary mb-4">
            Loan submitted successfully. Redirecting…
          </div>
        )}

        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loan Amount */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                min={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 50000"
              />
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Tenure (Months)
              </label>
              <input
                type="number"
                min={1}
                required
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 12"
              />
            </div>

            {/* Purpose Category */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Purpose Category
              </label>
              <select
                value={purposeCategory}
                onChange={(e) => setPurposeCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="personal">Personal</option>
                <option value="education">Education</option>
                <option value="medical">Medical/Health</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Purpose Details
              </label>
              <textarea
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 text-sm border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Briefly describe why you need this loan"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity mt-6"
            >
              {loading ? "Submitting…" : "Submit Loan Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
