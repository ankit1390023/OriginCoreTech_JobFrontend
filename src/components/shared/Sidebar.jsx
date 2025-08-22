import React, { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-white rounded-md shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-[240px] border-r bg-white flex flex-col text-sm overflow-y-auto transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo + Version */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="logo"
              className="h-8 w-8"
            />
            <span className="font-semibold text-blue-700">PFL Product</span>
          </div>
          <span className="text-xs bg-gray-200 rounded px-2 py-0.5">v1.2.8</span>
        </div>

        {/* Profile */}
        <div className="flex items-center px-4 py-3 border-b space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium">Olivia Rhye</p>
            <p className="text-xs text-gray-500">olivia@untitledui.com</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b">
          <input
            type="text"
            placeholder="Search Menu"
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Please enter 3 or more characters
          </p>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {/* Group Heading 1 */}
          <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
            GROUP HEADING
          </p>

          {/* Level-1 Item */}
          <div className="mb-2">
            <button
              onClick={() => toggleMenu("l1")}
              className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-100 font-medium"
            >
              Level-1-Item
              {openMenus["l1"] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenus["l1"] && (
              <div className="ml-4 mt-1 space-y-1">
                {/* Level-2 */}
                <button
                  onClick={() => toggleMenu("l2")}
                  className="flex items-center justify-between w-full px-2 py-1 hover:bg-gray-50"
                >
                  Level-2-Item
                  {openMenus["l2"] ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {openMenus["l2"] && (
                  <div className="ml-4 mt-1 space-y-1 text-gray-600">
                    <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                    <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                    <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Another Level-2 */}
          <div className="mb-2">
            <button
              onClick={() => toggleMenu("l2b")}
              className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-100 font-medium"
            >
              Level-2-Item
              {openMenus["l2b"] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenus["l2b"] && (
              <div className="ml-4 mt-1 space-y-1 text-gray-600">
                <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
              </div>
            )}
          </div>

          {/* Group Heading 2 */}
          <p className="text-xs font-semibold text-gray-500 mb-2 px-2 mt-4">
            GROUP HEADING
          </p>

          {/* Another Level-1 */}
          <div className="mb-2">
            <button
              onClick={() => toggleMenu("l1b")}
              className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-100 font-medium"
            >
              Level-1-Item
              {openMenus["l1b"] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenus["l1b"] && (
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => toggleMenu("l2c")}
                  className="flex items-center justify-between w-full px-2 py-1 hover:bg-gray-50"
                >
                  Level-2-Item
                  {openMenus["l2c"] ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {openMenus["l2c"] && (
                  <div className="ml-4 mt-1 space-y-1 text-gray-600">
                    <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                    <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                    <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Another Level-2 */}
          <div className="mb-2">
            <button
              onClick={() => toggleMenu("l2d")}
              className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-100 font-medium"
            >
              Level-2-Item
              {openMenus["l2d"] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenus["l2d"] && (
              <div className="ml-4 mt-1 space-y-1 text-gray-600">
                <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
                <p className="px-2 py-1 hover:bg-gray-50">Level-3-Item</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
