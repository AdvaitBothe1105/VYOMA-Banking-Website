import OnlineKYC from '@/app/components/OnlineKYC'
import { Metadata } from 'next';
import React from 'react'

export const metadata:Metadata = {
  title: "Online KYC | Vyoma Bank",
  description: "Complete your KYC online to unlock all features of Vyoma Bank.",
  keywords: ["KYC", "Online KYC", "Vyoma Bank", "Verification"],
};

const page = () => {
  return (
    <div>
      <OnlineKYC/>
    </div>
  )
}

export default page
