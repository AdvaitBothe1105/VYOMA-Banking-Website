import Dashboard from '@/app/components/Dashboard'
import { Metadata } from 'next';
// import Sidebar from '@/app/components/Sidebar'
import React from 'react'

export const metadata:Metadata = {
  title: "Dashboard | Vyoma Bank",
  description: "Your Vyoma Bank account overview, balances, and recent activity.",
  keywords: ["Dashboard", "Account Overview", "Vyoma Bank"],
};
const page = () => {
  return (
    <div>
      <Dashboard/>
    </div>
  )
}

export default page
