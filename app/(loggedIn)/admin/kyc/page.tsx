"use client";

import React, { useState } from "react";
import {
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  Shield,
  Eye,
  Check,
  ExternalLink
} from "lucide-react";

interface UserKYCData {
  crn: string;
  name: string;
  onchainAddress: string;
  kycStatus: string;
  aadharUrl: string;
  panUrl: string;
}

interface BlockchainStatus {
  isVerified: boolean;
  loading: boolean;
}

const KYCAdminPage = () => {
  const [crn, setCrn] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserKYCData | null>(null);
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus>({ isVerified: false, loading: false });
  const [error, setError] = useState<string | null>(null);
  const [attesting, setAttesting] = useState(false);
  const [attestResult, setAttestResult] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crn.trim()) {
      setError("Please enter a CRN");
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setBlockchainStatus({ isVerified: false, loading: false });
    setAttestResult(null);

    try {
      // Fetch user data
      const userResponse = await fetch(`/api/admin/kyc/user?crn=${encodeURIComponent(crn.trim())}`);
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setError(userData.error || "Failed to fetch user data");
        return;
      }

      setUserData(userData);

      // Check blockchain verification status
      if (userData.onchainAddress) {
        setBlockchainStatus({ isVerified: false, loading: true });
        try {
          const blockchainResponse = await fetch(`/api/admin/kyc/blockchain-status?address=${userData.onchainAddress}`);
          const blockchainData = await blockchainResponse.json();

          if (blockchainResponse.ok) {
            setBlockchainStatus({ isVerified: blockchainData.isVerified, loading: false });
          } else {
            setBlockchainStatus({ isVerified: false, loading: false });
          }
        } catch (err) {
          setBlockchainStatus({ isVerified: false, loading: false });
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const handleAttest = async () => {
    if (!userData) return;

    setAttesting(true);
    setAttestResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/kyc/attest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crn: userData.crn,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Attestation failed");
        return;
      }

      setAttestResult(data);
      // Refresh user data and blockchain status
      await handleSearch({ preventDefault: () => {} } as any);
    } catch (err: any) {
      setError(err.message || "An error occurred during attestation");
    } finally {
      setAttesting(false);
      setShowConfirmModal(false);
    }
  };

  const canAttest = userData &&
    userData.kycStatus === "pending" &&
    userData.onchainAddress &&
    !blockchainStatus.isVerified &&
    !blockchainStatus.loading;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8" />
          KYC Verification Admin
        </h1>
        <p className="text-gray-600">
          Verify user KYC status and record verification on blockchain.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
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
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search User
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

      {/* User Information */}
      {userData && (
        <div className="space-y-6">
          {/* User Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">CRN</p>
                  <p className="text-lg font-semibold text-gray-900">{userData.crn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{userData.name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                  <p className="text-sm font-mono text-gray-900 bg-gray-100 p-2 rounded">
                    {userData.onchainAddress || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">KYC Status</p>
                  <div className="flex items-center gap-2">
                    {userData.kycStatus === "verified" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userData.kycStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {userData.kycStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              KYC Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Aadhaar Card</h4>
                  <button
                    onClick={() => window.open(userData.aadharUrl, '_blank')}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
                <p className="text-sm text-gray-500">Document uploaded by user</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">PAN Card</h4>
                  <button
                    onClick={() => window.open(userData.panUrl, '_blank')}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
                <p className="text-sm text-gray-500">Document uploaded by user</p>
              </div>
            </div>
          </div>

          {/* Blockchain Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Blockchain Verification Status
            </h3>
            <div className="flex items-center gap-4">
              {blockchainStatus.loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-gray-600">Checking blockchain...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {blockchainStatus.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={blockchainStatus.isVerified ? "text-green-700" : "text-red-700"}>
                    {blockchainStatus.isVerified ? "Verified on Blockchain" : "Not Verified on Blockchain"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Attestation Action */}
          {canAttest && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" />
                KYC Attestation
              </h3>
              <p className="text-gray-600 mb-4">
                This action will permanently record the user's KYC verification on the blockchain.
                This cannot be undone.
              </p>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={attesting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {attesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Attesting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Verify KYC on Blockchain
                  </>
                )}
              </button>

              {/* Attestation Result */}
              {attestResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-900">KYC Attested Successfully</h4>
                  </div>
                  <p className="text-green-800 text-sm mb-2">Transaction recorded on blockchain</p>
                  <a
                    href={`https://etherscan.io/tx/${attestResult.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Transaction
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Status Messages */}
          {userData.kycStatus === "verified" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-800">This user's KYC has already been verified.</p>
              </div>
            </div>
          )}

          {blockchainStatus.isVerified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <p className="text-blue-800">This user is already verified on the blockchain.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm KYC Attestation</h3>
            <p className="text-gray-600 mb-4">
              This action will permanently record KYC verification for <strong>{userData?.name}</strong> on the blockchain.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAttest}
                disabled={attesting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {attesting ? "Attesting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCAdminPage;