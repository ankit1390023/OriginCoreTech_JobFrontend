import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightSidebar from "./RecruiterRightSidebar";
import { useApplications } from "../../../hooks/useApplications";
import { useUpdateApplicationStatus } from "../../../hooks/useApplications";

const RecruiterApplication = () => {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const { job_id } = useParams();

  const location = useLocation();
  const job = location.state?.job;
  console.log("job_id", job);

  // 🔹 Get data from API
  const {
    applications: rawApplications,
    loading,
    error
  } = useApplications(job_id);
  const [applications, setApplications] = useState([]);

  // Sync rawApplications to local state whenever it changes
  useEffect(() => {
    if (rawApplications) {
      setApplications([...rawApplications]);
    }
  }, [rawApplications]);

  // 🔹 Hook for updating status
  const { updateStatus, updating } = useUpdateApplicationStatus();

  // 🔹 Handle status update
  const handleStatusUpdate = async (application_id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.application_id === application_id
          ? { ...app, status: newStatus }
          : app
      )
    );

    try {
      await updateStatus(application_id, job.job_id, newStatus);
      console.log(`Status updated to ${newStatus}`);
    } catch (err) {
      // Rollback on error
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === application_id
            ? { ...app, status: app.originalStatus || app.status }
            : app
        )
      );
      alert(err.message || "Failed to update status");
    }
  };

  const getActionButtons = (
    status,
    app,
    updating,
    handleStatusUpdate,
    navigate,
    job_id
  ) => {
    const config = STATUS_ACTIONS[status] || { primary: [], dropdown: [] };
    const { primary = [], dropdown = [], message } = config;

    if (message) {
      return (
        <span className="px-3 py-1 text-sm font-medium text-gray-500">
          {message}
        </span>
      );
    }

    return (
      <div className="flex gap-2">
        {/* Primary Buttons */}
        {primary.map((action) => (
          <button
            key={action}
            onClick={() => handleStatusUpdate(app.application_id, action)}
            disabled={updating}
            className={`px-3 py-1 text-sm text-white transition rounded-md ${
              action === "NotInterested"
                ? "bg-red-500 hover:bg-red-600"
                : action === "ShortList"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {action === "NotInterested" ? "Not Interested" : action}
          </button>
        ))}

        {/* Dropdown Button (if dropdown actions exist) */}
        {dropdown.length > 0 && (
          <div className="relative">
            <button
              className="px-3 py-1 text-sm transition border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() =>
                setOpenMenuId((prev) =>
                  prev === app.application_id ? null : app.application_id
                )
              }
            >
              More →
            </button>

            {openMenuId === app.application_id && (
              <div className="absolute right-0 z-10 w-48 mt-1 bg-white border border-gray-200 rounded shadow-md">
                {dropdown.map((action) => {
                  if (action === "Send Assignment") {
                    return (
                      <button
                        key={action}
                        onClick={() =>
                          navigate(
                            `/recruiter-send-assignment/${job_id}/${app.application_id}`,
                            { state: { applicant: app } }
                          )
                        }
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        Send Assignment
                      </button>
                    );
                  }
                  if (action === "Schedule Interview") {
                    return (
                      <button
                        key={action}
                        onClick={() =>
                          navigate(
                            `/recruiter-schedule-interview/${job_id}/${app.application_id}`,
                            { state: { applicationData: app } }
                          )
                        }
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        Schedule Interview
                      </button>
                    );
                  }
                  if (action === "Hire") {
                    return (
                      <button
                        key={action}
                        onClick={() =>
                          handleStatusUpdate(app.application_id, "Hired")
                        }
                        disabled={updating}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        Hire
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
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

  //Now managing the status of aplications
  const STATUS_ACTIONS = {
    Applied: {
      primary: ["NotInterested", "ShortList"],
      dropdown: ["Send Assignment", "Schedule Interview", "Hire"],
    },
    Screening: {
      primary: ["NotInterested", "ShortList"],
      dropdown: ["Send Assignment", "Schedule Interview", "Hire"],
    },
    "Send Assignment": {
      primary: ["NotInterested"],
      dropdown: ["Schedule Interview", "Hire"],
    },
    Interview: {
      primary: ["NotInterested"],
      dropdown: ["Hire"],
    },
    Offered: {
      primary: [],
      dropdown: ["Hire"],
    },
    Hired: {
      primary: [],
      dropdown: [],
      message: "Candidate Hired",
    },
    ShortList: {
      primary: ["NotInterested"],
      dropdown: ["Send Assignment", "Schedule Interview", "Hire"],
    },
    NotInterested: {
      primary: [],
      dropdown: [],
      message: "Not Interested",
    },
  };

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
          <div className="flex flex-col gap-4 pr-1 overflow-y-visible">
            {filteredApps.map((app) => (
              <div
                key={app.application_id}
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

                  {/* Status Badge — Shows current status clearly */}
                  <span
                    className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      app.status === "Hired"
                        ? "bg-green-100 text-green-800"
                        : app.status === "NotInterested"
                        ? "bg-red-100 text-red-800"
                        : app.status === "ShortList"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Right Actions */}
                <div className="relative flex flex-col items-end gap-2">
                  {/* Resume Match */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${app.matchColor}`}
                  >
                    Resume match: {app.match}
                  </span>

                  {/* Dynamic Action Buttons — based on current status */}
                  {getActionButtons(
                    app.status,
                    app,
                    updating,
                    handleStatusUpdate,
                    navigate,
                    job_id
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block w-[425px] max-w-[425px] p-2 sticky top-4 h-fit ml-4">
          <RecruiterRightSidebar />
        </aside>
        <div className="flex-grow hidden lg:block "></div>
      </div>
    </MainLayout>
  );
};

export default RecruiterApplication;
