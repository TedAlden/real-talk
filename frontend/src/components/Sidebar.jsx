import React, { useContext, createContext, useState, useEffect } from "react";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { DarkThemeToggle } from "flowbite-react";
import { LuLogOut } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getNotificationsById } from "../api/notificationService";
import { NOTIFICATION_UPDATE_EVENT } from "../pages/Notifications";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/landing");
  };

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white dark:bg-gray-800 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div
            className={`overflow-hidden transition-all flex items-center ${
              expanded ? "w-auto ml-2" : "w-0"
            }`}
          >
            <DarkThemeToggle />
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {expanded ? (
              <ChevronFirst className="text-gray-500 dark:text-gray-300" />
            ) : (
              <ChevronLast className="text-gray-500 dark:text-gray-300" />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="flex items-center justify-center p-3">
          <button
            onClick={handleLogout}
            className={`flex h-12 w-full items-center rounded px-3 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 ${
              expanded ? "justify-start" : "justify-center"
            }`}
          >
            <LuLogOut className="h-6 w-6 flex-shrink-0" />
            <span
              className={`overflow-hidden transition-all ${
                expanded ? "ml-3 w-auto" : "w-0"
              }`}
            >
              Sign out
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, alert, link }) {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  const auth = useAuth();
  const isActive =
    link === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(link);
  
  useEffect(() => {
    if (text === "Notifications" && auth.loggedIn) {
      const fetchNotifications = async () => {
        try {
          const user = await auth.getUser();
          if (!user || !user._id) return;
          
          const response = await getNotificationsById(user._id);
          if (response.success !== false) {
            const notifications = Array.isArray(response.data) ? response.data : [];
            setNotificationCount(notifications.length);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      
      fetchNotifications();
      
      const handleNotificationUpdate = (event) => {
        setNotificationCount(event.detail.count);
      };
      
      window.addEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationUpdate);
      
      const interval = setInterval(fetchNotifications, 60000);
      
      return () => {
        window.removeEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationUpdate);
        clearInterval(interval);
      };
    }
  }, [text, auth, location.pathname]);

  return (
    <li
      onClick={() => {
        navigate(link);
      }}
      className={`group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium transition-colors ${
        isActive
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "text-gray-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:bg-gray-700"
      }`}
    >
      <div className="relative">
        {icon}
        {text === "Notifications" && notificationCount > 0 && (
          <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {notificationCount > 99 ? "99+" : notificationCount}
          </div>
        )}
      </div>
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "ml-3 w-52" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 h-2 w-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`invisible absolute left-full ml-6 -translate-x-3 rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-800 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 dark:bg-gray-700 dark:text-gray-300`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
