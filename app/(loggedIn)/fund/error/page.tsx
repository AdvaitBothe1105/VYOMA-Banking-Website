"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function FundTransferErrorPage() {
  const router = useRouter();
  const params = useSearchParams();
  const errorMsg = params.get("msg") || "An unexpected error occurred.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="bg-white shadow-2xl border border-red-300 rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h1 className="text-3xl font-extrabold text-red-600">Transfer Failed</h1>
          <p className="text-gray-700 text-sm">{errorMsg}</p>
          <button
            onClick={() => router.push("/fund")}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition duration-300"
          >
            Back to Fund Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
