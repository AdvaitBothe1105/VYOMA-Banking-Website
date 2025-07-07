import { HomeCarousel } from '@/app/components/Carousel'
import Features from '@/app/components/Features'
import { Metadata } from 'next';
import React from 'react'

export const metadata:Metadata = {
  title: "Personal Loans | Vyoma Bank",
  description: "Apply for personal loans with quick approval and competitive rates at Vyoma Bank.",
  keywords: ["Personal Loans", "Vyoma Bank", "Loans", "Apply Loan"],
};

const page = () => {
  return (
    <div>
      <HomeCarousel image_src='/Loans.png'/>
      <Features/>
    </div>
  )
}

export default page
