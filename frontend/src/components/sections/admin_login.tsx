//frontend/src/components/sections/admin-login.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorPopup(null);

    if (!email.trim() || !password) {
      setErrorPopup("Missing fields");
      setLoading(false);
      return;
    }

    try {
          const res = await fetch("/api/admin/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });


      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorPopup(data?.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setErrorPopup("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 font-['Roboto'] px-4 transition-colors duration-300">
      <div className="text-center mb-10">
        <Image
          src="/ian-cares-logo.jpeg"
          alt="Ian Cares Foundation Logo"
          width={80}
          height={80}
          className="mx-auto mb-3 rounded-full shadow-md"
        />
        <div className="text-xl font-bold text-[#004D99] dark:text-blue-200 uppercase leading-tight">
          IAN CARES <br /> FOUNDATION
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md sm:max-w-sm transition-colors duration-300">
        <h2 className="text-2xl font-bold text-[#333333] dark:text-white mb-6 text-center">
          Admin Portal Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-[#333333] dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iancaress.org"
              required
              className="w-full p-3 bg-white dark:bg-gray-700 border border-[#CCCCCC] dark:border-gray-600 rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] dark:text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin@123"
              required
              className="w-full p-3 bg-white dark:bg-gray-700 border border-[#CCCCCC] dark:border-gray-600 rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FFC72C] text-[#004D99] font-bold rounded-lg shadow-md hover:bg-[#FFB800] active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>

          <div className="flex justify-between items-center mt-2">
            <Link
              href="/"
              className="text-sm text-[#004D99] dark:text-blue-300 hover:underline"
            >
              back to Home
            </Link>

            <Link
              href="/reset_password"
              className="text-sm text-[#004D99] dark:text-blue-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>

      {errorPopup && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setErrorPopup(null)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold mb-3 text-red-600">Login Error</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-6">{errorPopup}</p>
              <button
                onClick={() => setErrorPopup(null)}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
