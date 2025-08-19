import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { CiSearch } from "react-icons/ci"; 

const PipelineCandidates = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [candidates] = useState([
    {
      id: 1,
      name: "Saloni Ahuja",
      role: "UI/UX Designer",
      experience: "Fresher",
      applied: "3 days ago",
      status: "Screening",
    },
    {
      id: 2,
      name: "Riya",
      role: "UI/UX Designer",
      experience: "2 years",
      applied: "3 days ago",
      status: "Hired",
    },
    {
      id: 3,
      name: "Saloni Ahuja",
      role: "Developer",
      experience: "Fresher",
      applied: "3 days ago",
      status: "Screening",
    },
    {
      id: 4,
      name: "Shubham",
      role: "Sales",
      experience: "2 years",
      applied: "3 days ago",
      status: "Hired",
    },
  ]);

  const tabs = [
    { label: "All", count: 18 },
    { label: "Applied", count: 8 },
    { label: "Screening", count: 4 },
    { label: "Interview", count: 3 },
    { label: "Offered", count: 1 },
    { label: "Hired", count: 2 },
  ];

  const filteredCandidates = candidates.filter((c) => {
    if (activeTab !== "All" && c.status !== activeTab) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  return (
<MainLayout>
         <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
           <div className="hidden lg:block flex-grow"></div>
            
    <div className="w-[729px] h-[680px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-6 flex flex-col gap-5">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900">Pipeline Candidates</h2>
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
        <span className="absolute right-3 top-2.5 text-gray-400"><CiSearch/></span>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 text-sm flex-wrap">
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

      {/* Candidate List */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {filteredCandidates.map((c) => (
          <div
            key={c.id}
            className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-bold text-gray-800">{c.name}</h3>
              <p className="text-gray-600 text-sm">{c.role}</p>
              <p className="text-gray-500 text-xs">{c.experience}</p>
              <p className="text-gray-400 text-xs">Applied {c.applied}</p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              {c.status === "Screening" && (
                <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                  Awaiting Screening
                </span>
              )}
              {c.status === "Hired" && (
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                  Hired
                </span>
              )}

              <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 text-sm">
                View full application
              </button>
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

export default PipelineCandidates;
