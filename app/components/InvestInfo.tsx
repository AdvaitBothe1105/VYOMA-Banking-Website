import React from "react";
import { FaCircleInfo, FaHandHoldingDollar } from "react-icons/fa6";

const InvestInfo = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 mt-8">Investments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NPS */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/nft.png"
            alt="NPS"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">NPS</h3>
            <p className="text-sm text-gray-600 flex-1">
              VYOMA Bank offers the National Pension System (NPS), a
              government-backed retirement savings scheme that provides a secure
              and flexible way to build a retirement corpus. With tax benefits
              and a choice of investment options, NPS helps you plan for a
              financially stable future.
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
        {/* DEMAT */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/demat.png"
            alt="DEMAT"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">DEMAT</h3>
            <p className="text-sm text-gray-600 flex-1">
              VYOMA Bank's Demat Account allows you to securely hold and manage
              your shares and securities in electronic form. With seamless
              transactions, real-time access to your portfolio, and robust
              security features, our Demat services make investing in the stock
              market convenient and efficient.
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
        {/* Mutual Funds */}
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
          <img
            src="/mutual.png"
            alt="Mutual Funds"
            className="rounded-t-xl h-60 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-2">Mutual Funds</h3>
            <p className="text-sm text-gray-600 flex-1">
              VYOMA Bank offers a wide range of Mutual Fund investment options,
              catering to different risk profiles and financial goals. Whether
              you're looking for growth, income, or tax-saving options, our
              expert-curated mutual funds help you diversify your portfolio and
              achieve your investment objectives.
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

export default InvestInfo;
