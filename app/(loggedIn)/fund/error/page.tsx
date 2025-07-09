"use client";
import FundTransferErrorClient from "@/app/components/FundTransferErrorClient";
import { Suspense } from "react";

export default function FundTransferErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <FundTransferErrorClient />
    </Suspense>
  );
}
