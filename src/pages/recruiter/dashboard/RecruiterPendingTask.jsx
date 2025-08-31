import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { CiSearch } from "react-icons/ci";
import { jobPostApi } from "../../../api/jobPostApi";
const PendingTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        setLoading(true);
        const data = await jobPostApi.getPendingTasks(token);
        
        const formattedTasks = [
          {
            id: 1,
            title: "Resumes to Review",
            action: "Review Now",
            count: `${data.resumeReview?.count || 0} Resumes`,
            color: data.resumeReview?.count > 0 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600"
          },
          {
            id: 2,
            title: "Interviews to Schedule",
            action: "Schedule Now",
            count: `${data.interviewToSchedule?.count || 0} Interviews`,
            color: data.interviewToSchedule?.count > 0 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600"
          },
          {
            id: 3,
            title: "Pending Offers",
            action: "Send Offer",
            count: `${data.offerLetterPending?.count || 0} Offers`,
            color: data.offerLetterPending?.count > 0 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600"
          },
        ];
        
        setTasks(formattedTasks);
      } catch (err) {
        console.error("Error fetching pending tasks:", err);
        setError("Failed to load pending tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTasks();
  }, [token]);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
       <MainLayout>
              <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
                <div className="hidden lg:block flex-grow"></div>
    <div className="w-[729px] h-[538px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-6 flex flex-col gap-5">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900">Pending Tasks</h2>
      <p className="text-gray-500">Lorem Ipsum</p>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-full pl-4 pr-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-2.5 text-gray-400"><CiSearch /></span>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading pending tasks...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No pending tasks found</div>
        ) : (
          filteredTasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
          >
          <div >
          <div>
              <h3 className="font-bold text-gray-800">{task.title}</h3>
            </div>

            <div className="flex gap-4 justify-between">
              {/* Action Button */}
              <button
                className={`${task.color} text-white px-4 py-1 rounded-md text-sm`}
              >
                {task.action}
              </button>

              {/* Count Badge */}
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                {task.count}
              </span>
            </div>
          </div>
          </div>
        )))}
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

export default PendingTasks;
