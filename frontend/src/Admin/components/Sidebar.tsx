"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Users,
  MessageSquare,
  LogOut,
  HeartPulse,
  X,
  Loader2,
} from "lucide-react";

type SidebarProps = {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} />,
  clients: <HeartPulse size={18} />,
  blog: <FileText size={18} />,
  gallery: <ImageIcon size={18} />,
  stories: <BookOpen size={18} />,
  volunteers: <Users size={18} />,
  contact: <MessageSquare size={18} />,
  "Consult-request": <HeartPulse size={18} />,
};

const navItems = [
  { key: "dashboard", label: "Dashboard Overview" },
  { key: "clients", label: "Client Manager" },
  { key: "blog", label: "Blog Manager" },
  { key: "gallery", label: "Gallery Manager" },
  { key: "stories", label: "Stories Manager" },
  { key: "volunteers", label: "Volunteer Submissions" },
  { key: "contact", label: "Contact Messages" },
  { key: "Consult-request", label: "Consult Requests" },
];

export default function Sidebar({
  activeView,
  setActiveView,
  isOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  const performLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/admin-logout", { method: "POST" }).catch(() => {});
      localStorage.removeItem("token");
      setConfirmOpen(false);
      setLogoutPopup(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const navItemClass = (view: string) =>
    `flex items-center gap-3 w-full p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out text-sm
     ${
       activeView === view
         ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold shadow-md scale-[1.02]"
         : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
     }`;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity sm:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r shadow-lg p-5 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-full max-w-[85vw] sm:w-64 sm:max-w-none sm:translate-x-0
        overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300">
            IanCare <span className="text-amber-500">Admin</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 sm:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => {
                    setActiveView(item.key);
                    onClose();
                  }}
                  className={navItemClass(item.key)}
                >
                  <span className="text-gray-500 dark:text-gray-400">{iconMap[item.key]}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="mt-6">
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-60 transition-all duration-300 ease-in-out"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
            <span>{loading ? "Logging out…" : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Confirm Logout Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => !loading && setConfirmOpen(false)}
          />
          <div className="relative z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 animate-slideIn">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={() => !loading && setConfirmOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                onClick={() => !loading && performLogout()}
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                <span>{loading ? "Logging out…" : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Success Popup */}
      {logoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm text-center transform scale-95 animate-slideIn">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-3 shadow-md animate-bounce">
                <LogOut size={28} />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Logged Out
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You have been logged out successfully. Redirecting…
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-blue-600 h-2 animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
