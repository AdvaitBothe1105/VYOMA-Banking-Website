import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Wallet, Send } from "lucide-react";

type MainFundProps = {
  crn: string;
  onStepChange: (step: "oneTime" | "beneficiaries" | "main") => void;
};

const FundTransfer: React.FC<MainFundProps> = ({ onStepChange, crn }) => {
  const [accountData, setAccountData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetch(`/api/account?crn=${crn}`);
      const data = await res.json();
      setAccountData(data);
    };
    fetchAccount();
  }, [crn]);
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

  const isFormValid =
    form.bank &&
    form.ifsc &&
    form.recipient &&
    form.confirmRecipient &&
    form.amount &&
    form.recipient === form.confirmRecipient &&
    Number(form.amount) > 0 &&
    Number(form.amount) <= 50000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountNumber: accountData.account_number,
        toAccountNumber: form.recipient,
        amount: Number(form.amount),
        remarks: form.remarks,
      }),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/fund/success");
    } else {
      router.push(`/fund/error?msg=${encodeURIComponent(data.error || "Transfer failed")}`);
    }
  };

  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
        onClick={() => onStepChange("oneTime")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Send Money
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">One Time Transfer</h3>
          <p className="text-sm text-gray-500 mt-0.5">Transfer up to ₹50,000 per transaction</p>
        </div>

        <div className="p-6">
          {!accountData ? (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-[#A47E3B]" />
              Loading account details...
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm">
                  {error}
                </div>
              )}

              {/* From Account Card */}
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <Wallet className="w-5 h-5 text-[#A47E3B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sending From</p>
                  <p className="font-mono text-sm text-gray-900 mt-0.5">{accountData.account_number}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {accountData.accountType} &middot; Balance: <span className="font-semibold text-gray-700">₹{accountData.balance}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank</label>
                    <select
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                      value={form.bank}
                      onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
                      required
                    >
                      {banks.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                      value={form.ifsc}
                      onChange={(e) => setForm((f) => ({ ...f, ifsc: e.target.value }))}
                      placeholder="e.g. VYOM0000001"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Recipient Account Number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                      value={form.recipient}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, recipient: e.target.value }));
                        setAccMatch(form.confirmRecipient === e.target.value);
                      }}
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Account Number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                      value={form.confirmRecipient}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, confirmRecipient: e.target.value }));
                        setAccMatch(form.recipient === e.target.value);
                      }}
                      placeholder="Re-enter account number"
                      required
                    />
                    {!accMatch && (
                      <p className="text-red-500 text-xs mt-1">Account numbers do not match</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (max ₹50,000)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                        value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                        placeholder="0.00"
                        min={1}
                        max={50000}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#A47E3B]/20 focus:border-[#A47E3B] outline-none transition"
                      value={form.remarks}
                      onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                      placeholder="e.g. Rent payment"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A47E3B] text-white text-sm font-semibold hover:bg-[#8c6a2f] transition-colors ${
                      !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isFormValid}
                  >
                    <Send className="w-4 h-4" />
                    Transfer Now
                  </button>
                </div>
              </form>

              <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                A total of Rs. 50,000 per day can be transferred through One Time Transfer. Please ensure that the beneficiary account number is correct. As per RBI guidelines, credit to the beneficiary account at another Bank will happen only on the basis of account number provided by you.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundTransfer;
