"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Summary from "./Summary";
import RecTransaction from "./RecTransaction";
import LoanInfo from "./LoanInfo";
import DepositInfo from "./DepositInfo";
import InvestInfo from "./InvestInfo";

interface DecodedToken {
  userId: string;
  crn: string;
  iat: number;
  exp: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const res = await fetch("/api/token"); // Create this route below 👇
      const data = await res.json();
      if (data.token) {
        const decoded = jwtDecode<DecodedToken>(data.token);
        setUser(decoded);
        const crn = decoded.crn;
      }
    };
    getToken();
  }, []);

  return (
    <div className="p-6">
      <div className="heading bg-[#D4C8B6] p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-medium w-full text-center">
          Welcome to VYOMA
        </h1>
      </div>
      <main className="content px-4 py-8 space-y-8 font-raleway">
        {user?.crn && <Summary crn={user.crn} />} 
        <RecTransaction />
        <section>
          <LoanInfo />
        </section>
        <section>
          <DepositInfo />
        </section>
        <section>
          <InvestInfo />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
