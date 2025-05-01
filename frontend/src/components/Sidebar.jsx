import React, { useContext, createContext, useState } from "react";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { DarkThemeToggle } from "flowbite-react";
import { LuPower } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SidebarContext = createContext()

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
          {/*}
          <img
            src="https://img.logoipsum.com/243.svg"
            alt="Logo"
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
          />
          */}
          <div
            className={`overflow-hidden transition-all flex items-center ${
              expanded ? "w-auto ml-2" : "w-0"
            }`}
          >
            <DarkThemeToggle />
          </div>
          <button
            onClick={() => setExpanded(curr => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
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

        <div className="border-t flex items-center justify-center p-3">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full h-12 px-3 rounded transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 ${
              expanded ? "justify-start" : "justify-center"
            }`}
            >
            <LuPower className="w-6 h-6 flex-shrink-0" />
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

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-gray-300 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}
