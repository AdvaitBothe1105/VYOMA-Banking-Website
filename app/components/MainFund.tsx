import React from "react";
import { FaMoneyBillTransfer, FaNewspaper, FaUserCheck } from "react-icons/fa6";

type MainFundProps = {
  onStepChange: (step: "oneTime" | "beneficiaries" | "limits") => void;
};

const MainFund: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FAF5EE] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
          onClick={() => onStepChange("oneTime")}
        >
          <FaMoneyBillTransfer className="text-3xl text-[#A47E3B]" />
          <div className="mt-2 font-semibold text-[#4B3F2F]">Send Money</div>
        </div>
        <div
          className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FAF5EE] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
          onClick={() => onStepChange("beneficiaries")}
        >
          <FaUserCheck className="text-3xl text-[#A47E3B]" />
          <div className="mt-2 font-semibold text-[#4B3F2F]">Beneficiaries</div>
        </div>
        <div
          className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FAF5EE] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
          onClick={() => onStepChange("limits")}
        >
          <FaNewspaper className="text-3xl text-[#A47E3B]" />
          <div className="mt-2 font-semibold text-[#4B3F2F]">
            Fund Transfer Limits
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFund;