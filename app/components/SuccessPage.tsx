'use client';
import { useRouter } from "next/navigation";
import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const SuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="inline-flex p-4 bg-emerald-50 rounded-full mb-5">
          <CheckCircle className="text-emerald-500 w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your transaction has been completed successfully and recorded on the blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/fund")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            New Transfer
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#A47E3B] text-white text-sm font-semibold hover:bg-[#8c6a2f] transition-colors"
          >
            Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
