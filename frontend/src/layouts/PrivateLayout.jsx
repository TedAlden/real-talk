import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "../components/private/Sidebar";
import TopBar from "../components/private/Topbar";
import { User, House, Users, TrendingUp, Bell, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivateLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar>
        {/* Sidebar links will be passed as children */}

        {/* Profile navigation item */}
        <div onClick={() => navigate("/")}>
          <SidebarItem icon={<House className="h-6 w-6" />} text="Home" />
        </div>
        <div>
          <SidebarItem icon={<TrendingUp className="h-6 w-6" />} text="Trending"
          />
        </div>
        <div onClick={() => navigate("/followers")}>
          <SidebarItem icon={<Users className="h-6 w-6" />} text="Network" />
        </div>
        <div onClick={() => navigate("/profile/me")}>
          <SidebarItem icon={<User className="h-6 w-6" />} text="Profile" />
        </div>
        <div onClick={() => navigate("/following")}>
          <SidebarItem
            icon={<Bell className="h-6 w-6" />}
            text="Notifications"
          />
        </div>
      </Sidebar>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
