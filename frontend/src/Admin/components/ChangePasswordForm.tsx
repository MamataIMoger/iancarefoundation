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
      className="min-h-[90vh] flex justify-center items-center p-8 transition-colors duration-500"
      style={{
        background: "var(--muted)",
        color: "var(--foreground)",
      }}
    >
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md flex flex-col items-center justify-center z-20">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-yellow-400/40 border-t-yellow-500 rounded-full animate-spinRing" />
            <div className="absolute w-10 h-10 bg-yellow-400/20 rounded-full blur-md animate-pulseGlow" />
          </div>
          <p className="text-yellow-600 font-semibold mt-5 animate-pulse">
            Updating password...
          </p>
        </div>
      )}

      <div
        className="relative p-8 rounded-2xl shadow-xl w-full max-w-md border z-10 animate-fadeUp"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <div className="flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 mr-2" style={{ color: "var(--accent)" }} />
          <h2 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            Change Password
          </h2>
        </div>

        <p className="text-sm mb-6 text-center opacity-80">
          Logged in as{" "}
          <strong style={{ color: "var(--accent)" }}>{email}</strong>
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-lg focus:ring-2 outline-none"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                caretColor: "var(--accent)",
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-lg focus:ring-2 outline-none"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                caretColor: "var(--accent)",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center"
            style={{
              background: "#FFC72C",
              color: "#0050A4",
            }}
          >
            {loading ? (
              <>
                <span className="loaderRingSmall mr-3" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {message && (
          <p
            className="mt-5 text-center text-sm font-medium"
            style={{
              color: message.startsWith("✅")
                ? "#22C55E"
                : message.startsWith("⚠️")
                ? "#EAB308"
                : "#EF4444",
            }}
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
