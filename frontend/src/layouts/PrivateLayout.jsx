import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import TopBar from "../components/Topbar";
import { User, House, Users, TrendingUp, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivateLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <div onClick={() => navigate("/")}>
          <SidebarItem icon={<House className="h-6 w-6" />} text="Home" />
        </div>
        <div onClick={() => navigate("/feed")}>
          <SidebarItem
            icon={<TrendingUp className="h-6 w-6" />}
            text="Trending"
          />
        </div>
        <div onClick={() => navigate("/network")}>
          <SidebarItem icon={<Users className="h-6 w-6" />} text="Network" />
        </div>
        <div onClick={() => navigate("/profile/me")}>
          <SidebarItem icon={<User className="h-6 w-6" />} text="Profile" />
        </div>
        <div onClick={() => navigate("/notifications")}>
          <SidebarItem
            icon={<Bell className="h-6 w-6" />}
            text="Notifications"
          />
        </div>
        <div onClick={() => navigate("/settings")}>
          <SidebarItem
            icon={<Settings className="h-6 w-6" />}
            text="Settings"
          />
        </div>
      </Sidebar>

      <div className="flex flex-1 flex-col">
        <TopBar />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
