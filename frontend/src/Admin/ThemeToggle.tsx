'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Check current theme on mount
  useEffect(() => {
    const adminRoot = document.querySelector('.admin');
    if (adminRoot) {
      setIsDark(adminRoot.classList.contains('dark'));
    }
  }, []);

  const handleClick = () => {
    const adminRoot = document.querySelector('.admin');
    if (!adminRoot) return;

    adminRoot.classList.toggle('dark');
    setIsDark(adminRoot.classList.contains('dark'));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg theme-border theme-surface theme-fade hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-200 text-sm font-medium"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span>{isDark ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
};

export default ThemeToggle;
