"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function FundTransferErrorClient() {
  const router = useRouter();
  const params = useSearchParams();
  const errorMsg = params.get("msg") || "An unexpected error occurred.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="inline-flex p-4 bg-red-50 rounded-full mb-5">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transfer Failed</h1>
        <p className="text-gray-500 text-sm mb-8">{errorMsg}</p>
        <button
          onClick={() => router.push("/fund")}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#A47E3B] text-white text-sm font-semibold hover:bg-[#8c6a2f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fund Transfer
        </button>
      </div>
    </div>
  );
}
