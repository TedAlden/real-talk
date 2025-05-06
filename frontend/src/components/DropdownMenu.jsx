import { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";

/**
 * A dropdown menu that displays a list of actions
 * @param {Object[]} items - Array of menu items with label, action, icon and disabled properties
 */
function DropdownMenu({ items }) {
  // Track dropdown open state
  const [isOpen, setIsOpen] = useState(false);
  // Reference to detect clicks outside dropdown
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button
        onClick={toggleDropdown}
        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Options menu"
      >
        <HiDotsVertical className="h-4 w-4" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700">
          {items.map((item, index) => (
            // Render each menu item
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={item.disabled}
            >
              {/* Optional icon */}
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
