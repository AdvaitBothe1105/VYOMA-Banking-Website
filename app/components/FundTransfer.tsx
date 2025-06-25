import React, { useState } from "react";

type MainFundProps = {
  onStepChange: (step: "oneTime" | "beneficiaries" | "main") => void;
};

const FundTransfer: React.FC<MainFundProps> = ({ onStepChange }) => {
  const banks = [
    { value: "", label: "Select Bank" },
    { value: "VYOMA", label: "VYOMA Bank" },
    { value: "KOTAK", label: "KOTAK Mahindra Bank" },
    { value: "SBI", label: "SBI" },
  ];
  const [form, setForm] = useState({
    bank: "",
    ifsc: "",
    recipient: "",
    confirmRecipient: "",
    amount: "",
    remarks: "",
  });
  const [accMatch, setAccMatch] = useState(true);

  // Example sender info (replace with real data)
  const sender = {
    account_number: "1234567890",
    account_type: "Savings",
    balance: "1,00,000",
  };

  // Validation
  const isFormValid =
    form.bank &&
    form.ifsc &&
    form.recipient &&
    form.confirmRecipient &&
    form.amount &&
    form.recipient === form.confirmRecipient &&
    Number(form.amount) > 0 &&
    Number(form.amount) <= 50000;
  return (
    <div>
      <div className="bg-[#FAF5EE] border border-[#D4C8B6] rounded-xl shadow-lg p-8 mb-10">
        <h3 className="text-xl font-bold mb-4 text-[#000]">
          One Time Transfer
        </h3>
        <div className="mb-4 bg-[#D4C8B6] p-6 rounded-lg w-fit">
          <div className="font-semibold text-[#4B3F2F]">From</div>
          <div className="text-sm text-[#4B3F2F]/80">
            Account number:{" "}
            <span className="font-mono">{sender.account_number}</span>
            <br />
            Account type: {sender.account_type}
            <br />
            Balance: ₹{sender.balance}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: Implement secure API call for fund transfer
            alert("Transfer submitted!");
            onStepChange("main");
          }}
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Bank</label>
            <select
              className="input border-black rounded-lg w-full p-2"
              value={form.bank}
              onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
              required
            >
              {banks.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">IFSC Code</label>
            <input
              type="text"
              className="input w-full p-2 border-black rounded-lg"
              value={form.ifsc}
              onChange={(e) => setForm((f) => ({ ...f, ifsc: e.target.value }))}
              placeholder="Enter IFSC code"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Recipient Account Number
            </label>
            <input
              type="text"
              className="input input-bordered w-full p-2 border-black rounded-lg"
              value={form.recipient}
              onChange={(e) => {
                setForm((f) => ({ ...f, recipient: e.target.value }));
                setAccMatch(form.confirmRecipient === e.target.value);
              }}
              placeholder="Enter account number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Confirm Account Number
            </label>
            <input
              type="text"
              className="input input-bordered w-full p-2 border-black rounded-lg"
              value={form.confirmRecipient}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  confirmRecipient: e.target.value,
                }));
                setAccMatch(form.recipient === e.target.value);
              }}
              placeholder="Re-enter account number"
              required
            />
            {!accMatch && (
              <div className="text-red-600 text-xs mt-1">
                Account numbers do not match!
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Amount (upto ₹ 50,000)
            </label>
            <input
              type="number"
              className="input input-bordered w-full p-2 border-black rounded-lg"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
              placeholder="Enter amount"
              min={1}
              max={50000}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Remarks</label>
            <input
              type="text"
              className="input input-bordered w-full p-2 border-black rounded-lg"
              value={form.remarks}
              onChange={(e) =>
                setForm((f) => ({ ...f, remarks: e.target.value }))
              }
              placeholder="Remarks (optional)"
            />
          </div>
          <button
            type="submit"
            className={`btn btn-secondary mt-6 mb-10 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isFormValid}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-6 ml-5 mb-10 px-6 py-2 rounded-lg bg-[#A47E3B] text-white hover:bg-[#8c6a2f] transition"
            onClick={() => onStepChange("oneTime")}
          >
            Back
          </button>
        </form>
        <div className="text-xs text-[#4B3F2F]/70 mt-4">
          A total of Rs. 50,000 per day can be transferred through One Time
          Transfer. Please ensure that the beneficiary account number is
          correct. As per RBI guidelines, credit to the beneficiary account at
          another Bank will happen only on the basis of account number provided
          by you.
        </div>
      </div>
    </div>
  );
};

export default FundTransfer;
