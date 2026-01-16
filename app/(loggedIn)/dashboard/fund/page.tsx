"use client";
import FundPage from "@/app/components/FundPage";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

interface DecodedToken {
  userId: string;
  crn: string;
  iat: number;
  exp: number;
}

const page = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const res = await fetch("/api/token"); // Create this route below 👇
      const data = await res.json();
      if (data.token) {
        const decoded = jwtDecode<DecodedToken>(data.token);
        setUser(decoded);
        }
    };
    getToken();
  }, []);

  return (
    <div>
      {user && <FundPage crn={user.crn} />}
    </div>
  );
};

export default page;
