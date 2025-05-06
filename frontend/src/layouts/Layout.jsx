import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  User,
  House,
  Users,
  TrendingUp,
  Bell,
  Settings,
  ShieldBan,
  BookUser,
  Search,
} from "lucide-react";

import Sidebar, { SidebarItem } from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Alert from "../components/Alert";
import useAlert from "../hooks/useAlert";
import useAuth from "../hooks/useAuth";

/**
 * Private layout with sidebar navigation and screen time alerts
 * Handles user authentication and admin features
 */
export default function PrivateLayout() {
  // Auth and user state
  const [viewer, setViewer] = useState(null);
  const auth = useAuth();

  // Load user data on mount
  useEffect(() => {
    if (auth.loggedIn) {
      auth.getUser().then((user) => {
        setViewer(user);
      });
    }
  }, [auth]);

  // Initialize screen time alerts
  const alert = useAlert({
    thresholds: [
      { threshold: 601, message: "10 minutes left" },
      { threshold: 301, message: "5 minutes left" },
      { threshold: 180, message: "3 minutes left" },
      { threshold: 60, message: "1 minute left" },
    ],
    title: "Screen Time Alert:",
    color: "info",
  });

  // Check admin status for additional nav items
  const isAdmin = viewer?.is_admin;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Screen time alert */}
      {alert.show && (
        <div className="fixed left-1/2 top-4 z-50 w-[90%] max-w-xl -translate-x-1/2 transform">
          <Alert
            show={alert.show}
            onClose={alert.onClose}
            title={alert.title}
            message={alert.message}
            color={alert.color}
          />
        </div>
      )}

      {/* Navigation sidebar */}
      <Sidebar>
        <SidebarItem
          link="/search"
          icon={<Search className="h-6 w-6" />}
          text="Search"
        />
        <SidebarItem
          link="/feed/latest"
          icon={<House className="h-6 w-6" />}
          text="Latest"
        />
        <SidebarItem
          link="/feed/following"
          icon={<BookUser className="h-6 w-6" />}
          text="Following"
        />
        <SidebarItem
          link="/trending"
          icon={<TrendingUp className="h-6 w-6" />}
          text="Trending"
        />
        <SidebarItem
          link="/network"
          icon={<Users className="h-6 w-6" />}
          text="Network"
        />

        <div className="my-2 w-full border border-gray-200 dark:border-gray-600" />
        <SidebarItem
          link="/notifications"
          icon={<Bell className="h-6 w-6" />}
          text="Notifications"
        />
        <SidebarItem
          link="/profile/me"
          icon={<User className="h-6 w-6" />}
          text="Profile"
        />
        <SidebarItem
          link="/settings"
          icon={<Settings className="h-6 w-6" />}
          text="Settings"
        />

        {isAdmin && (
          <SidebarItem
            link="/admin"
            icon={<ShieldBan className="h-6 w-6" />}
            text="Administration"
          />
        )}
      </Sidebar>

      {/* Main content area */}
      <div className="flex h-screen flex-1 flex-col">
        <TopBar />
        <main id="main-content-scrollable" className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
