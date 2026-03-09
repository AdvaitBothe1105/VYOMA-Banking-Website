import { useState } from "react";
import MainFund from "./MainFund";
import OneTimeTransferOptions from "./OneTimeTransferOptions";
import Beneficiaries from "./Beneficiaries";
import AddBeneficiaries from "./AddBeneficiaries";
import ManageBeneficiaries from "./ManageBeneficiaries";
import FundLimits from "./FundLimits";
import FundTransfer from "./FundTransfer";
import RecTransaction from "./RecTransaction";
import { ArrowLeftRight } from "lucide-react";

type FundPageProps = {
  crn: string;
};

export default function FundPage({ crn }: FundPageProps) {
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
    <main className="min-h-screen font-raleway">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 bg-[#A47E3B]/10 rounded-xl">
            <ArrowLeftRight className="w-6 h-6 text-[#A47E3B]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Transfer</h1>
        </div>
        <p className="text-sm text-gray-500 ml-14">Send money, manage beneficiaries, and view transactions</p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {step === "main" && <MainFund onStepChange={setStep} />}
        {step === "oneTime" && <OneTimeTransferOptions onStepChange={setStep} />}
        {step === "beneficiaries" && <Beneficiaries onStepChange={setStep} />}
        {step === "addBeneficiary" && <AddBeneficiaries onStepChange={setStep} />}
        {step === "manageBeneficiary" && <ManageBeneficiaries onStepChange={setStep} />}
        {step === "limits" && <FundLimits onStepChange={setStep} />}
        {step === "transfer" && <FundTransfer crn={crn} onStepChange={setStep} />}

        <RecTransaction crn={crn}/>
      </div>
    </main>
  );
}
