"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const crn = searchParams.get("crn");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dbeafe] to-[#f0fdf4] p-6">
      <div className="bg-white max-w-md w-full shadow-2xl rounded-2xl p-10 text-center border border-gray-200">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          KYC Submitted Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Your documents were uploaded and verified. Your unique Customer Reference Number (CRN) is:
        </p>
        <div className="bg-gray-100 rounded-lg py-3 px-6 text-xl font-semibold text-gray-800 tracking-wide mb-6">
          {crn ?? "CRN123456789"}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
