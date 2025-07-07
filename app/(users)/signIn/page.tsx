import LoginPage from "@/app/components/Login";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Sign In | Vyoma Bank",
  description: "Sign in to your Vyoma Bank account to access digital banking services.",
  keywords: ["Sign In", "Login", "Vyoma Bank"],
};

const page = () => {
  return (
    <div>
        <LoginPage/>
    </div>
  );
};

export default page;
