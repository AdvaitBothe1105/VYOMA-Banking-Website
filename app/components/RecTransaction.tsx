import React, { useEffect, useState } from "react";
import { FaHandHoldingDollar, FaNewspaper } from "react-icons/fa6";
interface Props {
  crn: string;
}

const RecTransaction = ({ crn }: Props) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/recTransaction?crn=${crn}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        setError("Failed to fetch transactions");
      }
      setLoading(false);
    };
    if (crn) fetchTransactions();
  }, [crn]);
  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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
        <div className="mt-4">
          {loading ? (
            <div>Loading transactions...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-gray-500 italic">No recent transactions.</div>
          ) : (
            <table className="min-w-full text-sm mt-2">
              <thead>
                <tr className="bg-[#FAF5EE] text-[#4B3F2F]">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">From</th>
                  <th className="py-2 px-4 text-left">To</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b">
                    <td className="py-2 px-4">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 font-mono">
                      {tx.fromAccount?.account_number}
                    </td>
                    <td className="py-2 px-4 font-mono">
                      {tx.toAccount?.account_number}
                    </td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        crn === tx.fromAccount?.crn
                          ? "text-red-600"
                          : "text-green-700"
                      }`}
                    >
                      {crn === tx.fromAccount?.crn ? "-" : "+"}₹{tx.amount}
                    </td>
                    <td className="py-2 px-4">{tx.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecTransaction;
