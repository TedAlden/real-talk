import React from "react";
import Timer from "./Timer";

export default function TopBar() {
  return (
    <>
      <header className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-md dark:bg-gray-800">
        <span className="text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white">
          RealTalk
        </span>
        <span className="items-center w-full bg-white px-6 dark:bg-gray-800">
          <Timer />
        </span>
      </header>
    </>
  );
}
