"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Sidebar from "./components/Sidebar";
import DashboardView from "./DashboardView";
import ClientManager from "./components/clients";
import BlogManager from "./components/BlogManager";
import GalleryManager from "./components/GalleryManager";
import VolunteerSubmissionsView from "./components/VolunteerSubmissionsView";
import ContactMessagesView from "./components/ContactMessagesView";
import StoriesManager from "./components/stories";
import ConsultRequest from "./components/consult-request";
import ChangePasswordForm from "./components/ChangePasswordForm";
import ThemeToggle from "./ThemeToggle";

const AdminDashboard = () => {
  const searchParams = useSearchParams();

  // Read `tab=` from URL, default to "dashboard"
  const tabFromUrl = searchParams.get("tab") || "dashboard";

  const [activeView, setActiveView] = useState(tabFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  /* ---------------------------------------------------
     UPDATE activeView whenever the URL param changes
  --------------------------------------------------- */
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "dashboard";
    setActiveView(currentTab);
  }, [searchParams]);

  /* ---------------------------------------------------
     FETCH LOGGED-IN ADMIN EMAIL
  --------------------------------------------------- */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/admin-me`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (res.ok && data.success) {
          setAdminEmail(data.email);
        }
      } catch (err) {
        console.error("Failed to load admin:", err);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500">

      {/* SIDEBAR */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col sm:ml-64 transition-all duration-300">

        {/* HEADER */}
        <header className="flex items-center justify-end px-6 py-4 theme-surface theme-border border-b theme-fade">
          <ThemeToggle />
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">

          {activeView === "dashboard" && <DashboardView />}
          {activeView === "clients" && <ClientManager />}
          {activeView === "blog" && <BlogManager />}
          {activeView === "gallery" && <GalleryManager />}
          {activeView === "stories" && <StoriesManager />}
          {activeView === "volunteers" && <VolunteerSubmissionsView />}
          {activeView === "contact" && <ContactMessagesView />}
          {activeView === "Consult-request" && <ConsultRequest />}

          {activeView === "change-password" && adminEmail && (
            <ChangePasswordForm email={adminEmail} />
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
