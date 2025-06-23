// import { useState } from "react";
// import {
//   FaMoneyBillTransfer,
//   FaUserCheck,
//   FaNewspaper,
//   FaUserPlus,
//   FaUserTag,
//   FaMoneyCheck,
//   FaHandHoldingDollar,
//   FaPenNib,
// } from "react-icons/fa6";

// const banks = [
//   { value: "", label: "Select Bank" },
//   { value: "VYOMA", label: "VYOMA Bank" },
//   { value: "KOTAK", label: "KOTAK Mahindra Bank" },
//   { value: "SBI", label: "SBI" },
// ];

// export default function FundPage() {
//   const [step, setStep] = useState<
//     | "main"
//     | "oneTime"
//     | "beneficiaries"
//     | "limits"
//     | "transfer"
//     | "addBeneficiary"
//     | "manageBeneficiary"
//   >("main");
//   const [form, setForm] = useState({
//     bank: "",
//     ifsc: "",
//     recipient: "",
//     confirmRecipient: "",
//     amount: "",
//     remarks: "",
//   });
//   const [accMatch, setAccMatch] = useState(true);

//   // Example sender info (replace with real data)
//   const sender = {
//     account_number: "1234567890",
//     account_type: "Savings",
//     balance: "1,00,000",
//   };

//   // Validation
//   const isFormValid =
//     form.bank &&
//     form.ifsc &&
//     form.recipient &&
//     form.confirmRecipient &&
//     form.amount &&
//     form.recipient === form.confirmRecipient &&
//     Number(form.amount) > 0 &&
//     Number(form.amount) <= 50000;

//   return (
//     <main className="content max-w-3xl mx-auto py-8 font-raleway">
//       <h1 className="text-3xl font-bold mb-8 text-center">Fund Management</h1>

//       {/* Transfer Options */}
//       {step === "main" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div
//             className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//             onClick={() => setStep("oneTime")}
//           >
//             <FaMoneyBillTransfer className="text-3xl text-blue-600" />
//             <div className="mt-2 font-semibold">Send Money</div>
//           </div>
//           <div
//             className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//             onClick={() => setStep("beneficiaries")}
//           >
//             <FaUserCheck className="text-3xl text-blue-600" />
//             <div className="mt-2 font-semibold">Beneficiaries</div>
//           </div>
//           <div
//             className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//             onClick={() => setStep("limits")}
//           >
//             <FaNewspaper className="text-3xl text-blue-600" />
//             <div className="mt-2 font-semibold">Fund Transfer Limits</div>
//           </div>
//         </div>
//       )}

//       {/* One Time Transfer Options */}
//       {step === "oneTime" && (
//         <div className="mb-10">
//           <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
//             <div
//               className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//               onClick={() => setStep("transfer")}
//             >
//               <FaMoneyBillTransfer className="text-2xl text-blue-600" />
//               <div className="mt-2 text-center">
//                 One Time Transfer<br />(without adding beneficiaries)
//               </div>
//             </div>
//             <div
//               className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//               onClick={() => setStep("beneficiaries")}
//             >
//               <FaUserCheck className="text-2xl text-blue-600" />
//               <div className="mt-2 text-center">Send to My Beneficiaries</div>
//             </div>
//             <div
//               className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//               onClick={() => setStep("addBeneficiary")}
//             >
//               <FaUserPlus className="text-2xl text-blue-600" />
//               <div className="mt-2 text-center">Add Beneficiaries</div>
//             </div>
//             <div
//               className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//               onClick={() => setStep("main")}
//             >
//               <FaMoneyCheck className="text-2xl text-blue-600" />
//               <div className="mt-2 text-center">Send a Demand Draft</div>
//             </div>
//           </div>
//           <button
//             className="btn btn-secondary mt-4"
//             onClick={() => setStep("main")}
//           >
//             Back
//           </button>
//         </div>
//       )}

