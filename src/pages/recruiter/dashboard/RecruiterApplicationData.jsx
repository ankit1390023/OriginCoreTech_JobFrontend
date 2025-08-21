import React, { useState } from "react";
import { Search } from "lucide-react";


const applicationsData = [
  {
    name: "Saloni Ahuja",
    location: "Delhi (Open to relocate)",
    experience: "5 months",
    match: "Moderate",
    matchColor: "bg-orange-100 text-orange-600",
    cardBg: "bg-red-50",
    applied: "2 days ago",
    onClick: () => console.log("Application clicked"),
  },
  {
    name: "Aman Sharma",
    location: "Delhi (Open to relocate)",
    experience: "9 months",
    match: "High",
    matchColor: "bg-green-100 text-green-600",
    cardBg: "bg-white",
    applied: "2 days ago",
    onClick: () => console.log("Application clicked"),
      },
  {
    name: "Saloni Ahuja",
    location: "Delhi (Open to relocate)",
    experience: "5 months",
    match: "Moderate",
    matchColor: "bg-orange-100 text-orange-600",
    cardBg: "bg-white",
    applied: "2 days ago",
    onClick: () => console.log("Application clicked"),
      },
  {
    name: "Aman Sharma",
    location: "Delhi (Open to relocate)",
    experience: "9 months",
    match: "High",
    matchColor: "bg-green-100 text-green-600",
    cardBg: "bg-white",
    applied: "2 days ago",
    onClick: () => console.log("Application clicked"),
          },
];

const ApplicationsSmall = () => {
  const [search, setSearch] = useState("");

  

  const filteredApps = applicationsData.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
     
          <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
             
            <div className="hidden lg:block flex-grow"></div>
    
    <div className="bg-white rounded-lg shadow-md w-[447px] h-[627px] mt-2 py-5 px-2 flex flex-col gap-[30px]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-gray-500 text-sm">Graphic design internship</p>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {filteredApps.map((app, index) => (
          <div
            key={index}
            className={`flex justify-between items-start rounded-lg border border-gray-200 p-3 ${app.cardBg}`}
            onClick={app.onClick}
                              >
            {/* Left Info */}
            <div>
              <h2 className="font-semibold">{app.name}</h2>
              <p className="text-gray-500 text-sm">{app.location}</p>
              <p className="text-gray-500 text-sm">
                Total work experience: {app.experience}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Applied {app.applied}
              </p>
            </div>

            {/* Resume Match */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${app.matchColor}`}
            >
              Resume match: {app.match}
            </span>
          </div>
        ))}
      </div>
    </div>
  
                        {/* Right Spacer */}
                        <div className="hidden lg:block flex-grow "></div>
      </div>
    
  );
};

export default ApplicationsSmall;
