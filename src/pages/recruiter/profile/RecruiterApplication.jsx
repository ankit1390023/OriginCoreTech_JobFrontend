import React, { useState } from "react";
import { Search } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";

const applicationsData = [
  {
    name: "Saloni Ahuja",
    location: "Delhi (Open to relocate)",
    experience: "5 months",
    match: "Moderate",
    matchColor: "bg-orange-100 text-orange-600",
    applied: "2 days ago",
  },
  {
    name: "Aman Sharma",
    location: "Delhi (Open to relocate)",
    experience: "9 months",
    match: "High",
    matchColor: "bg-green-100 text-green-600",
    applied: "2 days ago",
  },
  {
    name: "Saloni Ahuja",
    location: "Delhi (Open to relocate)",
    experience: "5 months",
    match: "Moderate",
    matchColor: "bg-orange-100 text-orange-600",
    applied: "2 days ago",
  },
  {
    name: "Aman Sharma",
    location: "Delhi (Open to relocate)",
    experience: "9 months",
    match: "High",
    matchColor: "bg-green-100 text-green-600",
    applied: "2 days ago",
  },
];

const Applications = () => {
  const [search, setSearch] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const filteredApps = applicationsData.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

     <MainLayout>
             <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
               <div className="hidden lg:block flex-grow"></div>
               
    <div className="bg-white rounded-lg shadow-md w-[725px] h-[800px] py-5 px-6 mt-6 flex flex-col gap-5">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-gray-500">Graphic design internship</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {filteredApps.map((app, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            {/* Left Info */}
            <div>
              <h2 className="font-semibold">{app.name}</h2>
              <p className="text-gray-500">{app.location}</p>
              <p className="text-gray-500">
                Total work experience: {app.experience}
              </p>
              <a
                href="#"
                className="text-blue-500 text-sm mt-1 block hover:underline"
              >
                View full application
              </a>
              <p className="text-gray-400 text-sm">
                Applied {app.applied}
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex flex-col items-end gap-2 relative">
              {/* Resume Match */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${app.matchColor}`}
              >
                Resume match: {app.match}
              </span>

              {/* Buttons */}
              <div className="flex gap-2">
                <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition">
                  Not Interested
                </button>
                <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition">
                  Shortlist
                </button>
                <div className="relative">
                  <button
                    className="border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition"
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === index ? null : index)
                    }
                  >
                    More →
                  </button>
                  {/* Dropdown Menu */}
                  {openMenuIndex === index && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow-md w-40 z-10">
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Send Assignment
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Schedule Interview
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Hire
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <aside className="hidden lg:block w-[425px] max-w-[425px] p-2 sticky top-4 h-fit ml-4">
    <RecruiterRightProfile />
</aside>
{/* Right Spacer */}
<div className="hidden lg:block flex-grow "></div>
</div>
</MainLayout>
  );
};

export default Applications;