//       {/* Beneficiaries Options */}
//       {step === "beneficiaries" && (
//         <div className="mb-10 flex flex-col md:flex-row gap-6 justify-center">
//           <div
//             className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//             onClick={() => setStep("addBeneficiary")}
//           >
//             <FaUserPlus className="text-2xl text-blue-600" />
//             <div className="mt-2 text-center">Add Beneficiaries</div>
//           </div>
//           <div
//             className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg border cursor-pointer hover:scale-105 transition"
//             onClick={() => setStep("manageBeneficiary")}
//           >
//             <FaUserTag className="text-2xl text-blue-600" />
//             <div className="mt-2 text-center">Manage Beneficiaries</div>
//           </div>
//           <button
//             className="btn btn-secondary mt-4"
//             onClick={() => setStep("main")}
//           >
//             Back
//           </button>
//         </div>
//       )}

//       {/* Add Beneficiary */}
//       {step === "addBeneficiary" && (
//         <div className="rounded-xl shadow-lg border p-8 mb-10">
//           <h3 className="text-xl font-bold mb-4 text-blue-600">Add Beneficiary</h3>
//           <form
//             onSubmit={e => {
//               e.preventDefault();
//               alert("Beneficiary added!");
//               setStep("beneficiaries");
//             }}
//           >
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Beneficiary Name</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 placeholder="Enter beneficiary name"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Account Number</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 placeholder="Enter account number"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Bank Name</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 placeholder="Enter bank name"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">IFSC Code</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 placeholder="Enter IFSC code"
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary w-full mt-2">
//               Add Beneficiary
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary w-full mt-2"
//               onClick={() => setStep("beneficiaries")}
//             >
//               Back
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Manage Beneficiary */}
//       {step === "manageBeneficiary" && (
//         <div className="rounded-xl shadow-lg border p-8 mb-10">
//           <h3 className="text-xl font-bold mb-4 text-blue-600">Manage Beneficiaries</h3>
//           <div className="mb-4">No beneficiaries to display.</div>
//           <button
//             className="btn btn-secondary"
//             onClick={() => setStep("beneficiaries")}
//           >
//             Back
//           </button>
//         </div>
//       )}

//       {/* Fund Transfer Limits */}
//       {step === "limits" && (
//         <div className="rounded-xl shadow-lg border p-8 mb-10">
//           <div className="font-bold text-lg mb-2">Manage Fund Transfer Limits</div>
//           <div className="mb-4">RTGS/NEFT/Third party fund transfer limits for your CRN</div>
//           <div className="mb-4">
//             <label className="block font-semibold mb-1">Per Day Limit (₹)</label>
//             <input type="number" className="input input-bordered w-full max-w-xs" placeholder="Enter new limit" />
//             <div className="text-xs mt-1">Existing Limit (₹) 1,000,000</div>
//           </div>
//           <div className="mb-4">
//             <label className="block font-semibold mb-1">Per Transaction Limit (₹)</label>
//             <input type="number" className="input input-bordered w-full max-w-xs" placeholder="Enter new limit" />
//             <div className="text-xs mt-1">Existing Limit (₹) 500,000</div>
//           </div>
//           <ul className="list-disc pl-5 text-xs mb-4">
//             <li className="font-bold">Note</li>
//             <li>You can modify your limit only once per day</li>
//             <li>The maximum limit that can be requested via net Banking is ₹ 50,00,000</li>
//             <li>The limits selected will apply for third party fund transfers across VYOMA and other banks.</li>
//             <li>Limit modification is done at the Bank's discretion.</li>
//             <li>For updating Beneficiary limits, visit "Manage Beneficiaries" section</li>
//           </ul>
//           <button className="btn btn-primary flex items-center gap-2">
//             <FaPenNib /> Update
//           </button>
//           <button
//             className="btn btn-secondary ml-4"
//             onClick={() => setStep("main")}
//           >
//             Back
//           </button>
//         </div>
//       )}

