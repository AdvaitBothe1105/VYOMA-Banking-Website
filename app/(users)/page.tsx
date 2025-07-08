// import { Carousel } from "@/components/ui/carousel";
import Image from "next/image";
import { HomeCarousel } from "../components/Carousel";
import { CtaSec } from "../components/CtaSec";
import Features from "../components/Features";
import { Metadata } from "next";
import NewsSection from "../components/NewsSection";
import HomeLoanSection from "../components/HomeLoanSection";
import { Car } from "lucide-react";
import CarLoanSection from "../components/CarLoanSection";

export const metadata: Metadata = {
  title: "Vyoma Bank - Modern Digital Banking",
  description: "Vyoma Bank offers secure, fast, and modern digital banking services including fund transfers, loans, investments, and more.",
  keywords: ["Vyoma Bank", "Digital Banking", "Fund Transfer", "Loans", "Investments", "KYC"],
  icons:{
    icon: '/favicon.png',
  }
};

export default function Home() {
  return (
    <div className="bg-white">
      <HomeCarousel image_src='/Ad-1.png'/>
      <CtaSec/>
      <NewsSection/>
      <Features/>
      <CarLoanSection/>
      <HomeLoanSection/>
    </div>
  );
}
