'use client';
import { useRouter } from "next/navigation";
import React from "react";
import { CheckCircle } from "lucide-react";

const SuccessPage: React.FC = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard"); // Adjust this path as per your app's route
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF5EE] px-4 rounded-lg" >
      <div className="bg-white p-10 rounded-xl shadow-md border border-[#D4C8B6] text-center">
        <CheckCircle className="text-green-600 w-16 h-16 mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-[#4B3F2F] mb-2">Transfer Successful</h1>
        <p className="text-[#4B3F2F]/80 mb-6">
          Your transaction was completed successfully.
        </p>
        <button
          onClick={handleBackToDashboard}
          className="px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
