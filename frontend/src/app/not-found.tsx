'use client';

import { ThemeProvider } from '../Admin/theme';   // adjust path if needed
import ThemeToggle from '../Admin/ThemeToggle';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <header className="flex items-center justify-between px-6 py-4 theme-surface theme-border border-b theme-fade">
            <div className="text-xl font-semibold theme-accent">IanCare Admin</div>
            <ThemeToggle />
          </header>

          <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
            <p className="text-gray-500 mb-8">
              Sorry, the page you’re looking for doesn’t exist or has been moved.
            </p>
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Go Home
            </a>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
