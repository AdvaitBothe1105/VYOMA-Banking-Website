import { FaBolt, FaLock, FaDatabase, FaMoneyBillWave, FaChartLine, FaMobileAlt } from "react-icons/fa";
import Image from "next/image";
import React from "react";

const features = [
  {
    name: "Instant Fund Transfers",
    description: "Send and receive money instantly to any bank account, anytime, anywhere, with zero hidden charges.",
    icon: <FaBolt className="text-indigo-600 w-6 h-6 absolute left-0 top-1" />,
  },
  {
    name: "24/7 Secure Access",
    description: "Access your account and manage your finances securely at any time with advanced encryption and multi-factor authentication.",
    icon: <FaLock className="text-indigo-600 w-6 h-6 absolute left-0 top-1" />,
  },
  {
    name: "Real-Time Balance Updates",
    description: "Stay up-to-date with real-time account balance and transaction notifications, so you’re always in control.",
    icon: <FaChartLine className="text-indigo-600 w-6 h-6 absolute left-0 top-1" />,
  },
  {
    name: "Personalized Insights",
    description: "Get smart insights and spending analytics to help you save more and reach your financial goals faster.",
    icon: <FaMoneyBillWave className="text-indigo-600 w-6 h-6 absolute left-0 top-1" />,
  },
  {
    name: "Minimal fee Savings Account",
    description: "Enjoy a truly free savings account with a minimal balance requirement and no monthly maintenance fees.",
    icon: <FaDatabase className="text-indigo-600 w-6 h-6 absolute left-0 top-1" />,
  },
];

export const CtaSec = () => {
  return (
    <div className="relative overflow-hidden bg-[#edeae7] pt-24 pb-32 sm:pt-32 sm:pb-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600"></h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Your Savings, Simplified
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                With a focus on convenience and accessibility, our platform allows you to manage your finances effortlessly. Whether it's viewing your account balance, transferring funds without fees, or accessing various banking services, everything is just a click away. Plus, with our secure online banking system, you can manage your money on the go, ensuring your savings work for you wherever you are.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    {feature.icon}
                    <dt className="inline font-semibold text-gray-900">
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image src="/Ser.png" width={2432} height={1462} alt="" className="w-4xl h-[30rem] mt-10 max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0"/>
        </div>
      </div>
      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
};