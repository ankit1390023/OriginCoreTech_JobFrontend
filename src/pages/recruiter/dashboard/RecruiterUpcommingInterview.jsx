import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";    

const UpcomingInterviews = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [interviews] = useState([
    {
      id: 1,
      name: "Saloni Ahuja",
      role: "UI/UX Designer",
      mode: "Zoom",
      date: null,
      status: "Pending",
    },
    {
      id: 2,
      name: "Riya",
      role: "UI/UX Designer",
      mode: "Zoom",
      date: "11/04/25, 9:30 a.m.",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Saloni Ahuja",
      role: "UI/UX Designer",
      mode: "Zoom",
      date: null,
      status: "Pending",
    },
    {
      id: 4,
      name: "Riya",
      role: "UI/UX Designer",
      mode: "Zoom",
      date: "11/04/25, 5:30 a.m.",
      status: "Confirmed",
    },
  ]);

  const tabs = [
    { label: "All", count: 18 },
    { label: "Today", count: 8 },
    { label: "This week", count: 4 },
  ];

  const filteredInterviews = interviews.filter((i) => {
    if (activeTab !== "All") {
      // Here you can add filtering logic for Today/This Week
      return true;
    }
    if (searchTerm && !i.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  return (
       <MainLayout>
             <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
               <div className="hidden lg:block flex-grow"></div>
             
    <div className="w-[729px] h-[635px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-10 flex flex-col gap-5">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900">Upcoming Interviews</h2>
      <p className="text-gray-500">Lorem Ipsum</p>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-3 py-1 rounded-full border ${
              activeTab === tab.label
                ? "bg-blue-100 text-blue-600 border-blue-400"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Interview List */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {filteredInterviews.map((i) => (
          <div
            key={i.id}
            className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-bold text-gray-800">{i.name}</h3>
              <p className="text-gray-600 text-sm">{i.role}</p>
              <p className="text-gray-500 text-xs">Mode: {i.mode}</p>
              {i.date ? (
                <p className="text-gray-500 text-xs">{i.date}</p>
              ) : (
                <p className="text-gray-400 text-xs">Pending</p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-end">
              {i.status === "Pending" && (
                <>
                  <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                    Reschedule pending
                  </span>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 text-sm">
                    View details
                  </button>
                </>
              )}

              {i.status === "Confirmed" && (
                <>
                  <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                    Confirmed
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 text-sm">
                    Join now
                  </button>
                </>
              )}
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

export default UpcomingInterviews;
