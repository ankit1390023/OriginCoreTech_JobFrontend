import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="w-full p-2 border rounded bg-gray-100 text-gray-500 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
