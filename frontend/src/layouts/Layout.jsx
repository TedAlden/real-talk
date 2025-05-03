import React from "react";
import { Outlet } from "react-router-dom";
import { User, House, Users, TrendingUp, Bell, Settings } from "lucide-react";

import Sidebar, { SidebarItem } from "../components/Sidebar";
import TopBar from "../components/Topbar";

export default function PrivateLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <SidebarItem
          link="/"
          icon={<House className="h-6 w-6" />}
          text="Home"
        />
        <SidebarItem
          link="/feed"
          icon={<TrendingUp className="h-6 w-6" />}
          text="Trending"
        />
        <SidebarItem
          link="/network"
          icon={<Users className="h-6 w-6" />}
          text="Network"
        />
        <SidebarItem
          link="/profile/me"
          icon={<User className="h-6 w-6" />}
          text="Profile"
        />
        <SidebarItem
          link="/notifications"
          icon={<Bell className="h-6 w-6" />}
          text="Notifications"
        />
        <SidebarItem
          link="/settings"
          icon={<Settings className="h-6 w-6" />}
          text="Settings"
        />
      </Sidebar>
      <div className="flex h-screen flex-1 flex-col">
        <TopBar />
        <main id="main-content-scrollable" className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
