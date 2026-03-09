import React from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

type MainFundProps = {
  onStepChange: (step: "beneficiaries") => void;
};

const AddBeneficiaries: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
        onClick={() => onStepChange("beneficiaries")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Beneficiaries
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Add Beneficiary</h3>
          <p className="text-sm text-gray-500 mt-0.5">Save a new beneficiary for future transfers</p>
        </div>

        <form
          className="p-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Beneficiary added!");
            onStepChange("beneficiaries");
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Beneficiary Name</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Number</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                placeholder="Enter account number"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                placeholder="Enter bank name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">IFSC Code</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                placeholder="e.g. VYOM0000001"
                required
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A47E3B] text-white text-sm font-semibold hover:bg-[#8c6a2f] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Beneficiary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBeneficiaries;
