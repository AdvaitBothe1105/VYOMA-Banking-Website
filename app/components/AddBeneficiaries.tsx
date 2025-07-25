import React from "react";

type MainFundProps = {
  onStepChange: (step: "beneficiaries") => void;
};

const AddBeneficiaries:React.FC<MainFundProps> = ({onStepChange}) => {
  return (
    <div>
      <div className="bg-[#FFF8ED] border border-[#D4C8B6] rounded-xl shadow-lg p-8 mb-10">
        <h3 className="text-xl font-bold mb-4 text-[#A47E3B]">
          Add Beneficiary
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Beneficiary added!");
            onStepChange("beneficiaries");
          }}
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Beneficiary Name</label>
            <input
              type="text"
              className="input input-bordered w-full p-2"
              placeholder="Enter beneficiary name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Account Number</label>
            <input
              type="text"
              className="input input-bordered w-full p-2"
              placeholder="Enter account number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Bank Name</label>
            <input
              type="text"
              className="input input-bordered w-full p-2"
              placeholder="Enter bank name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">IFSC Code</label>
            <input
              type="text"
              className="input input-bordered w-full p-2"
              placeholder="Enter IFSC code"
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary mt-6 mb-10 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition">
            Add Beneficiary
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-6 ml-5 mb-10 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition"
            onClick={() => onStepChange("beneficiaries")}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBeneficiaries;
