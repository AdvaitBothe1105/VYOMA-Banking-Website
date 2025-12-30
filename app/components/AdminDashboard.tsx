"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  CreditCard, 
  ReceiptText, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  Shield,
  DollarSign
} from "lucide-react";

interface User {
  id: string;
  crn: string;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  kycStatus: string | null;
  createdAt: string;
  isAdmin: boolean;
  accounts: Array<{
    account_number: string;
    balance: number;
    accountType: string;
  }>;
}

interface Account {
  account_id: number;
  crn: string;
  accountType: string;
  account_number: string;
  ifsc_code: string;
  balance: number;
  name: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    crn: string;
    kycStatus: string | null;
  };
}

interface Transaction {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  remarks: string | null;
  createdAt: string;
  blockchainHash: string | null;
  fromAccount: {
    account_number: string;
    name: string;
    crn: string;
  };
  toAccount: {
    account_number: string;
    name: string;
    crn: string;
  };
}

interface Stats {
  users: {
    total: number;
    recent: number;
    kyc: {
      pending: number;
      verified: number;
      rejected: number;
    };
  };
  accounts: {
    total: number;
    totalBalance: number;
  };
  transactions: {
    total: number;
  };
}

type Tab = "stats" | "users" | "accounts" | "transactions";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingKyc, setUpdatingKyc] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "accounts") {
      fetchAccounts();
    } else if (activeTab === "transactions") {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data.stats);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/admin/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const data = await res.json();
      setAccounts(data.accounts);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/transactions?limit=50");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateKycStatus = async (crn: string, status: string) => {
    setUpdatingKyc(crn);
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crn, status }),
      });
      if (!res.ok) throw new Error("Failed to update KYC status");
      await fetchUsers();
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingKyc(null);
    }
  };

  const getKycStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { color: string; bgColor: string; icon: React.ReactElement }> = {
      pending: { 
        color: "text-yellow-800", 
        bgColor: "bg-yellow-100 border-yellow-300",
        icon: <Clock size={10} /> 
      },
      verified: { 
        color: "text-green-800", 
        bgColor: "bg-green-100 border-green-300",
        icon: <CheckCircle size={10} /> 
      },
      rejected: { 
        color: "text-red-800", 
        bgColor: "bg-red-100 border-red-300",
        icon: <XCircle size={10} /> 
      },
    };
    const statusInfo = statusMap[status || "pending"] || statusMap.pending;
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border ${statusInfo.bgColor} ${statusInfo.color}`}>
        {statusInfo.icon}
        <span className="capitalize">{status || "pending"}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-[#D4C8B6] border-r-transparent mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-semibold text-red-800">Error</h3>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center gap-2">
            <Shield className="text-[#D4C8B6]" size={20} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Manage users, accounts, and transactions</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-lg mb-4 shadow-sm flex items-center gap-2 text-sm">
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-4 inline-flex gap-1">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === "stats"
                ? "bg-[#D4C8B6] text-gray-800 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <TrendingUp size={16} />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === "users"
                ? "bg-[#D4C8B6] text-gray-800 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <Users size={16} />
            Users
          </button>
          <button
            onClick={() => setActiveTab("accounts")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === "accounts"
                ? "bg-[#D4C8B6] text-gray-800 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <CreditCard size={16} />
            Accounts
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === "transactions"
                ? "bg-[#D4C8B6] text-gray-800 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <ReceiptText size={16} />
            Transactions
          </button>
        </div>
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="text-blue-600" size={18} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.users.total}</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  +{stats.users.recent} new this month
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CreditCard className="text-green-600" size={18} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Accounts</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.accounts.total}</p>
                <p className="text-xs text-gray-500 mt-1">Active accounts</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <DollarSign className="text-yellow-600" size={18} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Balance</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  ₹{Number(stats.accounts.totalBalance).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ReceiptText className="text-purple-600" size={18} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Transactions</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.transactions.total}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">KYC Status Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500 p-2 rounded-lg">
                    <Clock className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-900 mt-0.5">{stats.users.kyc.pending}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-yellow-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.users.kyc.pending / stats.users.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <CheckCircle className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-green-800 uppercase tracking-wide">Verified</h3>
                    <p className="text-3xl font-bold text-green-900 mt-0.5">{stats.users.kyc.verified}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-green-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.users.kyc.verified / stats.users.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <XCircle className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-red-800 uppercase tracking-wide">Rejected</h3>
                    <p className="text-3xl font-bold text-red-900 mt-0.5">{stats.users.kyc.rejected}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-red-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.users.kyc.rejected / stats.users.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">User Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage user accounts and KYC verification</p>
          </div>
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-sm">
              <thead className="bg-[#D4C8B6] sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">CRN</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Account Type</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">KYC Status</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 py-2 text-xs font-mono text-gray-700">{user.crn}</td>
                    <td className="px-3 py-2 text-xs font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        {user.name}
                        {user.isAdmin && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">
                            <Shield size={10} />
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">{user.email}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{user.phone}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{user.accountType}</span>
                    </td>
                    <td className="px-3 py-2 text-xs">{getKycStatusBadge(user.kycStatus)}</td>
                    <td className="px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {user.kycStatus !== "verified" && (
                          <button
                            onClick={() => updateKycStatus(user.crn, "verified")}
                            disabled={updatingKyc === user.crn}
                            className="px-2 py-1 bg-green-500 text-white rounded text-[10px] font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                          >
                            {updatingKyc === user.crn ? (
                              <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <CheckCircle size={10} />
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                        )}
                        {user.kycStatus !== "rejected" && (
                          <button
                            onClick={() => updateKycStatus(user.crn, "rejected")}
                            disabled={updatingKyc === user.crn}
                            className="px-2 py-1 bg-red-500 text-white rounded text-[10px] font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                          >
                            {updatingKyc === user.crn ? (
                              <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <XCircle size={10} />
                                <span>Reject</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === "accounts" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Account Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">View and manage all bank accounts</p>
          </div>
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-sm">
              <thead className="bg-[#D4C8B6] sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Account Number</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Account Holder</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">CRN</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Balance</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">IFSC</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">KYC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {accounts.map((account) => (
                  <tr key={account.account_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 py-2 text-xs font-mono text-gray-700 font-semibold">{account.account_number}</td>
                    <td className="px-3 py-2 text-xs font-semibold text-gray-800">{account.user.name}</td>
                    <td className="px-3 py-2 text-xs text-gray-600 font-mono">{account.crn}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{account.accountType}</span>
                    </td>
                    <td className="px-3 py-2 text-xs font-bold text-gray-800">
                      ₹{Number(account.balance).toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 text-xs font-mono text-gray-600">{account.ifsc_code}</td>
                    <td className="px-3 py-2 text-xs">{getKycStatusBadge(account.user.kycStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
            <p className="text-xs text-gray-500 mt-0.5">View all transactions across the platform</p>
          </div>
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-sm">
              <thead className="bg-[#D4C8B6] sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">From</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">To</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Remarks</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 py-2 text-xs font-mono text-gray-600">#{tx.id}</td>
                    <td className="px-3 py-2 text-xs">
                      <div className="font-semibold text-gray-800">{tx.fromAccount.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{tx.fromAccount.account_number}</div>
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <div className="font-semibold text-gray-800">{tx.toAccount.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{tx.toAccount.account_number}</div>
                    </td>
                    <td className="px-3 py-2 text-xs font-bold text-green-600">
                      ₹{Number(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">
                      {tx.remarks || <span className="text-gray-400 italic text-[10px]">No remarks</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {tx.blockchainHash ? (
                        <span 
                          className="font-mono text-[10px] text-blue-600 hover:text-blue-800 cursor-pointer px-1.5 py-0.5 bg-blue-50 rounded" 
                          title={tx.blockchainHash}
                        >
                          {tx.blockchainHash.slice(0, 10)}...
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

