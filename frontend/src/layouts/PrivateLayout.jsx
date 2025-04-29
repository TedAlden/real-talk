import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Topbar */}
      <header className="w-full bg-gray-100 dark:bg-gray-700 p-4">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Topbar (Logo + Timer will go here)
        </h1>
      </header>

      {/* Body area: Sidebar + Page */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Sidebar
          </h2>
          {/* Sidebar links will go here */}
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
