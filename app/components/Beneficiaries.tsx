import React from "react";
import { FaUserPlus, FaUserTag } from "react-icons/fa6";

type MainFundProps = {
  onStepChange: (step: "addBeneficiary" | "manageBeneficiary" | "main") => void;
};

const Beneficiaries: React.FC<MainFundProps> = ({ onStepChange }) => {
  return (
    <div>
      <div className="mb-10 ">
        <div className=" flex flex-col md:flex-row gap-6 justify-center">
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => onStepChange("addBeneficiary")}
          >
            <FaUserPlus className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Add Beneficiaries</div>
          </div>
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => onStepChange("manageBeneficiary")}
          >
            <FaUserTag className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Manage Beneficiaries</div>
          </div>
          <button
            className="btn btn-secondary mt-6 ml-5 mb-10 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition"
            onClick={() => onStepChange("main")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Beneficiaries;
