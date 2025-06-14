"use client"
import LoginPage from "@/app/components/Login";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
    const router = useRouter();
  return (
    <div>
        <LoginPage/>
    </div>
  );
};

export default page;
