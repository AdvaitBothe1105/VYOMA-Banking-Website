import React from "react";
import { FaPenNib } from "react-icons/fa6";

type MainFundProps = {
  onStepChange: (step: "main") => void;
};

const FundLimits:React.FC<MainFundProps> = ({onStepChange}) => {
  return (
    <div>
      <div className="bg-[#FAF5EE] border border-[#D4C8B6] rounded-xl shadow-lg p-8 mb-10">
        <div className="font-bold text-lg text-[#4B3F2F] mb-2">
          Manage Fund Transfer Limits
        </div>
        <div className="text-[#4B3F2F]/80 mb-4">
          RTGS/NEFT/Third party fund transfer limits for your CRN
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Per Day Limit (₹)</label>
          <input
            type="number"
            className="input w-full max-w-xs p-2 border-black border-2 rounded-lg"
            placeholder="Enter new limit"
          />
          <div className="text-xs mt-1 text-[#4B3F2F]/70">
            Existing Limit (₹) 1,000,000
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Per Transaction Limit (₹)
          </label>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs p-2 border-black border-2 rounded-lg"
            placeholder="Enter new limit"
          />
          <div className="text-xs mt-1 text-[#4B3F2F]/70">
            Existing Limit (₹) 500,000
          </div>
        </div>
        <ul className="list-disc pl-5 text-xs text-[#4B3F2F]/70 mb-4">
          <li className="font-bold">Note</li>
          <li>You can modify your limit only once per day</li>
          <li>
            The maximum limit that can be requested via net Banking is ₹
            50,00,000
          </li>
          <li>
            The limits selected will apply for third party fund transfers across
            VYOMA and other banks.
          </li>
          <li>Limit modification is done at the Bank's discretion.</li>
          <li>
            For updating Beneficiary limits, visit "Manage Beneficiaries"
            section
          </li>
        </ul>
        <div className="btn-div flex">

          <button className="btn btn-secondary flex items-center gap-2 mt-6 ml-5 mb-10 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition">
            <FaPenNib /> Update
          </button>
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

export default FundLimits;
