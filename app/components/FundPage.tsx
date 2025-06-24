import { useState } from "react";
import MainFund from "./MainFund";
import OneTimeTransferOptions from "./OneTimeTransferOptions";
import Beneficiaries from "./Beneficiaries";
import AddBeneficiaries from "./AddBeneficiaries";
import ManageBeneficiaries from "./ManageBeneficiaries";
import FundLimits from "./FundLimits";
import FundTransfer from "./FundTransfer";
import RecTransaction from "./RecTransaction";


export default function FundPage() {
  const [step, setStep] = useState<
    | "main"
    | "oneTime"
    | "beneficiaries"
    | "limits"
    | "transfer"
    | "addBeneficiary"
    | "manageBeneficiary"
  >("main");
  
  return (
    <main className="content mx-auto py-16 font-raleway bg-[#3a3a3a] rounded-4xl ">
      <h1 className="text-4xl font-bold mb-8 text-[#fff] text-center">
        Fund Transfer
      </h1>

      {/* Transfer Options */}
      <div className="functions max-w-5xl mx-auto p-6 bg-[#FAF5EE] rounded-xl shadow-lg border border-[#D4C8B6]">
        {step === "main" && <MainFund onStepChange={setStep} />}

        {/* One Time Transfer Options */}
        {step === "oneTime" && <OneTimeTransferOptions onStepChange={setStep} />}

        {/* Beneficiaries Options */}
        {step === "beneficiaries" && <Beneficiaries onStepChange={setStep} />}

        {/* Add Beneficiary */}
        {step === "addBeneficiary" && <AddBeneficiaries onStepChange={setStep} />}

        {/* Manage Beneficiary */}
        {step === "manageBeneficiary" && <ManageBeneficiaries onStepChange={setStep} />}

        {/* Fund Transfer Limits */}
        {step === "limits" && <FundLimits onStepChange={setStep} />}

        {/* One Time Transfer Form */}
        {step === "transfer" && <FundTransfer onStepChange={setStep} />}

        {/* Recent Transactions */}
        <RecTransaction/>
      </div>
    </main>
  );
}
