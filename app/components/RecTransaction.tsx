import React, { useEffect, useState } from "react";
import { Download, ArrowUpRight } from "lucide-react";

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

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-[#A47E3B]" />
        <span className="ml-3 text-sm text-gray-500">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <button className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Download Statement
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="p-10 flex flex-col items-center text-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <ArrowUpRight className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No transactions yet</p>
          <p className="text-gray-400 text-xs mt-1">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 text-gray-600">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 font-mono text-xs text-gray-700">
                    {tx.fromAccount?.account_number}
                  </td>
                  <td className="py-3 px-6 font-mono text-xs text-gray-700">
                    {tx.toAccount?.account_number}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`font-semibold ${
                        crn === tx.fromAccount?.crn
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {crn === tx.fromAccount?.crn ? "-" : "+"}₹{tx.amount}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-500">{tx.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecTransaction;
