import React, { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL; // <-- replace with your backend base url

const TotalJobPosts = () => {
  const [search, setSearch] = useState("");
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  // Fetch job posts from backend
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        setLoading(true);
        // assuming token is stored in localStorage
        const response = await axios.get(
          `${BASE_URL}/company-recruiter/jobpost/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setJobPosts(response.data.data);
        } else {
          setError("Failed to fetch job posts");
        }
      } catch (err) {
        console.error("Error fetching job posts:", err);
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  // Filter jobs by search
  const filteredJobs = jobPosts.filter(
    (job) =>
      job.JobRole?.toLowerCase().includes(search.toLowerCase()) ||
      job.skill_required_note?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>

        <div className="bg-white rounded-lg shadow-md w-[729px] h-[800px] py-5 px-6 mt-6 overflow-y-auto">
          {/* Title */}
          <h1 className="text-2xl font-bold">Total Job Posts</h1>
          <p className="text-gray-500 mb-4">
            {loading
              ? "Loading job posts..."
              : `You have ${jobPosts.length} job post(s).`}
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by role or skills..."
              className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Job List */}
          <div className="flex flex-col gap-5">
            {loading ? (
              <p>Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-gray-500">No job posts found.</p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.job_id}
                  className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    {/* Job Info */}
                    <div>
                      <h2 className="font-semibold">
                        {job.JobRole || "Untitled Job"}
                      </h2>
                      {job.internship_start_date ? (
                        <p className="text-sm text-blue-500">
                          Starts from {job.internship_start_date}.
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">No start date</p>
                      )}
                      <button
                        className="mt-2 bg-red-500 text-white px-4 py-1 rounded-md text-sm hover:bg-red-600 transition"
                        onClick={() =>
                          navigate(`/recruiter-view-applications/${job.job_id}`)
                        }
                      >
                        View applications (0)
                      </button>
                    </div>

                    {/* Status & Views */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          job.number_of_openings > 0
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {job.number_of_openings > 0 ? "Active" : "Closed"}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm gap-1">
                        <Eye size={16} /> {job.views?.toLocaleString() || 0}{" "}
                        views
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Skills Required:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill.skill_id}
                            className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-md"
                          >
                            {skill.skill_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Perks */}
                  {job.perks?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Perks:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.perks.map((perk, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-md"
                          >
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
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
