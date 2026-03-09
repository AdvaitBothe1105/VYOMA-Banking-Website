import React from "react";
import {
  FaMoneyBillTransfer,
  FaMoneyCheck,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";

type MainFundProps = {
  onStepChange: (
    step: "addBeneficiary" | "beneficiaries" | "limits" | "transfer" | "main"
  ) => void;
};

const options = [
  {
    key: "transfer" as const,
    icon: <FaMoneyBillTransfer className="w-6 h-6" />,
    title: "One Time Transfer",
    desc: "Send without adding a beneficiary",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "beneficiaries" as const,
    icon: <FaUserCheck className="w-6 h-6" />,
    title: "Send to Beneficiary",
    desc: "Transfer to a saved beneficiary",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "addBeneficiary" as const,
    icon: <FaUserPlus className="w-6 h-6" />,
    title: "Add Beneficiary",
    desc: "Save a new beneficiary for future transfers",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "main" as const,
    icon: <FaMoneyCheck className="w-6 h-6" />,
    title: "Demand Draft",
    desc: "Send a formal demand draft",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const OneTimeTransferOptions: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
        onClick={() => onStepChange("main")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fund Transfer
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((opt) => (
          <button
            key={opt.key}
            className="group text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#A47E3B]/40 hover:shadow-md transition-all duration-200"
            onClick={() => onStepChange(opt.key)}
          >
            <div className={`inline-flex p-2.5 rounded-xl ${opt.bg} ${opt.color} mb-3 group-hover:scale-110 transition-transform`}>
              {opt.icon}
            </div>
            <h3 className="font-semibold text-gray-900">{opt.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OneTimeTransferOptions;
