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
              className="btn btn-secondary"
              onClick={() => onStepChange("beneficiaries")}
            >
              Back
            </button>
          </div>
    </div>
  )
}

export default ManageBeneficiaries
