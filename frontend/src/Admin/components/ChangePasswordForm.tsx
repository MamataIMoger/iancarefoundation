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
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error || "❌ Password change failed.");
      } else {
        setMessage("✅ Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
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
      className="relative flex justify-center items-center min-h-[90vh] bg-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ---------- Ring Loader Overlay ---------- */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-20 transition-all animate-fadeIn">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-amber-400/40 border-t-amber-500 rounded-full animate-spinRing shadow-[0_0_15px_#f59e0baa]" />
            <div className="absolute w-10 h-10 bg-amber-400/20 rounded-full blur-md animate-pulseGlow" />
          </div>
          <p className="text-amber-600 font-semibold text-base tracking-wide mt-5 animate-pulse">
            Updating password...
          </p>
        </div>
      )}

      {/* ---------- Password Change Card ---------- */}
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 z-10 animate-fadeUp">
        <div className="flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-[#004D99] mr-2" />
          <h2 className="text-2xl font-bold text-[#004D99]">
            Change Password
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Logged in as <strong className="text-[#004D99]">{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#004D99] focus:ring-2 focus:ring-[#004D99]/30 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-lg hover:bg-amber-600 active:scale-95 transition-all duration-150 disabled:opacity-60 flex items-center justify-center"
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

      {/* ---------- Animations ---------- */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out;
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out;
        }
        .animate-spinRing {
          animation: spinRing 1.2s linear infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 1.6s ease-in-out infinite;
        }
        .loaderRingSmall {
          width: 18px;
          height: 18px;
          border: 3px solid #ffffff50;
          border-top-color: #fff;
          border-radius: 50%;
          animation: spinRing 0.9s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordForm;