//       {/* One Time Transfer Form */}
//       {step === "transfer" && (
//         <div className="rounded-xl shadow-lg border p-8 mb-10">
//           <h3 className="text-xl font-bold mb-4 text-blue-600">One Time Transfer</h3>
//           <div className="mb-4">
//             <div className="font-semibold">From</div>
//             <div className="text-sm">
//               Account number: <span className="font-mono">{sender.account_number}</span>
//               <br />
//               Account type: {sender.account_type}
//               <br />
//               Balance: ₹{sender.balance}
//             </div>
//           </div>
//           <form
//             onSubmit={e => {
//               e.preventDefault();
//               alert("Transfer submitted!");
//               setStep("main");
//             }}
//           >
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Bank</label>
//               <select
//                 className="input input-bordered w-full"
//                 value={form.bank}
//                 onChange={e => setForm(f => ({ ...f, bank: e.target.value }))}
//                 required
//               >
//                 {banks.map(b => (
//                   <option key={b.value} value={b.value}>
//                     {b.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">IFSC Code</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={form.ifsc}
//                 onChange={e => setForm(f => ({ ...f, ifsc: e.target.value }))}
//                 placeholder="Enter IFSC code"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Recipient Account Number</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={form.recipient}
//                 onChange={e => {
//                   setForm(f => ({ ...f, recipient: e.target.value }));
//                   setAccMatch(form.confirmRecipient === e.target.value);
//                 }}
//                 placeholder="Enter account number"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Confirm Account Number</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={form.confirmRecipient}
//                 onChange={e => {
//                   setForm(f => ({ ...f, confirmRecipient: e.target.value }));
//                   setAccMatch(form.recipient === e.target.value);
//                 }}
//                 placeholder="Re-enter account number"
//                 required
//               />
//               {!accMatch && (
//                 <div className="text-red-600 text-xs mt-1">
//                   Account numbers do not match!
//                 </div>
//               )}
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Amount (upto ₹ 50,000)</label>
//               <input
//                 type="number"
//                 className="input input-bordered w-full"
//                 value={form.amount}
//                 onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
//                 placeholder="Enter amount"
//                 min={1}
//                 max={50000}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-semibold mb-1">Remarks</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={form.remarks}
//                 onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
//                 placeholder="Remarks (optional)"
//               />
//             </div>
//             <button
//               type="submit"
//               className={`btn btn-primary w-full mt-2 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
//               disabled={!isFormValid}
//             >
//               Submit
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary w-full mt-2"
//               onClick={() => setStep("oneTime")}
//             >
//               Back
//             </button>
//           </form>
//           <div className="text-xs mt-4">
//             A total of Rs. 50,000 per day can be transferred through One Time Transfer. Please ensure that the beneficiary account number is correct. As per RBI guidelines, credit to the beneficiary account at another Bank will happen only on the basis of account number provided by you.
//           </div>
//         </div>
//       )}

//       {/* Recent Transactions */}
//       <div className="rounded-xl shadow-lg border p-6 mt-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <h2 className="text-xl font-semibold">Recent Transactions</h2>
//           <div className="flex gap-2">
//             <button className="btn btn-primary flex items-center gap-2">
//               <FaNewspaper /> View Statement
//             </button>
//             <button className="btn btn-primary flex items-center gap-2">
//               <FaHandHoldingDollar /> Transfer Money
//             </button>
//           </div>
//         </div>
//         <div className="mt-4 text-gray-500 italic">
//           No recent transactions.
//         </div>
//       </div>
//     </main>
//   );
// }


import { useState } from "react";
import {
  FaMoneyBillTransfer,
  FaUserCheck,
  FaNewspaper,
  FaUserPlus,
  FaUserTag,
  FaMoneyCheck,
  FaHandHoldingDollar,
  FaPenNib,
} from "react-icons/fa6";

