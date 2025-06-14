import { HomeCarousel } from '@/app/components/Carousel'
import Features from '@/app/components/Features'
import React from 'react'

const page = () => {
  return (
    <div>
      <HomeCarousel image_src='/Loans.png'/>
      <Features/>
    </div>
  )
}

export default page
