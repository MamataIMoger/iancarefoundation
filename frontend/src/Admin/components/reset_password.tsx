"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router

const ResetPassword: React.FC = () => {
  const router = useRouter(); // ✅ initialize router
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Step 1: Request reset link
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/admin-request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error || "Reset request failed.");
      } else {
        // ✅ Don’t show token, mention expiry
        setMessage("✅ Reset link requested. Please check your email. Link is valid for 1 hour.");
        setStep(2);
      }
    } catch {
      setMessage("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm reset
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/admin-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: token.trim(),
          newPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error || "Reset failed.");
      } else {
        setMessage("✅ Password reset successful. Redirecting to login...");
        setToken("");
        setNewPassword("");

        // ✅ Redirect after short delay
        setTimeout(() => {
          router.push("/admin_login");
        }, 2000);
      }
    } catch {
      setMessage("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F0F4F8] font-['Roboto'] px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-[#004D99] mb-6">
          {step === 1 ? "Reset Password" : "Confirm Reset"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-5 text-left">
            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@iancaress.org"
                required
                className="w-full p-3 border border-[#CCCCCC] rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFC72C] text-[#004D99] font-bold rounded-lg shadow-md hover:bg-[#FFB800] transition disabled:opacity-50"
            >
              {loading ? "Requesting..." : "Request Reset"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmReset} className="space-y-5 text-left">
            {/* Token input */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Reset Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your reset token"
                required
                className="w-full p-3 border border-[#CCCCCC] rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition"
              />
            </div>
            {/* New password input */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New secure password"
                required
                className="w-full p-3 border border-[#CCCCCC] rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFC72C] text-[#004D99] font-bold rounded-lg shadow-md hover:bg-[#FFB800] transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
