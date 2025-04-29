import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Sidebar</h2>
        {/* Sidebar links will go here later */}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-gray-100 dark:bg-gray-700 p-4">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Topbar (Logo + Timer will go here)
          </h1>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
