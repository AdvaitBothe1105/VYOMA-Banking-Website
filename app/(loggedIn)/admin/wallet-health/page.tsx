"use client";

import React, { useState } from "react";
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Search,
  Shield,
  Coins,
  Zap,
  RefreshCw,
  Database,
  Link
} from "lucide-react";
import { Metadata } from "next";

interface WalletHealthResponse {
  wallet: string;
  status: "HEALTHY" | "UNHEALTHY";
  checks: {
    walletExists: boolean;
    custodyAvailable: boolean;
    ethGas: "OK" | "LOW";
    vyoReadable: boolean;
  };
  balances: {
    eth: string;
    vyo: string;
  };
}

const WalletHealthPage = () => {
  const [crn, setCrn] = useState("");
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<WalletHealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resyncLoading, setResyncLoading] = useState(false);
  const [resyncAction, setResyncAction] = useState<"SYNC_FROM_CHAIN" | "SYNC_FROM_DB" | null>(null);
  const [resyncResult, setResyncResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crn.trim()) {
      setError("Please enter a CRN");
      return;
    }

    setLoading(true);
    setError(null);
    setHealthData(null);

    try {
      const response = await fetch(`/api/admin/wallet-health?crn=${encodeURIComponent(crn.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to check wallet health");
        return;
      }

      setHealthData(data);
      // Fetch reconciliation logs
      fetchLogs();
    } catch (err: any) {
      setError(err.message || "An error occurred while checking wallet health");
    } finally {
      setLoading(false);
    }
  };

  const handleResync = async (action: "SYNC_FROM_CHAIN" | "SYNC_FROM_DB") => {
    if (!crn.trim() || !healthData) return;

    setResyncLoading(true);
    setResyncAction(action);
    setResyncResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/resync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crn: crn.trim(),
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Resync failed");
        return;
      }

      setResyncResult(data);

      // Refresh health data after resync
      const healthResponse = await fetch(`/api/admin/wallet-health?crn=${encodeURIComponent(crn.trim())}`);
      const healthData = await healthResponse.json();
      if (healthResponse.ok) {
        setHealthData(healthData);
      }

      // Refresh logs after resync
      fetchLogs();
    } catch (err: any) {
      setError(err.message || "An error occurred during resync");
    } finally {
      setResyncLoading(false);
      setResyncAction(null);
    }
  };

  const fetchLogs = async () => {
    if (!crn.trim()) return;

    try {
      const response = await fetch(`/api/admin/reconciliation-logs?crn=${encodeURIComponent(crn.trim())}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
      }
    } catch (err: any) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "HEALTHY") {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "HEALTHY") {
      return "bg-green-100 text-green-800 border-green-300";
    }
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getCheckIcon = (check: boolean) => {
    return check ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Wallet className="w-8 h-8" />
          Wallet Health Check
        </h1>
        <p className="text-gray-600">
          Check the health status of a user's custodial wallet by entering their CRN.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleCheck} className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="crn" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Reference Number (CRN)
            </label>
            <input
              type="text"
              id="crn"
              value={crn}
              onChange={(e) => setCrn(e.target.value)}
              placeholder="Enter CRN (e.g., CRN-123456789)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !crn.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Health
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Health Status Card */}
      {healthData && (
        <div className="space-y-6">
          {/* Overall Status */}
          <div className={`bg-white rounded-lg shadow-md p-6 border-2 ${getStatusColor(healthData.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(healthData.status)}
                <div>
                  <h2 className="text-2xl font-bold">Wallet Status: {healthData.status}</h2>
                  <p className="text-sm mt-1 opacity-80">
                    Wallet Address: <span className="font-mono">{healthData.wallet}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Checks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Health Checks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Wallet Exists</p>
                  <p className="text-sm text-gray-500">On-chain address created</p>
                </div>
                {getCheckIcon(healthData.checks.walletExists)}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Custody Available</p>
                  <p className="text-sm text-gray-500">Private key encrypted and stored</p>
                </div>
                {getCheckIcon(healthData.checks.custodyAvailable)}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">ETH Gas Balance</p>
                  <p className="text-sm text-gray-500">Can pay for transactions</p>
                </div>
                {healthData.checks.ethGas === "OK" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-yellow-600">LOW</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">VYO Readable</p>
                  <p className="text-sm text-gray-500">Token contract accessible</p>
                </div>
                {getCheckIcon(healthData.checks.vyoReadable)}
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Current Balances
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <p className="font-medium text-gray-700">ETH Balance</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {parseFloat(healthData.balances.eth).toFixed(4)} ETH
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {parseFloat(healthData.balances.eth) > 0 ? "Sufficient for gas" : "Needs funding"}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="w-5 h-5 text-purple-600" />
                  <p className="font-medium text-gray-700">VYO Balance</p>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {parseFloat(healthData.balances.vyo).toLocaleString()} VYO
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {parseFloat(healthData.balances.vyo) > 0 ? "Tokens available" : "No tokens"}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Resync Actions */}
          {healthData.status === "UNHEALTHY" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Admin Resync Actions
              </h3>
              <p className="text-gray-600 mb-4">
                Use these actions to resolve wallet health issues. All actions are logged for audit purposes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Link className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Sync from Blockchain</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Update database balance to match on-chain VYO balance. Use when blockchain has the correct state.
                  </p>
                  <button
                    onClick={() => handleResync("SYNC_FROM_CHAIN")}
                    disabled={resyncLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {resyncLoading && resyncAction === "SYNC_FROM_CHAIN" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        Sync DB ← Chain
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-900">Re-mint from Database</h4>
                  </div>
                  <p className="text-sm text-orange-800 mb-3">
                    Mint VYO tokens on-chain to match database balance. <strong>Dev Only</strong> - recovers from Hardhat resets.
                  </p>
                  <button
                    onClick={() => handleResync("SYNC_FROM_DB")}
                    disabled={resyncLoading}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {resyncLoading && resyncAction === "SYNC_FROM_DB" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4" />
                        Mint VYO ← DB
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Resync Result */}
              {resyncResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-900">Resync Completed</h4>
                  </div>
                  <p className="text-green-800 text-sm">{resyncResult.message}</p>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Action: {resyncResult.action}</p>
                    <p>Updated ETH: {resyncResult.balances.eth.toFixed(4)} ETH</p>
                    <p>Updated VYO: {resyncResult.balances.vyo.toLocaleString()} VYO</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {healthData.status === "UNHEALTHY" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recommendations
              </h3>
              <ul className="space-y-2 text-yellow-800">
                {!healthData.checks.walletExists && (
                  <li>• Wallet address is missing. User may need to complete registration.</li>
                )}
                {!healthData.checks.custodyAvailable && (
                  <li>• Private key is missing. This is a critical issue - wallet cannot be used.</li>
                )}
                {healthData.checks.ethGas === "LOW" && (
                  <li>• ETH balance is low. Fund the wallet to enable transactions.</li>
                )}
                {!healthData.checks.vyoReadable && (
                  <li>• Cannot read VYO balance. Check blockchain connection and token contract.</li>
                )}
              </ul>
            </div>
          )}

          {/* Reconciliation Logs */}
          {logs.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Reconciliation Logs (Audit Trail)
                </h3>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showLogs ? "Hide" : "Show"} Logs
                </button>
              </div>

              {showLogs && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chain VYO</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">DB Balance</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ETH Balance</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              log.action === "SYNC_FROM_CHAIN"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {log.action === "SYNC_FROM_CHAIN" ? "DB ← Chain" : "Mint ← DB"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {parseFloat(log.chainVyo).toLocaleString()} VYO
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {parseFloat(log.dbBalance).toLocaleString()} VYO
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {parseFloat(log.ethBalance).toFixed(4)} ETH
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {log.performedBy}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletHealthPage;

