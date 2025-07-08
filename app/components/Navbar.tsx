"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-[#222a32] border-b border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              width={105}
              height={24}
              alt="VYOMA Logo"
              className="object-contain rounded-2xl"
            />
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/signIn"
              className="text-base font-medium text-gray-200 hover:text-white px-4 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/signIn/register"
              className="bg-[#EDEAE7] text-black px-5 py-2 rounded-lg text-base font-semibold shadow hover:bg-[#e1d9c9] transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};