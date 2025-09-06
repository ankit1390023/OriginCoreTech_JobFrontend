import Header from "../../../components/shared/Header";
import {
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaUserTie,
  FaMoneyBillWave,
  FaBriefcase,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetJobApi } from "../../../hooks/useGetJobApi";
import { useState } from "react";
import { Input, Button, Loader, Checkbox, Badge } from "../../../components/ui";
import { getImageUrl } from "../../../../utils.js";


export default function AllJObs() {
  const { allJobs, loading, error, refetch } = useGetJobApi();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  console.log("allJobs in AllJobs.jsx", allJobs);

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="bg-[#f5f6f7] min-h-screen">
      <Header />
      <div className="px-3 pt-2 pb-4 mx-auto max-w-7xl sm:pt-3 md:pt-4 lg:pt-6 sm:pb-6 sm:px-4 md:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="mb-3 lg:hidden sm:mb-4">
          <Button
            onClick={toggleFilters}
            variant="outline"
            size="default"
            className="flex items-center justify-center w-full gap-2 px-4 py-3 transition-colors bg-white border border-gray-200 shadow rounded-xl hover:bg-gray-50"
          >
            {isFiltersOpen ? (
              <>
                <FaTimes className="text-sm text-gray-600" />
                <span className="text-sm font-medium">Close Filters</span>
              </>
            ) : (
              <>
                <FaFilter className="text-sm text-gray-600" />
                <span className="text-sm font-medium">Show Filters</span>
              </>
            )}
          </Button>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 sm:gap-4 lg:gap-2"
          style={{ marginLeft: "35px", marginRight: "35px" }}
        >
          {/* Left: Job Filters */}
          <aside
            className={`bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-5 lg:p-6 flex flex-col gap-1 sm:gap-5 self-start ${
              isFiltersOpen ? "block" : "hidden lg:flex"
            }`}
          >
            <div>
              <h2 className="mb-2 text-lg font-extrabold text-gray-900 sm:text-xl lg:text-2xl">
                Job Filters
              </h2>
              <p className="text-sm text-gray-500">
                Help us match you with the best career opportunities
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input
                  label={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaBriefcase className="text-gray-400" /> Profile
                    </span>
                  }
                  placeholder="Eg. Marketing"
                  aria-label="Profile"
                  size="small"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  label={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaMapMarkerAlt className="text-gray-400" /> Location
                    </span>
                  }
                  placeholder="Eg. Delhi"
                  aria-label="company_location"
                  size="small"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <Checkbox
                    label="Remote"
                    className="flex items-center gap-2 p-0 text-sm font-medium bg-transparent border-0"
                  />
                  <Checkbox
                    label="Hybrid"
                    className="flex items-center gap-2 p-0 text-sm font-medium bg-transparent border-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  label={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaUserTie className="text-gray-400" /> Years of
                      experience
                    </span>
                  }
                  placeholder="Total experience"
                  aria-label="Years of experience"
                  size="small"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  label={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaBuilding className="text-gray-400" /> Company
                    </span>
                  }
                  placeholder="Company name"
                  aria-label="Company"
                  size="small"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  label={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaMoneyBillWave className="text-gray-400" /> Annual
                      Salary (in lakhs)
                    </span>
                  }
                  placeholder="Eg. 4,00,000"
                  aria-label="Annual Salary"
                  size="small"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 mt-4 sm:flex-row">
              <button
                className="w-full text-sm font-semibold text-center text-blue-500 transition-colors hover:underline sm:w-auto"
                aria-label="Clear all filters"
              >
                Clear all
              </button>
              <Button
                variant="primary"
                size="small"
                className="bg-[#ff4d3d] hover:bg-[#e63c2a] transition-colors text-white rounded-full px-6 py-2.5 font-semibold text-sm shadow focus:ring-2 focus:ring-red-200 w-full sm:w-auto"
                aria-label="Apply filters"
              >
                Apply
              </Button>
            </div>
          </aside>

          {/* Right: Jobs List */}
          <main className="bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col min-h-[80vh] w-full sm:w-[600px] md:w-[700px] lg:w-[800px] mx-auto">
            <header className="mb-4 sm:mb-6">
              <h2 className="mb-2 text-xl font-extrabold text-gray-900 sm:text-2xl lg:text-3xl">
                Jobs
              </h2>
              <p className="text-sm text-gray-500 sm:text-base">
                Start applying to the latest job vacancies at the leading
                companies in India below.
              </p>
            </header>

            {/* Job Cards */}
            <section className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
              {loading && (
                <div className="py-8 text-center sm:py-12">
                  <Loader message="Loading jobs..." />
                </div>
              )}

              {error && (
                <div className="py-8 text-center sm:py-12">
                  <p className="mb-4 text-sm text-red-500 sm:text-base">
                    Error loading jobs: {error}
                  </p>
                  <Button
                    onClick={refetch}
                    variant="secondary"
                    size="small"
                    className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!loading &&
                !error &&
                allJobs &&
                allJobs.length > 0 &&
                allJobs.map((job) => (
                  <Link
                    key={job.job_id}
                    to={`/jobs/${job.job_id}`}
                    className="no-underline"
                  >
                    <article
                      className="relative flex flex-col gap-3 p-4 transition-all duration-200 bg-white border border-gray-200 shadow-sm cursor-pointer sm:flex-row sm:items-center sm:gap-4 lg:gap-6 rounded-xl sm:p-5 lg:p-6 hover:shadow-lg hover:border-blue-200 group"
                      tabIndex={0}
                      aria-label={`Job: ${job.jobRole} at ${job.company_name}`}
                    >
                      {/* Skills required badge */}
                      {job.skill_missing && (
                        <div className="absolute z-10 -top-2 sm:-top-3 left-4">
                          <Badge
                            color="bg-blue-600 text-white hover:bg-blue-700"
                            text={`skills required ?`}
                            className="text-xs font-semibold border border-blue-700 shadow-lg"
                          />
                        </div>
                      )}

                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(job.logo_url)}
                          alt={`${job.company_name} logo`}
                          className="object-contain w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16"
                        />
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                        <div>
                          <h3 className="text-base font-bold leading-tight text-gray-900 transition-colors sm:text-lg lg:text-xl group-hover:text-blue-600">
                            {job.jobRole}
                          </h3>
                          <p className="text-sm font-semibold">
                            {job.company_name}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <Badge
                            color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            className="text-xs border border-gray-200"
                          >
                            <FaMapMarkerAlt className="text-xs text-gray-400" />
                            <span className="truncate">
                              {job.company_location}
                            </span>
                          </Badge>
                          {/* <Badge
                            color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            className="text-xs border border-gray-200"
                          >
                            <FaUserTie className="text-xs text-gray-400" />
                            <span className="truncate">{job.experience}</span>
                          </Badge> */}
                          {job.salary && (
                            <Badge
                              color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                              className="text-xs border border-gray-200"
                            >
                              <span className="truncate">
                                INR: {job.salary}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status and Match Info */}
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]">
                        <Badge
                          color={
                            job.hiring_status === "Actively Hiring"
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }
                          text={job.hiring_status}
                          className="text-sm font-semibold border border-gray-200 shadow-lg"
                        />
                        <Badge
                          color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                          className="text-sm font-semibold border border-gray-200"
                        >
                          {job.posted_days_ago}
                        </Badge>
                        <Badge
                          color={
                            job.matchPercentage > 70
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-yellow-400 text-white hover:bg-yellow-600"
                          }
                          text={`${job.matchPercentage || 0}% match`}
                          className="text-sm font-semibold border shadow-lg"
                        />
                      </div>
                    </article>
                  </Link>
                ))}

              {!loading && !error && (!allJobs || allJobs.length === 0) && (
                <div className="py-12 text-center sm:py-16">
                  {/* <p className="text-lg text-gray-500">No jobs found.</p> */}
                  <Loader message="Loading jobs..." />
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}