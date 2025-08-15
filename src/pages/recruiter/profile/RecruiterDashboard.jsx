import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { jobPostApi } from "../../../api/jobPostApi"; // Import your API service
import { useSelector } from "react-redux";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [totalJobPosts, setTotalJobPosts] = useState(0);
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      console.error("No token found for recruiter");
      return;
    }

    jobPostApi
      .getTotalJobPostsCount(token)
      .then((data) => {
        setTotalJobPosts(data.totalJobPosts || 0);
      })
      .catch((error) => {
        console.error("Error fetching total job posts count:", error);
      });
  }, [token]);

  const data = [
    {
      title: "Total Job Posts",
      description: "Track and manage all your open roles in one place.",
      button: `Manage postings (${totalJobPosts})`,
      buttonAction: () => navigate("/recruiter-manage-postings"),
      link: "#",
    },
    {
      title: "Pipeline Candidates",
      description: "Monitor every candidate’s journey through your hiring funnel.",
      button: "Manage pipelines",
      buttonAction: () => navigate("/recruiter-manage-pipelines"),
      link: "#",
    },
    {
      title: "Upcoming Interviews",
      description: "You have 3 interviews scheduled for today.",
      button: "View details (3)",
      buttonAction: () => navigate("/recruiter-view-interviews"),
      link: "#",
    },
    {
      title: "Pending Tasks",
      description: "You have 5 tasks waiting for your attention.",
      button: "Review tasks (5)",
      buttonAction: () => navigate("/recruiter-review-tasks"),
      link: "#",
    },
    {
      title: "Analytics and Reports",
      description: "Track hiring progress and performance in real time.",
      button: "View details",
      buttonAction: () => navigate("/recruiter-view-analytics"),
      link: "#",
    },
    {
      title: "Settings and Access Panel",
      description: "Manage your personal information and app preferences.",
      button: "View details",
      buttonAction: () => navigate("/recruiter-view-settings"),
      link: "#",
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>

        <div className="w-[729px] h-[700px] rounded-[10px] p-5 gap-5  bg-white shadow-md mx-auto mt-5">
          {/* Header */}
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Lorem Ipsum</p>

          {/* Search bar */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full py-2 pl-4 pr-10 border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4 mt-5">
            {data.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h2 className="font-semibold text-lg">{item.title}</h2>
                  <p className="text-blue-600 text-sm mt-1">{item.description}</p>
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

export default RecruiterDashboard;
