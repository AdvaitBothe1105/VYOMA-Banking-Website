import React from "react";
import { FaUserPlus, FaUserTag } from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";

type MainFundProps = {
  onStepChange: (step: "addBeneficiary" | "manageBeneficiary" | "main") => void;
};

const options = [
  {
    key: "addBeneficiary" as const,
    icon: <FaUserPlus className="w-6 h-6" />,
    title: "Add Beneficiary",
    desc: "Save a new beneficiary for quick transfers",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "manageBeneficiary" as const,
    icon: <FaUserTag className="w-6 h-6" />,
    title: "Manage Beneficiaries",
    desc: "View, edit, or remove saved beneficiaries",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

const Beneficiaries: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
        onClick={() => onStepChange("main")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fund Transfer
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {options.map((opt) => (
          <button
            key={opt.key}
            className="group text-left bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#A47E3B]/40 hover:shadow-md transition-all duration-200"
            onClick={() => onStepChange(opt.key)}
          >
            <div className={`inline-flex p-3 rounded-xl ${opt.bg} ${opt.color} mb-3 group-hover:scale-110 transition-transform`}>
              {opt.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{opt.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Beneficiaries;
