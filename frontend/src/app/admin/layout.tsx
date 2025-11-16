// app/admin/layout.tsx
'use client';

import ThemeProvider from '@/Admin/theme/ThemeProvider';
import "../../styles/globals.css";
import ThemeToggle from '@/Admin/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Wrap all visible UI inside ThemeProvider
    <ThemeProvider>
      <div className="admin font-sans theme-fade transition-colors duration-500 ease-in-out">
        <header className="flex items-center justify-between px-6 py-4 theme-surface theme-border border-b theme-fade">
          <div className="text-xl font-semibold theme-accent">IanCare Admin</div>
          <ThemeToggle />
        </header>

        <main className="p-6">{children}</main>
      </div>
    </ThemeProvider>
  );
}
