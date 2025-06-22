import React, { useState } from "react";
import { FaArrowTrendUp, FaArrowTrendDown, FaEye } from "react-icons/fa6";

const Summary = () => {
  const [showAssets, setShowAssets] = useState(false);
  const [showLiabilities, setShowLiabilities] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
            <FaArrowTrendUp className="text-green-600" /> Your Assets
          </h2>
          {showAssets && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Balance</span>
                <span className="font-bold text-lg text-primary">
                  ₹ 1,00,000
                </span>
              </div>
              <div className="flex justify-between">
                <span>Investments</span>
                <span>N.A</span>
              </div>
              <div className="flex justify-between">
                <span>Real Estate</span>
                <span>N.A</span>
              </div>
              <div className="flex justify-between">
                <span>Others</span>
                <span>N.A</span>
              </div>
            </div>
          )}
          <button
            className="btn btn-primary flex items-center gap-2 mt-2 bg-[#46494c] hover:bg-[#5a5d60] text-white w-fit p-4 rounded-2xl"
            onClick={() => setShowAssets((v) => !v)}
          >
            <FaEye /> {showAssets ? "Hide Balance" : "View Balance"}
          </button>
        </div>
        {/* Liabilities Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-red-700">
            <FaArrowTrendDown /> Your Liabilities
          </h2>
          {showLiabilities && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Mortgage</span>
                <span>N.A</span>
              </div>
              <div className="flex justify-between">
                <span>Student Loans</span>
                <span>N.A</span>
              </div>
              <div className="flex justify-between">
                <span>Credit Cards</span>
                <span>N.A</span>
              </div>
              <div className="flex justify-between">
                <span>Others</span>
                <span>N.A</span>
              </div>
            </div>
          )}
          <button
            className="btn btn-primary flex items-center gap-2 mt-2 bg-[#46494c] hover:bg-[#5a5d60] text-white w-fit p-4 rounded-2xl"
            onClick={() => setShowLiabilities((v) => !v)}
          >
            <FaEye /> {showLiabilities ? "Hide Details" : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
