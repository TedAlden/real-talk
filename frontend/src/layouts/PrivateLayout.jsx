import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/private/Sidebar';
import TopBar from '../components/private/Topbar';
import { User, House, Users, TrendingUp, Bell, Power } from 'lucide-react';

export default function PrivateLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar>
        {/* Sidebar links will be passed as children */}

        {/* Profile navigation item */}
        <SidebarItem icon={<House className="w-6 h-6" />} text="Home" />
        <SidebarItem icon={<TrendingUp className="w-6 h-6" />} text="Trending" />
        <SidebarItem icon={<Users className="w-6 h-6" />} text="Network" />
        <SidebarItem icon={<User className="w-6 h-6" />} text="Profile" />
        <SidebarItem icon={<Bell className="w-6 h-6" />} text="Notifications" />
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
