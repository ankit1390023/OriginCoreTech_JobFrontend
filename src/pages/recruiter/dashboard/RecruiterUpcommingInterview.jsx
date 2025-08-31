import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";    
import { jobPostApi } from "../../../api/jobPostApi";
import { useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";

const UpcomingInterviews = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchInterviews = async () => {
        try {
            setLoading(true);

            const response = await jobPostApi.getAllUpcomingInterviews(token);
            console.log(response);
            
            // Check if response has data property
            const interviewData = Array.isArray(response) ? response : response.data;
            console.log("Fetched interview data:", interviewData);
            
            const formattedInterviews = interviewData.map(interview => ({
                id: interview.id,
                name: interview.name ,    
                role: interview.jobProfile || "Not specified",
                mode: interview.interview_type || "Zoom",
                date: interview.interview_date ? new Date(interview.interview_date).toLocaleString() : null,
                start_time: interview.start_time || "Not specified",
                status: interview.status || "Pending"
            }));
            
            setInterviews(formattedInterviews);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setError(`Failed to fetch interviews: ${errorMessage}`);
            console.error("Error fetching interviews:", error);
            
            // If token is invalid, you might want to redirect to login
            if (error.response?.status === 401) {
                localStorage.removeItem('token'); // Clear invalid token
                // Add your login redirect logic here if needed
            }
        } finally {
            setLoading(false);
        }
    };

    fetchInterviews();
  }, []);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const tabs = [
    { label: "All", count: interviews.length },
    {
      label: "Today",
      count: interviews.filter(
        (i) => i.date && isSameDay(new Date(i.date), new Date())
      ).length,
    },
    {
      label: "This week",
      count: interviews.filter((i) => {
        if (!i.date) return false;
        const interviewDate = new Date(i.date);
        const today = new Date();
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        return interviewDate >= today && interviewDate <= weekEnd;
      }).length,
    },
  ];

  console.log("Interviews data:", interviews);
  const filteredInterviews = interviews.filter((i) => {
    if (activeTab === "Today") {
      if (!i.date) return false;
      return new Date(i.date).toDateString() === new Date().toDateString();
    }
    if (activeTab === "This week") {
      if (!i.date) return false;
      const interviewDate = new Date(i.date);
      const today = new Date();
      const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      return interviewDate >= today && interviewDate <= weekEnd;
    }
    if (searchTerm && !i.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  if (loading) {
    return <MainLayout><div className="flex items-center justify-center h-screen">Loading...</div></MainLayout>;
  }

  if (error) {
    return <MainLayout><div className="flex items-center justify-center h-screen text-red-500">{error}</div></MainLayout>;
  }

  return (
       <MainLayout>
             <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
               <div className="flex-grow hidden lg:block"></div>
             
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
          className="w-full py-2 pl-4 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-2.5 text-gray-400"><CiSearch /></span>
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
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
          >
            <div>
              <h3 className="font-bold text-gray-800">{i.name}</h3>
              <p className="text-sm text-gray-600">{i.role}</p>
              <p className="text-xs text-gray-500">Mode: {i.mode}</p>
              {i.date ? (
                <p className="text-xs text-gray-500">{i.date}</p>
              ) : (
                <p className="text-xs text-gray-400">Pending</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {i.status === "Pending" && (
                <>
                  <span className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                    Interview pending
                  </span>
                  <button className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">
                    View details
                  </button>
                </>
              )}

              {i.status === "Confirmed" && (
                <>
                  <span className="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                    Confirmed
                  </span>
                  <button className="px-4 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
<div className="flex-grow hidden lg:block "></div>
</div>
</MainLayout>
  );
};

export default UpcomingInterviews;
