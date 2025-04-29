import React from 'react';

export default function TopBar() {
  return (
    <header className="w-full h-16 bg-white shadow-md flex items-center px-6">
      {/* Logo */}
      <span className="transition-colors duration-300 text-gray-900 dark:text-white font-bold text-xl">
        RealTalk
      </span>
    </header>
  );
}
