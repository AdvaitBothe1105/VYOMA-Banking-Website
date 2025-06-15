"use client";
import React, { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

const OnlineKYC = () => {
    const router = useRouter();
  const { userData } = useUserStore();
  const [aadhar, setAadhar] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [status, setStatus] = useState("");




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aadhar || !pan) {
      alert("Please upload both Aadhaar and PAN card");
      return;
    }
    
      function generateCRN(): string {
    const randomPart = Math.floor(100000000 + Math.random() * 900000000);
    return `CRN-${randomPart}`;
  }
 const crn = generateCRN();

        
    const formData = new FormData();
    formData.append("aadhar", aadhar);
    formData.append("pan", pan);
    formData.append("crn",crn);

    // If you're passing other fields like email, append here:
    // formData.append("email", "user@example.com");

    setStatus("Uploading...");
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const res = await fetch("/signIn/register/api", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setStatus("KYC submitted successfully ✅");
        router.push(`/signIn/register/kyc/success?crn=${crn}`)
      } else {
        setStatus("Failed to upload: " + result.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#f0e8de] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6 border border-gray-200"
        encType="multipart/form-data"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-1">Online KYC</h2>
          <p className="text-sm text-gray-500">
            Securely upload your documents
          </p>
        </div>

        {/* Aadhaar Upload */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Upload Aadhaar Card
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setAadhar(e.target.files?.[0] || null)}
            required
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-semibold
                 file:bg-[#E2D4B7] file:text-black
                   hover:file:bg-[#e1d9c9]"
          />
          {aadhar && (
            <p className="text-xs text-gray-600 mt-1 italic">
              Selected: {aadhar.name}
            </p>
          )}
        </div>

        {/* PAN Upload */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Upload PAN Card
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setPan(e.target.files?.[0] || null)}
            required
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-semibold
                   file:bg-[#E2D4B7] file:text-black
                    hover:file:bg-[#e1d9c9]"
          />
          {pan && (
            <p className="text-xs text-gray-600 mt-1 italic">
              Selected: {pan.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-[#46494c] text-white font-semibold rounded-lg shadow hover:bg-[#5b5f63] transition duration-300 cursor-pointer"
        >
          Submit KYC
        </button>

        {/* Status Message */}
        {status && (
          <div className="text-sm text-center mt-2 text-green-600 font-medium">
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default OnlineKYC;
