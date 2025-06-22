import React from "react";
import { FaCircleInfo, FaHandHoldingDollar } from "react-icons/fa6";

const LoanInfo = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Home Loan */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/Home.png"
            alt="Home Loan"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Home Loan</h3>
            <p className="text-sm text-gray-600 flex-1">
              Vyoma Bank offers a diverse range of home loans in India to help
              you achieve your dream of homeownership. Whether you're a
              first-time buyer, upgrading your home, or looking to reduce your
              EMI by transferring your loan, we have tailored solutions to meet
              your needs.
            </p>
          </div>
          <div className="flex gap-10 p-4 border-t">
            <button className="btn btn-primary flex-1 flex items-center gap-2 ml-10">
              <FaCircleInfo /> More Details
            </button>
            <button className="btn btn-primary flex-1 flex items-center gap-2">
              <FaHandHoldingDollar /> Apply Now!!
            </button>
          </div>
        </div>
        {/* Car Loan */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/Car.png"
            alt="Car Loan"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Car Loan</h3>
            <p className="text-sm text-gray-600 flex-1">
              Vyoma Bank offers a wide range of car loans in India to help you
              drive home your dream vehicle. Whether you're buying your first
              car, upgrading to a new model, or refinancing an existing car
              loan, we have personalized solutions to fit your needs.
            </p>
          </div>
          <div className="flex gap-10 p-4 border-t">
            <button className="btn btn-primary flex-1 flex items-center gap-2 ml-10">
              <FaCircleInfo /> More Details
            </button>
            <button className="btn btn-primary flex-1 flex items-center gap-2">
              <FaHandHoldingDollar /> Apply Now!!
            </button>
          </div>
        </div>
        {/* Gold Loan */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/Gold.png"
            alt="Gold Loan"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Gold Loan</h3>
            <p className="text-sm text-gray-600 flex-1">
              Vyoma Bank offers convenient and quick gold loans in India,
              allowing you to unlock the value of your gold without selling it.
              With simple documentation, competitive interest rates, and
              flexible repayment options, our gold loan services cater to your
              immediate financial needs.
            </p>
          </div>
          <div className="flex gap-10 p-4 border-t">
            <button className="btn btn-primary flex-1 flex items-center gap-2 ml-10">
              <FaCircleInfo /> More Details
            </button>
            <button className="btn btn-primary flex-1 flex items-center gap-2">
              <FaHandHoldingDollar /> Apply Now!!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanInfo;
