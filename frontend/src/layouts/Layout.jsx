import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  User,
  House,
  Users,
  TimerReset,
  Bell,
  Settings,
  ShieldBan,
  BookUser,
} from "lucide-react";

import Sidebar, { SidebarItem } from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Alert from "../components/Alert";
import useAlert from "../hooks/useAlert";
import useAuth from "../hooks/useAuth";

export default function PrivateLayout() {
  const [viewer, setViewer] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth.loggedIn) {
      auth.getUser().then((user) => {
        setViewer(user);
      });
    }
  }, [auth]);

  const alert = useAlert({
    thresholds: [601, 301, 181, 61],
    title: "Heads up!",
    color: "info",
  });

  const isAdmin = viewer?.is_admin;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Alert
        show={alert.show}
        onClose={alert.onClose}
        title={alert.title}
        message={alert.message}
        color={alert.color}
      />

      <Sidebar>
      <SidebarItem
          link="/"
          icon={<House className="h-6 w-6" />}
          text="Home"
        />
        <SidebarItem
          link="/feed/latest"
          icon={<TimerReset className="h-6 w-6" />}
          text="Latest"
        />
        <SidebarItem
          link="/feed/following"
          icon={<BookUser className="h-6 w-6" />}
          text="Following"
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

        {isAdmin && (
          <SidebarItem
            link="/admin"
            icon={<ShieldBan className="h-6 w-6" />}
            text="Administration"
          />
        )}
      </Sidebar>
      <div className="flex h-screen flex-1 flex-col">
        <TopBar />
        <main
          id="main-content-scrollable"
          className="flex-1 overflow-auto p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
