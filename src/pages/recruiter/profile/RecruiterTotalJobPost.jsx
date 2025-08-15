import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout"; 
import RecruiterRightProfile from "./RecruiterRightProfile";
import { useNavigate } from "react-router-dom";

const jobPostsData = [
  {
    title: "Digital Marketing Executive",
    status: "Active",
    lastDate: "27/04/2025",
    applications: 103,
    views: 7511,
  },
  {
    title: "Graphic Design",
    status: "Closed",
    lastDate: "21/04/2025",
    applications: 30,
    views: 3456,
  },
  {
    title: "Human Resource (HR)",
    status: "Closed",
    lastDate: "16/04/2025",
    applications: 47,
    views: 3456,
  },
  {
    title: "Front End Developer",
    status: "Closed",
    lastDate: "09/04/2025",
    applications: 30,
    views: 3456,
  },
];

const TotalJobPosts = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredJobs = jobPostsData.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <MainLayout>
         <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
           <div className="hidden lg:block flex-grow"></div>
           
           <div className="bg-white rounded-lg shadow-md w-[729px] h-[800px] py-5 px-6 mt-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">Total Job Posts</h1>
      <p className="text-gray-500 mb-4">Lorem Ipsum</p>

      {/* Search Bar */}
      <div className="relative mb-6">
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

      {/* Job List */}
      <div className="flex flex-col gap-5">
        {filteredJobs.map((job, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            {/* Job Info */}
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              {job.status === "Active" ? (
                <p className="text-sm text-blue-500">
                  Last date to receive application is {job.lastDate}.
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Closed on {job.lastDate}.
                </p>
              )}
              <button className="mt-2 bg-red-500 text-white px-4 py-1 rounded-md text-sm hover:bg-red-600 transition" onClick={() => navigate(`/recruiter-view-applications/${job.id}`)}>
                View applications ({job.applications})
              </button>
            </div>

            {/* Status & Views */}
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  job.status === "Active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {job.status}
              </span>
              <div className="flex items-center text-gray-500 text-sm gap-1">
                <Eye size={16} /> {job.views.toLocaleString()} views
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

export default TotalJobPosts;
