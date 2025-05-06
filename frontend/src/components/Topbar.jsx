import React from "react";
import Timer from "./Timer";

/**
 * Top navigation bar with app title and usage timer
 */
export default function TopBar() {
  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <span className="text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white">
          RealTalk
        </span>
        <span className="w-full items-center bg-white px-6 dark:bg-gray-800">
          <Timer />
        </span>
      </header>
    </>
  );
}
