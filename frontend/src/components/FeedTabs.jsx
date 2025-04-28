import { useState } from "react";

/**
 * FeedTabs component - Displays tabs for switching between different feed types
 * 
 * @param {string} activeTab - Currently active tab ID
 * @param {Function} onTabChange - Callback when user switches tabs
 */
function FeedTabs({ activeTab, onTabChange }) {
  // Define available tabs
  const tabs = [
    { id: "following", label: "Following" },
    { id: "trending", label: "Trending" },
    { id: "all", label: "All" }
  ];
  
  return (
    <nav 
      className="mb-4 border-b dark:border-gray-700"
      aria-label="Feed navigation"
    >
      <ul 
        className="flex flex-wrap -mb-px text-sm font-medium text-center"
        role="tablist"
      >
        {tabs.map(tab => (
          <li key={tab.id} className="mr-2">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50`}
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-tab-panel`}
              id={`${tab.id}-tab`}
              type="button"
              role="tab"
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FeedTabs; 