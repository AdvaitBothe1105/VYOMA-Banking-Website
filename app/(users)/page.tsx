import { CtaSec } from "../components/CtaSec";
import Features from "../components/Features";
import { Metadata } from "next";
import NewsSection from "../components/NewsSection";
import HomeLoanSection from "../components/HomeLoanSection";
import CarLoanSection from "../components/CarLoanSection";
import Hero from "../components/Hero";

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
      <Hero />
      <CtaSec/>
      <NewsSection/>
      <Features/>
      <CarLoanSection/>
      <HomeLoanSection/>
    </div>
  );
}
