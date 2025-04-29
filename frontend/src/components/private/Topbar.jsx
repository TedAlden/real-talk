import React from 'react';

export default function TopBar() {
  return (
    <header className="w-full h-16 bg-white shadow-md flex items-center px-6">
      {/* Logo */}
      <img
        src="/logo.svg"
        alt="App Logo"
        className="h-8 w-auto"
      />
    </header>
  );
}
