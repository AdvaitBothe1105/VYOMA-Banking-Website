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
  Zap
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
    } catch (err: any) {
      setError(err.message || "An error occurred while checking wallet health");
    } finally {
      setLoading(false);
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
        </div>
      )}
    </div>
  );
};

export default WalletHealthPage;

