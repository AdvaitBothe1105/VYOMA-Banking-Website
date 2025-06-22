import React from "react";
import { FaHandHoldingDollar } from "react-icons/fa6";

const DepositInfo = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 mt-8">Deposits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fixed Deposit */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/fix.png"
            alt="Fixed Deposit"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Fixed Deposits</h3>
            <p className="text-sm text-gray-600 flex-1">
              VYOMA Bank offers Fixed Deposits (FDs) that provide a secure way
              to grow your savings with attractive interest rates and flexible
              tenure options. Enjoy the safety of guaranteed returns, making FDs
              a reliable choice for risk-averse investors seeking to earn steady
              income over time.
            </p>
          </div>
          <div className="flex p-4 border-t">
            <button className="btn btn-primary flex-1 flex items-center gap-2 justify-center">
              <FaHandHoldingDollar /> Open
            </button>
          </div>
        </div>
        {/* Recurring Deposit */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/recc.png"
            alt="Recurring Deposit"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Recurring Deposits</h3>
            <p className="text-sm text-gray-600 flex-1">
              With VYOMA Bank's Recurring Deposit (RD) scheme, you can
              systematically save a fixed amount every month, earning interest
              similar to an FD. This disciplined approach helps you build a
              substantial corpus over time, making it ideal for achieving your
              financial goals.
            </p>
          </div>
          <div className="flex p-4 border-t">
            <button className="btn btn-primary flex-1 flex items-center gap-2 justify-center">
              <FaHandHoldingDollar /> Open
            </button>
          </div>
        </div>
        {/* Tax-Saving Deposit */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/tax (1).png"
            alt="Tax-Saving Deposit"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Tax-Saving Deposits</h3>
            <p className="text-sm text-gray-600 flex-1">
              VYOMA Bank's Tax-Free Deposit options allow you to earn interest
              without worrying about tax deductions. These deposits are a smart
              choice for those looking to maximize returns while minimizing tax
              liabilities, helping you secure your financial future effectively.
            </p>
          </div>
          <div className="flex p-4 border-t">
            <button className="btn btn-primary flex-1 flex items-center gap-2 justify-center">
              <FaHandHoldingDollar /> Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositInfo;
