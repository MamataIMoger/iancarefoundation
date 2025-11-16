"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./DashboardView";
import ClientManager from "./components/clients";
import BlogManager from "./components/BlogManager";
import GalleryManager from "./components/GalleryManager";
import VolunteerSubmissionsView from "./components/VolunteerSubmissionsView";
import ContactMessagesView from "./components/ContactMessagesView";
import StoriesManager from "./components/stories";
import ConsultRequest from "./components/consult-request";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500">

      {/* FIXED Sidebar (NO WIDTH WRAPPER!) */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto sm:ml-64 transition-all duration-300">
        {activeView === "dashboard" && <DashboardView />}
        {activeView === "clients" && <ClientManager />}
        {activeView === "blog" && <BlogManager />}
        {activeView === "gallery" && <GalleryManager />}
        {activeView === "stories" && <StoriesManager />}
        {activeView === "volunteers" && <VolunteerSubmissionsView />}
        {activeView === "contact" && <ContactMessagesView />}
        {activeView === "Consult-request" && <ConsultRequest />}
      </main>
    </div>
  );
};

export default AdminDashboard;
