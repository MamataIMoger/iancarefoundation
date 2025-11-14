'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './DashboardView';
import ClientManager from './components/clients';
import BlogManager from './components/BlogManager';
import GalleryManager from './components/GalleryManager';
import VolunteerSubmissionsView from './components/VolunteerSubmissionsView';
import ContactMessagesView from './components/ContactMessagesView';
import StoriesManager from './components/stories';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Sidebar (fixed width) */}
      <div className="w-64 flex-shrink-0">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'clients' && <ClientManager />}
        {activeView === 'blog' && <BlogManager />}
        {activeView === 'gallery' && <GalleryManager />}
        {activeView === 'stories' && <StoriesManager />}
        {activeView === 'volunteers' && <VolunteerSubmissionsView />}
        {activeView === 'contact' && <ContactMessagesView />}
      </main>
    </div>
  );
};

export default AdminDashboard;