const banks = [
  { value: "", label: "Select Bank" },
  { value: "VYOMA", label: "VYOMA Bank" },
  { value: "KOTAK", label: "KOTAK Mahindra Bank" },
  { value: "SBI", label: "SBI" },
];

export default function FundPage() {
  const [step, setStep] = useState<"main" | "oneTime" | "beneficiaries" | "limits" | "transfer">("main");
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
    <main className="content max-w-3xl mx-auto py-8 font-raleway">
      <h1 className="text-3xl font-bold mb-8 text-[#A47E3B] text-center">Fund Management</h1>

      {/* Transfer Options */}
      {step === "main" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FAF5EE] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => setStep("oneTime")}
          >
            <FaMoneyBillTransfer className="text-3xl text-[#A47E3B]" />
            <div className="mt-2 font-semibold text-[#4B3F2F]">Send Money</div>
          </div>
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FAF5EE] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => setStep("beneficiaries")}
          >
            <FaUserCheck className="text-3xl text-[#A47E3B]" />
            <div className="mt-2 font-semibold text-[#4B3F2F]">Beneficiaries</div>
          </div>
          <div
            className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FAF5EE] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
            onClick={() => setStep("limits")}
          >
            <FaNewspaper className="text-3xl text-[#A47E3B]" />
            <div className="mt-2 font-semibold text-[#4B3F2F]">Fund Transfer Limits</div>
          </div>
        </div>
      )}

      {/* One Time Transfer Options */}
      {step === "oneTime" && (
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
            <div
              className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] cursor-pointer hover:scale-105 transition"
              onClick={() => setStep("transfer")}
            >
              <FaMoneyBillTransfer className="text-2xl text-[#A47E3B]" />
              <div className="mt-2 text-center">One Time Transfer<br />(without adding beneficiaries)</div>
            </div>
            <div className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] opacity-50 cursor-not-allowed">
              <FaUserCheck className="text-2xl text-[#A47E3B]" />
              <div className="mt-2 text-center">Send to My Beneficiaries</div>
            </div>
            <div className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] opacity-50 cursor-not-allowed">
              <FaUserPlus className="text-2xl text-[#A47E3B]" />
              <div className="mt-2 text-center">Add Beneficiaries</div>
            </div>
            <div className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] opacity-50 cursor-not-allowed">
              <FaMoneyCheck className="text-2xl text-[#A47E3B]" />
              <div className="mt-2 text-center">Send a Demand Draft</div>
            </div>
          </div>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => setStep("main")}
          >
            Back
          </button>
        </div>
      )}

      {/* Beneficiaries Options */}
      {step === "beneficiaries" && (
        <div className="mb-10 flex flex-col md:flex-row gap-6 justify-center">
          <div className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] opacity-50 cursor-not-allowed">
            <FaUserPlus className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Add Beneficiaries</div>
          </div>
          <div className="tra-box flex flex-col items-center p-6 rounded-xl shadow-lg bg-[#FFF8ED] border border-[#D4C8B6] opacity-50 cursor-not-allowed">
            <FaUserTag className="text-2xl text-[#A47E3B]" />
            <div className="mt-2 text-center">Manage Beneficiaries</div>
          </div>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => setStep("main")}
          >
            Back
          </button>
        </div>
      )}

      {/* Fund Transfer Limits */}
      {step === "limits" && (
        <div className="bg-[#FAF5EE] border border-[#D4C8B6] rounded-xl shadow-lg p-8 mb-10">
          <div className="font-bold text-lg text-[#4B3F2F] mb-2">Manage Fund Transfer Limits</div>
          <div className="text-[#4B3F2F]/80 mb-4">RTGS/NEFT/Third party fund transfer limits for your CRN</div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Per Day Limit (₹)</label>
            <input type="number" className="input input-bordered w-full max-w-xs" placeholder="Enter new limit" />
            <div className="text-xs mt-1 text-[#4B3F2F]/70">Existing Limit (₹) 1,000,000</div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Per Transaction Limit (₹)</label>
            <input type="number" className="input input-bordered w-full max-w-xs" placeholder="Enter new limit" />
            <div className="text-xs mt-1 text-[#4B3F2F]/70">Existing Limit (₹) 500,000</div>
          </div>
          <ul className="list-disc pl-5 text-xs text-[#4B3F2F]/70 mb-4">
            <li className="font-bold">Note</li>
            <li>You can modify your limit only once per day</li>
            <li>The maximum limit that can be requested via net Banking is ₹ 50,00,000</li>
            <li>The limits selected will apply for third party fund transfers across VYOMA and other banks.</li>
            <li>Limit modification is done at the Bank's discretion.</li>
            <li>For updating Beneficiary limits, visit "Manage Beneficiaries" section</li>
          </ul>
          <button className="btn btn-primary flex items-center gap-2">
            <FaPenNib /> Update
          </button>
          <button
            className="btn btn-secondary ml-4"
            onClick={() => setStep("main")}
          >
            Back
          </button>
        </div>
      )}

      {/* One Time Transfer Form */}
      {step === "transfer" && (
        <div className="bg-[#FAF5EE] border border-[#D4C8B6] rounded-xl shadow-lg p-8 mb-10">
          <h3 className="text-xl font-bold mb-4 text-[#A47E3B]">One Time Transfer</h3>
          <div className="mb-4">
            <div className="font-semibold text-[#4B3F2F]">From</div>
            <div className="text-sm text-[#4B3F2F]/80">
              Account number: <span className="font-mono">{sender.account_number}</span>
              <br />
              Account type: {sender.account_type}
              <br />
              Balance: ₹{sender.balance}
            </div>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              // TODO: Implement secure API call for fund transfer
              alert("Transfer submitted!");
              setStep("main");
            }}
          >
            <div className="mb-4">
              <label className="block font-semibold mb-1">Bank</label>
              <select
                className="input input-bordered w-full"
                value={form.bank}
                onChange={e => setForm(f => ({ ...f, bank: e.target.value }))}
                required
              >
                {banks.map(b => (
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
                className="input input-bordered w-full"
                value={form.ifsc}
                onChange={e => setForm(f => ({ ...f, ifsc: e.target.value }))}
                placeholder="Enter IFSC code"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Recipient Account Number</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.recipient}
                onChange={e => {
                  setForm(f => ({ ...f, recipient: e.target.value }));
                  setAccMatch(form.confirmRecipient === e.target.value);
                }}
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Confirm Account Number</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.confirmRecipient}
                onChange={e => {
                  setForm(f => ({ ...f, confirmRecipient: e.target.value }));
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
              <label className="block font-semibold mb-1">Amount (upto ₹ 50,000)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
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
                className="input input-bordered w-full"
                value={form.remarks}
                onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                placeholder="Remarks (optional)"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full mt-2 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!isFormValid}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary w-full mt-2"
              onClick={() => setStep("oneTime")}
            >
              Back
            </button>
          </form>
          <div className="text-xs text-[#4B3F2F]/70 mt-4">
            A total of Rs. 50,000 per day can be transferred through One Time Transfer. Please ensure that the beneficiary account number is correct. As per RBI guidelines, credit to the beneficiary account at another Bank will happen only on the basis of account number provided by you.
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-[#FAF5EE] border border-[#D4C8B6] rounded-xl shadow-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-[#4B3F2F]">Recent Transactions</h2>
          <div className="flex gap-2">
            <button className="btn btn-primary flex items-center gap-2">
              <FaNewspaper /> View Statement
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <FaHandHoldingDollar /> Transfer Money
            </button>
          </div>
        </div>
        <div className="mt-4 text-[#4B3F2F]/60 italic">
          No recent transactions.
        </div>
      </div>
    </main>
  );
}