// app/layout.tsx
'use client';

import ThemeProvider from '@/Admin/theme/ThemeProvider';
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>   
      <body className="admin font-sans">
        <ThemeProvider>
          <div className="theme-fade transition-colors duration-500 ease-in-out">
            <main className="p-0">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
