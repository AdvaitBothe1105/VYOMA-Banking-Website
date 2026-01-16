import { ReactNode } from "react";

export const metadata = {
  title: "Loans | Vyoma Bank",
  description: "Manage your loans with Vyoma Bank's digital platform.",
  keywords: ["Loans", "Vyoma Bank", "Loan Management", "Banking"],
};

export default function LoansLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
