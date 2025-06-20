"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Lucide icons
import {
  LayoutDashboard,
  Banknote,
  ReceiptText,
  CreditCard,
  TrendingUp,
  Home,
  LifeBuoy,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DecodedToken {
  userId: string;
  crn: string;
  iat: number;
  exp: number;
}

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    accountType: string;
  } | null>(null);

  const crn = user?.crn;

  useEffect(() => {
    const getToken = async () => {
      const res = await fetch("/api/token"); // Create this route below 👇
      const data = await res.json();
      if (data.token) {
        const decoded = jwtDecode<DecodedToken>(data.token);
        setUser(decoded);

        const userRes = await fetch(`/api/user?crn=${decoded.crn}`);
        const userData = await userRes.json();
        setUserData(userData);
      }
    };
    getToken();
  }, []);

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] bg-black flex flex-col p-6 pr-0 overflow-hidden">
      <div className="flex items-center justify-center mb-6">
        <Image
          src="/Logo.png"
          alt="logo"
          width={100}
          height={100}
          className="rounded-lg"
        />
      </div>

      <ul className="flex-1 overflow-y-auto space-y-2">
        <h4 className="text-white text-lg font-medium my-2 relative">
          <span className="bg-[#edeae7] p-2 rounded-xl text-black">
            Main Menu
          </span>
        </h4>

        <li>
          <Link
            href="/Services"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <LayoutDashboard size={20} /> Home
          </Link>
        </li>
        <li>
          <Link
            href="/fund"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <Banknote size={20} /> Fund Transfer
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <ReceiptText size={20} /> Statements
          </Link>
        </li>
        <li>
          <Link
            href="/coming"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <CreditCard size={20} /> Cards
          </Link>
        </li>
        <li>
          <Link
            href="/Investments"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <TrendingUp size={20} /> Investments
          </Link>
        </li>
        <li>
          <Link
            href="/coming"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <Home size={20} /> Loans
          </Link>
        </li>

        <h4 className="text-white text-lg font-medium my-2 relative">
          <span className=" bg-[#edeae7] p-2 rounded-xl text-black">
            Services
          </span>
        </h4>
        <li>
          <Link
            href="/requests"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <LifeBuoy size={20} /> Service Requests
          </Link>
        </li>

        <h4 className="text-white text-lg font-medium my-2 relative">
          <span className="bg-[#edeae7] p-2 rounded-xl text-black">
            Account
          </span>
        </h4>
        <li>
          <Link
            href="#"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <User size={20} /> Profile
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded w-[90%]"
          >
            <Settings size={20} /> Settings
          </Link>
        </li>
        <li>
          <button
            id="logout"
            className="w-[90%] text-left flex items-center gap-4 text-white font-medium p-2 hover:bg-white hover:text-black rounded"
            onClick={async () => {
              await fetch("/logout/api", {
                method: "POST",
              });
              router.push("/signIn"); // or use router.push if using useRouter
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </li>
      </ul>

      <div className=" bg-white rounded p-1 ml-3 w-[80%]">
        <div className="flex items-center">
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <svg
              className="absolute w-12 h-12 text-black -left-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          <div className="ml-4 whitespace-nowrap">
            <h3
              id="welcome-message"
              className="text-base font-semibold text-gray-800"
            >
              {userData?.name}
            </h3>
            <span
              id="account_number"
              className="text-sm font-semibold text-gray-800"
            >
              {crn}
            </span>
            <br />
            <span
              id="account-type-display"
              className="text-sm font-semibold text-gray-800"
            >
              {userData?.accountType}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
