import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { CiSearch } from "react-icons/ci";
import { jobPostApi } from "../../../api/jobPostApi";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

const PipelineCandidates = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from Redux store
  const { token } = useSelector((state) => state.auth);

  // Fetch candidates when component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await jobPostApi.getPipelineCandidates(token);
        
        // Check if response contains pipeline data
        if (response && response.pipeline) {
          setCandidates(response.pipeline);
        } else {
          console.warn("Unexpected API response format:", response);
          setError("Unexpected response format from server");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch candidates";
        setError(errorMessage);
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [token]); // Add token as dependency to refetch if it changes
  const tabs = [
    { label: "All", count: candidates.length },
    { label: "Applied", count: candidates.filter(c => c.status === "Applied").length },
    { label: "Screening", count: candidates.filter(c => c.status === "Screening").length + candidates.filter(c => c.status ==="Send Assignment").length }, 
    { label: "Interview", count: candidates.filter(c => c.status === "Interview").length },
    { label: "Offered", count: candidates.filter(c => c.status === "Offered").length },
    { label: "Hired", count: candidates.filter(c => c.status === "Hired").length },
  ];

  console.log(candidates);
  const Navigate = useNavigate();
  const timeago=(created_at) =>{
    const createdDate = new Date(created_at);
    const today = new Date();

    // difference in ms
    const diffMs = today - createdDate;

    // convert to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Applied today";
    if (diffDays === 1) return "Applied 1 day ago";
    return `Applied ${diffDays} days ago`;
}

  const filteredCandidates = candidates.filter((c) => {
    if (activeTab !== "All" && c.status !== activeTab) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });
  console.log(filteredCandidates);

  // Calculate total experience and return in "X years Y months" format
  const calculateTotalExperience = (experiences = []) => {
    if (!Array.isArray(experiences) || experiences.length === 0) return "0 months";

    let totalMonths = 0;

    experiences.forEach((exp) => {
      if (!exp.start_date) return; // skip invalid entries

      const start = new Date(exp.start_date);
      const end = exp.end_date ? new Date(exp.end_date) : new Date();

      totalMonths +=
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years > 0 && months > 0) return `${years} years ${months} months`;
    if (years > 0) return `${years} years`;
    return `${months} months`;
  };


  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading candidates...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        <div className="flex-grow hidden lg:block"></div>
        
        <div className="w-[729px] h-[680px] rounded-[10px] p-6 bg-white shadow-md mx-auto mt-6 flex flex-col gap-5">
          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900">Pipeline Candidates</h2>
          

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-4 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400"><CiSearch/></span>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 text-sm">
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
                key={c.application_id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{c.user?.first_name + " " +c.user?.last_name}</h3>
                  <p className="text-sm text-gray-600">{c.job?.JobRole?.title}</p>
                  <p className="text-xs text-gray-500">{calculateTotalExperience(c.user.experiences)}</p>
                  <p className="text-xs text-gray-400">{timeago(c.applied_date)}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {c.status === "Applied" && (
                    <span className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                      Awaiting Screening
                    </span>
                  )}
                  {c.status === "Interview" && (
                    <span className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                      Interview Scheduled
                    </span>
                  )}
                  {c.status === "Hired" && (
                    <span className="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                      Hired
                    </span>
                  )}
                  {c.status === "Sent Assignment" && (
                    <span className="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                      Assignment Sent
                    </span>
                  )}

                  {/* <button
                  onClick={() => Navigate(`/recruiter-application-details/${c.job.job_id}/${c.application_id} state={{c}}}
  className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
>


  View full application
</button> */}
                  <button
                    onClick={() =>
                      Navigate(`/recruiter-application-details/${c.job.job_id}/${c.application_id}`, {
                        state: { c },
                      })
                    }
                    className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
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
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default PipelineCandidates;