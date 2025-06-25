import React from 'react'

type MainFundProps = {
  onStepChange: (step: "beneficiaries" ) => void;
};

const ManageBeneficiaries: React.FC<MainFundProps> = ({onStepChange}) => {
  return (
    <div>
      <div className="bg-[#FFF8ED] border border-[#D4C8B6] rounded-xl shadow-lg p-8 mb-10">
            <h3 className="text-xl font-bold mb-4 text-[#A47E3B]">
              Manage Beneficiaries
            </h3>
            <div className="mb-4">No beneficiaries to display.</div>
            <button
              className="btn btn-secondary mt-4 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition"
              onClick={() => onStepChange("beneficiaries")}
            >
              Back
            </button>
          </div>
    </div>
  )
}

export default ManageBeneficiaries
