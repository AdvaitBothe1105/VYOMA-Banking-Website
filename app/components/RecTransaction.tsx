import React from "react";
import { FaHandHoldingDollar, FaNewspaper } from "react-icons/fa6";

const RecTransaction = () => {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="flex gap-2">
            <button className="btn btn-primary flex items-center gap-2">
              <FaNewspaper /> Download Statement
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <FaHandHoldingDollar /> Transfer Money
            </button>
          </div>
        </div>
        {/* Add your transaction list here */}
        <div className="mt-4 text-gray-500 italic">No recent transactions.</div>
      </div>
    </div>
  );
};

export default RecTransaction;
