"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";

interface Props {
  email: string;
}

const ChangePasswordForm: React.FC<Props> = ({ email }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Theme state that changes on button click
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!currentPassword || !newPassword) {
      setMessage("⚠️ Both fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error || "❌ Password change failed.");
      } else {
        setMessage("✅ Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        // Toggle theme on successful update
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    } catch (err) {
      console.error(err);
      setMessage("🚨 Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[90vh] flex justify-center items-center p-8 transition-colors duration-500 ${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-fadeIn">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-amber-400/40 border-t-amber-500 rounded-full animate-spinRing" />
            <div className="absolute w-10 h-10 bg-amber-400/20 rounded-full blur-md animate-pulseGlow" />
          </div>
          <p className="text-amber-600 font-semibold mt-5 animate-pulse">
            Updating password...
          </p>
        </div>
      )}

      <div
        className={`relative p-8 rounded-2xl shadow-2xl w-full max-w-md border z-10 animate-fadeUp ${
          theme === "light"
            ? "bg-white border-gray-100"
            : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          <Lock
            className={`w-8 h-8 mr-2 ${
              theme === "light" ? "text-[#004D99]" : "text-[#88b0f4]"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === "light" ? "text-[#004D99]" : "text-[#88b0f4]"
            }`}
          >
            Change Password
          </h2>
        </div>

        <p
          className={`text-sm mb-6 text-center ${
            theme === "light" ? "text-gray-600" : "text-gray-300"
          }`}
        >
          Logged in as{" "}
          <strong
            className={`${
              theme === "light" ? "text-[#004D99]" : "text-[#a8c0ff]"
            }`}
          >
            {email}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full p-3 rounded-lg focus:ring-2 ${
                theme === "light"
                  ? "border border-gray-300 focus:border-[#004D99] focus:ring-[#004D99]/30"
                  : "border border-gray-600 bg-gray-700 focus:border-[#88b0f4] focus:ring-[#88b0f4]/40 text-white"
              }`}
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-3 rounded-lg focus:ring-2 ${
                theme === "light"
                  ? "border border-gray-300 focus:border-[#004D99] focus:ring-[#004D99]/30"
                  : "border border-gray-600 bg-gray-700 focus:border-[#88b0f4] focus:ring-[#88b0f4]/40 text-white"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-lg hover:bg-amber-600 transition disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="loaderRingSmall mr-3" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center text-sm font-medium ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <style jsx global>{`
        @keyframes spinRing {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulseGlow {
          0% {
            opacity: 0.5;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }
        .animate-spinRing {
          animation: spinRing 1.2s linear infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 1.8s ease-in-out infinite;
        }
        .loaderRingSmall {
          width: 18px;
          height: 18px;
          border: 3px solid #ffffff40;
          border-top-color: #fff;
          border-radius: 50%;
          animation: spinRing 0.8s linear infinite;
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordForm;
