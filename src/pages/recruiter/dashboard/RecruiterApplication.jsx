import React, { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightProfile from "./RecruiterRightProfile";
import { useApplications } from "../../../hooks/useApplications";
import { useUpdateApplicationStatus } from "../../../hooks/useApplications"; 

const RecruiterApplication = () => {
  const [search, setSearch] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const navigate = useNavigate();
  const { job_id } = useParams();

  const location = useLocation();
  const job = location.state?.job;
  console.log("job_id", job);

  // 🔹 Get data from API
  const { applications, loading, error } = useApplications(job_id);

  // 🔹 Hook for updating status
  const { updateStatus, updating } = useUpdateApplicationStatus();

  // 🔹 Handle status update
  const handleStatusUpdate = async (application_id, status) => {
    try {
      await updateStatus(application_id, job.job_id, status);
      alert(`Application marked as ${status}`);
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading applications...</p>
        </div>
      </MainLayout>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  // 🔹 Filter
  const filteredApps = applications.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log("Filtered Applications:", filteredApps);

  return (
    <MainLayout>
      <div className="flex items-start justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        <div className="flex-grow hidden lg:block"></div>

        <div className="bg-white rounded-lg shadow-md w-[725px] h-[800px] py-5 px-6 mt-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-gray-500">{job.JobRole?.title}</p>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2"
              size={20}
            />
          </div>

          {/* Applications List */}
          <div className="flex flex-col gap-4 pr-1 overflow-y-auto">
            {filteredApps.map((app, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                {/* Left Info */}
                <div>
                  <h2 className="font-semibold">{app.name}</h2>
                  <p className="text-gray-500">{app.location}</p>
                  <p className="text-gray-500">
                    Total work experience: {app.experience}
                  </p>

                  <Link
                    to={`/recruiter-application-details/${job.job_id}/${app.application_id}`}
                    state={{ app }}
                    className="block mt-1 text-sm text-blue-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    View full application
                  </Link>
                  <p className="text-sm text-gray-400">Applied {app.applied}</p>
                </div>

                {/* Right Actions */}
                <div className="relative flex flex-col items-end gap-2">
                  {/* Resume Match */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${app.matchColor}`}
                  >
                    Resume match: {app.match}
                  </span>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(app.application_id, "NotInterested")
                      }
                      disabled={updating}
                      className="px-3 py-1 text-sm text-white transition bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Not Interested
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(app.application_id, "ShortList")
                      }
                      disabled={updating}
                      className="px-3 py-1 text-sm text-white transition bg-green-500 rounded-md hover:bg-green-600"
                    >
                      Shortlist
                    </button>
                    <div className="relative">
                      <button
                        className="px-3 py-1 text-sm transition border border-gray-300 rounded-md hover:bg-gray-100"
                        onClick={() =>
                          setOpenMenuIndex(
                            openMenuIndex === index ? null : index
                          )
                        }
                      >
                        More →
                      </button>
                      {/* Dropdown Menu */}
                      {openMenuIndex === index && (
                        <div className="absolute right-0 z-10 w-40 mt-1 bg-white border border-gray-200 rounded shadow-md">
                          <button
                            onClick={() =>
                              navigate(
                                "/recruiter-send-assignment/" +
                                  app.application_id,
                                { state: { applicant: app } }
                              )
                            }
                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          >
                            Send Assignment
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                "/recruiter-schedule-interview/" +
                                  app.application_id,
                                { state: { applicationData: app } }
                              )
                            }
                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          >
                            Schedule Interview
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(app.application_id, "Hired")
                            }
                            disabled={updating}
                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          >
                            Hire
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block w-[425px] max-w-[425px] p-2 sticky top-4 h-fit ml-4">
          <RecruiterRightProfile />
        </aside>
        <div className="flex-grow hidden lg:block "></div>
      </div>
    </MainLayout>
  );
};

export default RecruiterApplication;