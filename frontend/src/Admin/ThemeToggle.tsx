'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    const root = document.querySelector(".admin");

    if (!root) return;

    if (savedTheme === "dark") {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.querySelector(".admin");
    if (!root) return;

    const newTheme = !isDark;

    if (newTheme) {
      root.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    }

    setIsDark(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg theme-border theme-surface theme-fade hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-200 text-sm font-medium"
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span>{isDark ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
};

export default ThemeToggle;
