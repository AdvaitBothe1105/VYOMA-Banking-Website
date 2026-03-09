import React from "react";
import { ArrowLeft, Save } from "lucide-react";

type MainFundProps = {
  onStepChange: (step: "main") => void;
};

const FundLimits: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
        onClick={() => onStepChange("main")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fund Transfer
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Transfer Limits</h3>
          <p className="text-sm text-gray-500 mt-0.5">RTGS / NEFT / Third-party fund transfer limits for your CRN</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Per Day Limit (₹)</label>
              <input
                type="number"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                placeholder="Enter new limit"
              />
              <p className="text-xs text-gray-400 mt-1.5">Current limit: ₹10,00,000</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Per Transaction Limit (₹)</label>
              <input
                type="number"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                placeholder="Enter new limit"
              />
              <p className="text-xs text-gray-400 mt-1.5">Current limit: ₹5,00,000</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800 mb-2">Important Notes</p>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• You can modify your limit only once per day</li>
              <li>• Maximum limit via net banking: ₹50,00,000</li>
              <li>• Limits apply for third-party transfers across VYOMA and other banks</li>
              <li>• Limit modification is subject to Bank&apos;s discretion</li>
              <li>• For beneficiary limits, visit &quot;Manage Beneficiaries&quot;</li>
            </ul>
          </div>

          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A47E3B] text-white text-sm font-semibold hover:bg-[#8c6a2f] transition-colors">
            <Save className="w-4 h-4" />
            Update Limits
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundLimits;
