import React from "react";
import { ArrowLeft, Users } from "lucide-react";

type MainFundProps = {
  onStepChange: (step: "beneficiaries") => void;
};

const ManageBeneficiaries: React.FC<MainFundProps> = ({ onStepChange }) => {
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
          <h3 className="text-lg font-semibold text-gray-900">Manage Beneficiaries</h3>
          <p className="text-sm text-gray-500 mt-0.5">View and manage your saved beneficiaries</p>
        </div>
        <div className="p-10 flex flex-col items-center text-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No beneficiaries added yet</p>
          <p className="text-gray-400 text-xs mt-1">Beneficiaries you add will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default ManageBeneficiaries;
