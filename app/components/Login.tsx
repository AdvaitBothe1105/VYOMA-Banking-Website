"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/signIn/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("✅ Login successful");
      window.location.href = "/dashboard"; // Or wherever you want
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#edeae7]">
      <div
        className={`relative w-full max-w-6xl min-h-[600px] bg-white shadow-xl rounded-3xl overflow-hidden transition-all duration-700 flex ${
          isSignUp ? "flex-row" : ""
        }`}
      >
        {/* Registration Panel */}
        <div className="w-1/2 flex flex-col justify-center items-center p-12 space-y-6">
          <form
            className="w-full max-w-sm space-y-4 text-center"
            onSubmit={handleSubmit}
          >
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome to VYOMA
            </h2>
            <h2 className="text-2xl text-gray-800">Sign In with VYOMA</h2>
            <p className="text-gray-500 text-sm">
              Join us and explore all banking features
            </p>

            <input
              type="text"
              placeholder="CRN or Card Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="w-[10rem] bg-black hover:bg-[#5b5959] text-white py-2 rounded-full shadow cursor-pointer mt-2 mr-4"
            >
              Log In
            </button>
            <button
              type="button"
              className="w-[10rem] bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-full cursor-pointer"
            >
              Back
            </button>
          </form>
        </div>

        {/* Login Panel */}
        <div className="w-1/2 flex flex-col justify-center items-center p-12 space-y-6">
          <form className="w-full max-w-sm space-y-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              Register with VYOMA
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in with your CRN or username
            </p>
            <input
              type="text"
              placeholder="CRN, Username or Card Number"
              required
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-center"
            />
            <Link
              href="/signIn/register"
              className="text-sm text-black hover:underline"
            >
              Don't have an account? Apply now.
            </Link>
            <br />
            <div className="btns"></div>
            <button
              type="submit"
              className="w-[10rem] bg-black hover:bg-[#5b5959] text-white py-2 shadow mt-3 cursor-pointer rounded-full mr-4"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="w-[10rem] bg-gray-500 cursor-pointer hover:bg-gray-600 text-white py-2 rounded-full"
            >
              Back
            </button>
          </form>
        </div>

        {/* Toggle Panel */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-black to-[#46494c] text-white flex flex-col justify-center items-center text-center px-10 
    transform transition-all duration-500 ease-in-out
    ${
      isSignUp
        ? "translate-x-[-100%] rounded-r-full"
        : "translate-x-0 rounded-l-full"
    }`}
        >
          {isSignUp ? (
            <>
              <h1 className="text-3xl font-extrabold mb-2">
                Already Registered?
              </h1>
              <p className="text-sm mb-4">
                Log in to continue banking with VYOMA
              </p>
              <button
                className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-100 transition "
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold mb-2">New to VYOMA?</h1>
              <p className="text-sm mb-4">
                Create an account and manage your finances easily
              </p>
              <button
                className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-100 transition"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
