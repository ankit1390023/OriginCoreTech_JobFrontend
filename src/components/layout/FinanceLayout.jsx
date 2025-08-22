import { useState } from "react";
import Header1 from "../shared/Header1";
import Footer1 from "../shared/Footer1";
import Sidebar from "../shared/Sidebar";
import { Menu, X } from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 z-50 border-r bg-white transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content wrapper */}
      <div className="flex flex-col min-h-screen md:ml-72 ml-32 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b flex items-center justify-between p-2">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Actual Header */}
          <div className="flex-1">
            <Header1 />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>

       {/* Footer (stick at bottom inside layout) */}
        <div className="sticky bottom-5 z-40 bg-white border-t ml-10 md:ml-72 overflow-y-auto"> <Footer1 /> </div>
      </div>
    </div>
  );
}
