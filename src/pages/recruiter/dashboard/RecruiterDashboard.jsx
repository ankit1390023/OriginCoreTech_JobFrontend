import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { jobPostApi } from "../../../api/jobPostApi"; 
import { useSelector } from "react-redux";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    jobsPosted: 0,
    pendingTasks: 0,
    upcomingInterviews: 0,
  });
  
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!token) {
      console.error("No token found for recruiter");
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const data = await jobPostApi.getDashboardStats(token);
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, [token]);

    

  const data = [
    {
      title: "Total Job Posts",
      description: "Track and manage all your open roles in one place.",
      button: `Manage postings (${dashboardStats.jobsPosted})`,
      buttonAction: () => navigate("/recruiter-total-job-post"),
    },
    {
      title: "Pipeline Candidates",
      description: "Monitor every candidate’s journey through your hiring funnel.",
      button: "Manage pipelines",
      buttonAction: () => navigate("/recruiter-pipeline"),
    },
    {
      title: "Upcoming Interviews",
      description: `You have ${dashboardStats.upcomingInterviews} interviews scheduled.`,
      button: `View details (${dashboardStats.upcomingInterviews})`,
      buttonAction: () => navigate("/recruiter-upcoming-interview"),
    },
    {
      title: "Pending Tasks",
      description: `You have ${dashboardStats.pendingTasks} tasks waiting for your attention.`,
      button: `Review tasks (${dashboardStats.pendingTasks})`,
      buttonAction: () => navigate("/recruiter-pending-task"),
    },
    {
      title: "Analytics and Reports",
      description: "Track hiring progress and performance in real time.",
      button: "View details",
      buttonAction: () => navigate("/recruiter-view-analytics"),
    },
    {
      title: "Settings and Access Panel",
      description: "Manage your personal information and app preferences.",
      button: "View details",
      buttonAction: () => navigate("/recruiter-view-settings"),
    },
  ];

  return (
    <MainLayout>
      <div className="flex items-start justify-center min-h-screen px-3 bg-gray-100 sm:px-5 lg:px-8">
        {/* Left Spacer for large screens */}
        <div className="flex-grow hidden lg:block"></div>

        {/* Main content + right profile */}
        <div className="flex flex-col lg:flex-row gap-4 mt-5 w-full max-w-[1280px]">
          {/* Left Section */}
          <section className="w-full lg:w-[720px] rounded-[10px] p-5 bg-white shadow-md">
            {/* Header */}
            <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
            <p className="text-sm text-gray-500 sm:text-base">{user.first_name}</p>

            {/* Search bar */}
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 pl-4 pr-10 text-sm border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 sm:text-base"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <div>
                    <h2 className="text-base font-semibold sm:text-lg">{item.title}</h2>
                    <p className="mt-1 text-sm text-blue-600">{item.description}</p>
                  </div>
                  <button
                    onClick={item.buttonAction}
                    className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded mt-3 text-sm font-medium"
                  >
                    {item.button}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Right Section */}
          <div className="w-full lg:w-[350px]">
            <RecruiterRightProfile />
          </div>
        </div>

        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default RecruiterDashboard;
