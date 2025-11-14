'use client';

import React from 'react';

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="theme-fade transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
