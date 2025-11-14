"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Image,
  BookOpen,
  Users,
  MessageSquare,
  LogOut,
  HeartPulse,
} from "lucide-react";

type SidebarProps = {
  activeView: string;
  setActiveView: (view: string) => void;
};

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={20} />,
  clients: <HeartPulse size={20} />,
  blog: <FileText size={20} />,
  gallery: <Image size={20} />,
  stories: <BookOpen size={20} />,
  volunteers: <Users size={20} />,
  contact: <MessageSquare size={20} />,
};

const items = [
  { id: "dashboard", label: "Dashboard Overview" },
  { id: "clients", label: "Client Manager" }, 
  { id: "blog", label: "Blog Manager" },
  { id: "gallery", label: "Gallery Manager" },
  { id: "stories", label: "Stories Manager" },
  { id: "volunteers", label: "Volunteer Submissions" },
  { id: "contact", label: "Contact Messages" },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [showPopup, setShowPopup] = useState(false);

  const navItemClass = (view: string) =>
    `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
      activeView === view
        ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`;

  const handleLogout = async () => {
    try {
      // Clear any stored token/session
      localStorage.removeItem("token");

      // Optionally call backend to invalidate session
      fetch("/api/logout", { method: "POST" }).catch(() => {});

      // Show popup
      setShowPopup(true);

      // After 2 seconds, redirect to home page
      setTimeout(() => {
        setShowPopup(false);
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="w-64 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-[4px_0_2px_-2px_rgba(0,0,0,0.3)] transition-all duration-300">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">
          IanCare <span className="text-amber-600">Admin</span>
        </h2>

        {/* Navigation Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={navItemClass(item.id)}
              onClick={() => setActiveView(item.id)}
            >
              {iconMap[item.id]}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-red-600 border border-red-300 hover:bg-red-50 p-2 rounded-lg flex items-center gap-2"
      >
        <LogOut size={20} /> Logout
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center transform transition-all scale-95 hover:scale-100">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-3 shadow-md animate-bounce">
                <LogOut size={28} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Logged Out
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              You have been logged out successfully. Redirecting to home…
            </p>

            {/* Progress bar effect */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-blue-600 h-2 animate-progress"></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;