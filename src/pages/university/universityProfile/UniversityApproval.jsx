import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import UniversityRightSide1 from "./UniversityRightSide1";

const Approvals = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState([
    {
      id: 1,
      name: "Sanya Arora",
      role: "UI/UX Designer",
      duration: "Jan 2022 - Dec 2024",
      phone: "+91 9876543210",
      email: "sanyaroorra@gmail.com",
      status: "Approved",
      date: "10-04-2025",
    },
    {
      id: 2,
      name: "Aman Gupta",
      role: "Sales Manager",
      duration: "Feb 2024 - Feb 2025",
      phone: "+91 8866543210",
      email: "guptaaman12@gmail.com",
      status: "Pending",
      date: "08-03-2025",
    },
    {
      id: 3,
      name: "Ramesh",
      role: "Graphic Designer",
      duration: "May 2022 - Dec 2022",
      phone: "+91 9876543210",
      email: "ramesh21@gmail.com",
      status: "Rejected",
      date: "05-02-2025",
    },
  ]);

  const handleAction = (id, action) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action } : item
      )
    );
  };

  const filteredData = data.filter((item) => {
    if (activeTab !== "All" && item.status !== activeTab) return false;
    if (
      searchTerm &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  return (
       <MainLayout>
             <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
               <div className="hidden lg:block flex-grow"></div>
              
    <div className="w-[729px] h-[627px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-2 flex flex-col gap-5">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900">Approvals</h2>
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
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full border ${
              activeTab === tab
                ? "bg-blue-100 text-blue-600 border-blue-400"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {tab}{" "}
            {tab === "All" && `(${data.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex flex-col gap-2 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <button className="text-blue-500 text-sm font-medium">
                View profile
              </button>
            </div>
            <p className="text-gray-600 text-sm">{item.role}</p>
            <p className="text-gray-500 text-xs">{item.duration}</p>
            <p className="text-gray-500 text-sm">{item.phone}</p>
            <p className="text-gray-500 text-sm">{item.email}</p>

            <p
              className={`text-xs mt-1 ${
                item.status === "Approved"
                  ? "text-green-600"
                  : item.status === "Pending"
                  ? "text-orange-500"
                  : "text-red-500"
              }`}
            >
              {item.status === "Approved"
                ? `Approved on: ${item.date}`
                : item.status === "Pending"
                ? `Requested on: ${item.date}`
                : `Rejected on: ${item.date}`}
            </p>

            {/* Action Buttons */}
            {item.status === "Pending" && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleAction(item.id, "Rejected")}
                  className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(item.id, "Approved")}
                  className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}

            {item.status === "Approved" && (
              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full w-fit">
                Approval confirmed
              </span>
            )}

            {item.status === "Rejected" && (
              <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full w-fit">
                Approval rejected
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
    <aside className="hidden lg:block w-[425px] max-w-[425px] p-2 sticky top-4 h-fit ml-4">
     <UniversityRightSide1 />
</aside>
{/* Right Spacer */}
<div className="hidden lg:block flex-grow "></div>
</div>
</MainLayout>
  );
};

export default Approvals;
