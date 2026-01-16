"use client";

import Link from "next/link";

export default function HowVotingWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/dashboard/loans"
            className="text-sm text-primary hover:underline"
          >
            ← Back to Loans
          </Link>
          <h1 className="text-3xl font-bold text-card-foreground">
            🗳️ How Loan Voting Works in Vyoma
          </h1>
          <p className="text-muted-foreground">
            Understand how your vote contributes to responsible lending
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* What is loan voting */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-card-foreground">
              What is loan voting?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Loan voting is a <span className="font-medium">community advisory mechanism</span> that allows verified users to provide feedback on loan applications after an initial administrative review.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your vote helps indicate whether a loan appears{" "}
              <span className="font-medium">reasonable, risky, or concerning</span>{" "}
              based on the information provided.
            </p>
          </section>

          {/* Why does Vyoma ask */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-card-foreground">
              Why does Vyoma ask users to vote?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Traditional banks rely on internal committees for credit decisions. Vyoma supplements this with{" "}
              <span className="font-medium">collective intelligence</span> from its user base.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This approach:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Increases transparency</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Surfaces risk signals early</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Encourages responsible participation</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Does <span className="font-medium">not</span> replace formal credit approval</span>
              </li>
            </ul>
          </section>

          {/* What does your vote do */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-card-foreground">
              What does your vote do?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your vote contributes to an{" "}
              <span className="font-medium">aggregate governance signal</span> that is reviewed during loan approval.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Votes help:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Identify loans that require deeper review</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Flag unusual or high-risk requests</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Strengthen confidence in reasonable applications</span>
              </li>
            </ul>
            <div className="mt-3 p-3 bg-muted/40 rounded border border-border text-sm">
              <p className="text-card-foreground">
                <span className="font-semibold">Remember:</span> Your vote is <span className="font-medium">advisory, not binding</span>.
              </p>
            </div>
          </section>

          {/* What does your vote NOT do */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-card-foreground">
              What does your vote NOT do?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Voting does <span className="font-medium">not</span>:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-destructive/70 mt-1">✗</span>
                <span>Approve or reject loans directly</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-destructive/70 mt-1">✗</span>
                <span>Create legal or financial responsibility</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-destructive/70 mt-1">✗</span>
                <span>Affect your personal funds</span>
              </li>
              <li className="text-muted-foreground flex items-start gap-2">
                <span className="text-destructive/70 mt-1">✗</span>
                <span>Guarantee loan outcomes</span>
              </li>
            </ul>
            <div className="mt-3 p-3 bg-muted/40 rounded border border-border text-sm">
              <p className="text-card-foreground">
                <span className="font-semibold">Final decisions</span> are always made by Vyoma administrators.
              </p>
            </div>
          </section>

          {/* Why should you vote */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-card-foreground">
              Why should you participate?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Participating in loan voting helps strengthen the Vyoma ecosystem. While voting does not provide immediate financial rewards, responsible participation is recognized over time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By voting, you may:
            </p>
            <ul className="space-y-3 ml-4 mt-3">
              <li className="space-y-1">
                <p className="text-card-foreground font-medium">📈 Reputation Growth</p>
                <p className="text-sm text-muted-foreground">
                  Responsible participation in loan voting contributes positively to your platform reputation over time.
                </p>
              </li>
              <li className="space-y-1">
                <p className="text-card-foreground font-medium">🔓 Governance Privileges</p>
                <p className="text-sm text-muted-foreground">
                  Users with a history of responsible voting gain access to enhanced governance features in future phases.
                </p>
              </li>
              <li className="space-y-1">
                <p className="text-card-foreground font-medium">🛡️ Platform Safety & Trust</p>
                <p className="text-sm text-muted-foreground">
                  Voting helps maintain the safety of the lending ecosystem, which benefits all users by reducing defaults and instability.
                </p>
              </li>
            </ul>
            <div className="mt-3 p-3 bg-muted/40 rounded border border-border text-sm">
              <p className="text-card-foreground">
                <span className="font-medium">Voting is optional</span>, but it plays an important role in maintaining a safe and transparent lending environment.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="flex justify-center">
            <Link
              href="/dashboard/loans"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
            >
              Ready to vote? Go to Loans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
