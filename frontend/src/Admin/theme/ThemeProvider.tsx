'use client';

import React, { useEffect, useState } from 'react';

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  // Ensure theme variables work AFTER dark mode class is applied
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "100vh" }}>{children}</div>;
  }

  return (
    <div
      className="theme-fade transition-colors duration-500 ease-in-out min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
