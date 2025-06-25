import React from "react";
import {
  FaMoneyBillTransfer,
  FaMoneyCheck,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa6";

type MainFundProps = {
  onStepChange: (
    step: "addBeneficiary" | "beneficiaries" | "limits" | "transfer" | "main"
  ) => void;
};

const OneTimeTransferOptions: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => onStepChange("transfer")}
          >
            <FaMoneyBillTransfer className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">
              One Time Transfer
              <br />
              (without adding beneficiaries)
            </div>
          </div>
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => onStepChange("beneficiaries")}
          >
            <FaUserCheck className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Send to My Beneficiaries</div>
          </div>
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => onStepChange("addBeneficiary")}
          >
            <FaUserPlus className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Add Beneficiaries</div>
          </div>
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => onStepChange("main")}
          >
            <FaMoneyCheck className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Send a Demand Draft</div>
          </div>
          <div className="btn-div flex flex-col justify-center ">
            <button
              className="btn btn-secondary mt-4 ml-5 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition"
              onClick={() => onStepChange("main")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneTimeTransferOptions;
