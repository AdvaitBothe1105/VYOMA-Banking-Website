import React from "react";
import { FaMoneyBillTransfer, FaUserCheck } from "react-icons/fa6";
import { SlidersHorizontal } from "lucide-react";

type MainFundProps = {
  onStepChange: (step: "oneTime" | "beneficiaries" | "limits") => void;
};

const cards = [
  {
    key: "oneTime" as const,
    icon: <FaMoneyBillTransfer className="w-7 h-7" />,
    title: "Send Money",
    desc: "Quick one-time transfer or send to saved beneficiaries",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "beneficiaries" as const,
    icon: <FaUserCheck className="w-7 h-7" />,
    title: "Beneficiaries",
    desc: "Add, view or manage your saved beneficiaries",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "limits" as const,
    icon: <SlidersHorizontal className="w-7 h-7" />,
    title: "Transfer Limits",
    desc: "View and modify your daily & per-transaction limits",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const MainFund: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card) => (
        <button
          key={card.key}
          className="group text-left bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#A47E3B]/40 hover:shadow-md transition-all duration-200"
          onClick={() => onStepChange(card.key)}
        >
          <div className={`inline-flex p-3 rounded-xl ${card.bg} ${card.color} mb-4 group-hover:scale-110 transition-transform`}>
            {card.icon}
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">{card.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
        </button>
      ))}
    </div>
  );
};

export default MainFund;