import * as React from "react";

export const TabSelector = ({ isActive, children, onClick }) => (
  <button
    className={`btn btn-link text-decoration-none text-reset shadow-none bold-text mr-4 px-2 inline-flex items-center py-2 font-medium cursor-pointer whitespace-nowrap tab-button ${
      isActive
        ? "tab-button-selected border-indigo-500 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700"
        : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 focus:text-gray-600 focus:border-gray-300"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);
