"use client";
import React from "react";

const DarkModeToggle: React.FC = () => {
  // This is a placeholder. For production, use next-themes or similar.
  return (
    <button
      className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
      onClick={() => alert("Dark mode toggle coming soon! Use your OS or browser setting for now.")}
    >
      Toggle Dark Mode
    </button>
  );
};

export default DarkModeToggle;
