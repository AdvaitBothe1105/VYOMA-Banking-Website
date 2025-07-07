import UserInfo from '@/app/components/UserInfo'
import { Metadata } from 'next';
import React from 'react'

export const metadata:Metadata = {
  title: "Register | Vyoma Bank",
  description: "Open a new Vyoma Bank account online and start your digital banking journey.",
  keywords: ["Register", "Sign Up", "Vyoma Bank", "Open Account"],
};

const page = () => {
  return (
    <div>
      <UserInfo/>
    </div>
  )
}

export default page
