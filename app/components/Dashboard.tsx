"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
      }
    };
    getToken();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to VYOMA Dashboard</h1>
      {user ? (
        <p className="mt-2">
          Logged in as CRN: <strong>{user.crn}</strong>
        </p>
      ) : (
        <p>Loading user info...</p>
      )}
      <button
        onClick={async () => {
          await fetch("/logout/api", {
            method: "POST",
          });
          router.push("/signIn") // or use router.push if using useRouter
        }}
      >
        {" "}
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
