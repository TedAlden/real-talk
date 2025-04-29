import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/private/Sidebar';
import TopBar from '../components/private/Topbar';

export default function PrivateLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar>
        {/* Sidebar links will be passed as children */}
      </Sidebar>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <TopBar />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
