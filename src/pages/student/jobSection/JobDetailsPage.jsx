import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaUserTie,
  FaMoneyBillWave,
  FaBuilding,
  FaCalendarAlt,
  FaUsers,
  FaGraduationCap,
  FaGift,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaBars,
  FaTimes,
  FaBriefcase,
  FaLaptop,
  FaCheckCircle,
  FaQuestionCircle,
  FaUserGraduate,
  FaVenus,
  FaChevronDown,
  FaChevronUp,
 
} from "react-icons/fa";
import Header from "../../../components/shared/Header";
import { useGetJobApi } from "../../../hooks/useGetJobApi";
import { useGetJobById } from "../../../hooks/useGetJobApi";
import { Button, Loader, Badge } from "../../../components/ui";
import ApplyForm from './applyForm';

export default function JobDetailsPage() {
  const { job_id } = useParams();
  const navigate = useNavigate();
  const {
    allJobs,
    loading: allJobsLoading,
    error: allJobsError,
    refetch,
  } = useGetJobApi();
  const {
    job: selectedJobDetails,
    loading: jobDetailsLoading,
    error: jobDetailsError,
  } = useGetJobById(job_id);


  const [selectedId, setSelectedId] = useState(job_id);
  const [isJobListOpen, setIsJobListOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // New state for show more/less
  const [showApplyForm, setShowApplyForm] = useState(false); // State for ApplyForm popup
  

  const handleSelect = (id) => {
    setSelectedId(id);
    navigate(`/jobs/${id}`);
    // Close mobile job list after selection
    setIsJobListOpen(false);
  };
  
  const toggleJobList = () => {
    setIsJobListOpen(!isJobListOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Loading state for all jobs
  if (allJobsLoading) {
    return (
      <div className="bg-[#f5f6f7] min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 sm:p-8">
            <Loader message="Loading jobs..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state for all jobs
  if (allJobsError) {
    return (
      <div className="bg-[#f5f6f7] min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 sm:p-8">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error loading jobs</p>
              <p className="text-sm mt-2">{allJobsError}</p>
              <Button
                onClick={refetch}
                variant="secondary"
                size="small"
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f6f7] min-h-screen">
      <Header />

      {/* Mobile Job List Toggle */}
      <div className="lg:hidden mb-2 sm:mb-3 px-2 sm:px-3 md:px-4 lg:px-6">
        <Button
          onClick={toggleJobList}
          variant="outline"
          size="default"
          className="flex items-center gap-1.5 bg-white rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 shadow border border-gray-200 w-full justify-center"
        >
          {isJobListOpen ? (
            <>
              <FaTimes className="text-gray-600 text-sm" />
              <span className="font-medium text-sm">Close Job List</span>
            </>
          ) : (
            <>
              <FaBars className="text-gray-600 text-sm" />
              <span className="font-medium text-sm">
                Show Job List ({allJobs?.length || 0} jobs)
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Desktop Job List */}
      <div className="max-w-7xl mx-auto pt-1 sm:pt-2 md:pt-4 lg:pt-6 pb-2 sm:pb-3 px-2 sm:px-3 md:px-4 lg:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-2">
          {/* Left: Job List */}
          <aside
            className={`bg-white rounded-2xl shadow border border-gray-100 flex flex-col self-start min-h-[80vh] sm:min-h-[100vh] lg:min-h-[120vh] p-2 ${isJobListOpen ? "block" : "hidden lg:flex"
              }`}
          >
            <div className="mb-2 sm:mb-3">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-1">
                Job List
              </h2>
              <p className="text-gray-500 text-xs">Top Jobs Picks for you</p>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3 overflow-y-auto max-h-[70vh] sm:max-h-[80vh] lg:max-h-[100vh] border border-gray-100 rounded-lg p-2">
              <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
                {allJobs &&
                  allJobs.map((job) => (
                    <button
                      key={job.job_id}
                      onClick={() => handleSelect(job.job_id)}
                      className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 rounded-lg px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 md:py-3 text-left transition border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 focus:outline-none relative ${selectedId === job.job_id.toString()
                        ? "bg-blue-100 border-blue-400"
                        : ""
                        }`}
                    >
                      <img
                        src={
                          job.logo_url ||
                          "https://via.placeholder.com/48x48?text=Logo"
                        }
                        alt="logo"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-contain bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs sm:text-sm truncate mb-0.5">
                          {job.jobRole}
                        </div>
                        <div className="text-gray-500 text-xs truncate mb-1.5">
                          {job.company_name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          {
                            job.company_location && (
                              <Badge color="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                <span className="truncate text-xs">
                                  {job.company_location}
                                </span>
                              </Badge>
                            )
                          }
                       
                          {
                            job.experience && (
                              <Badge color="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                <span className="truncate text-xs">
                                  {job.experience}
                                </span>
                              </Badge>
                            )
                          }
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[90px]">
                        <Badge
                          color={
                            job.hiring_status === "Actively Hiring"
                              ? "bg-red-400 text-white hover:bg-red-500"
                              : "bg-green-400 text-white hover:bg-green-500"
                          }
                          text={job.hiring_status}
                          className="text-xs font-semibold shadow"
                        />
                        <Badge color="bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {job.posted_days_ago}
                        </Badge>
                        <Badge
                          color={
                            job.matchPercentage > 70
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-yellow-400 text-gray-500 hover:bg-yellow-100"
                          }
                          text={`${job.matchPercentage || 0}% match`}
                          className="text-xs border border-gray-100"
                        />

                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </aside>

          {/* Right: Job Details */}
          <main
            className={`bg-white rounded-2xl shadow border border-gray-100 p-4`}
          >
            {jobDetailsLoading ? (
              <Loader message="Loading job details..." />
            ) : jobDetailsError ? (
              <div className="text-center text-red-600">
                <p className="text-base font-semibold">
                  Error loading job details
                </p>
                <p className="text-xs mt-1.5">{jobDetailsError}</p>
              </div>
            ) : !selectedJobDetails ? (
              <div className="text-center text-gray-600">
                <p className="text-base font-semibold">
                  Select a job to view details
                </p>
              </div>
            ) : (
              <>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 relative">
                  <img
                    src={selectedJobDetails.logo_url}
                    alt="Company Logo"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg object-contain bg-gray-100  flex-shrink-0 self-start"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base sm:text-lg md:text-xl leading-tight mb-1.5 truncate">
                      {selectedJobDetails.job_role}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base mb-2 truncate">
                      {selectedJobDetails.company_name}
                    </div>

                    {/* Job Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                      {selectedJobDetails.companyLocation && (
                        <Badge color="bg-purple-100 text-purple-700 hover:bg-purple-200">
                          <FaMapMarkerAlt className="text-purple-500 text-xs" />
                          <span className="truncate text-xs sm:text-sm">
                            {selectedJobDetails.companyLocation}
                          </span>
                        </Badge>
                      )}

                      {selectedJobDetails.opportunity_type && (
                        <Badge color="bg-orange-100 text-orange-700 hover:bg-orange-200">
                          <FaUserTie className="text-orange-500 text-xs" />
                          <span className="truncate text-xs sm:text-sm">
                            {selectedJobDetails.opportunity_type}
                          </span>
                        </Badge>
                      )}
                      {selectedJobDetails.salary && (
                        <Badge color="bg-emerald-100 text-emerald-600 hover:bg-emerald-200">
                          <span className="truncate text-xs sm:text-sm">
                            ₹{selectedJobDetails.salary}
                          </span>
                        </Badge>
                      )}
                      {selectedJobDetails.postedDaysAgo && (
                        <Badge color="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          <FaCalendarAlt className="text-blue-500 text-xs inline mr-1" />
                          <span className="truncate text-xs sm:text-sm">
                            {selectedJobDetails.postedDaysAgo}
                          </span>
                        </Badge>
                      )}
                    
                      <Badge color="bg-teal-100 text-teal-700 hover:bg-teal-200">
                        <FaUsers className="text-teal-500 text-xs inline mr-1" />
                        <span className="truncate text-xs sm:text-sm">
                                {selectedJobDetails.number_of_applicants} applicants
                        </span>
                      </Badge>
                      {selectedJobDetails.job_type && (
                        <Badge color="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                          <FaLaptop className="text-indigo-500 text-xs inline mr-1" />
                          <span className="truncate text-xs sm:text-sm">
                            {selectedJobDetails.job_type}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Apply Now Button - Top Right */}
                  <div className="absolute top-0 right-0">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setShowApplyForm(true)}
                      className={`font-semibold py-1.5 sm:py-2 px-2 sm:px-3 md:px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-1.5 text-xs sm:text-sm`}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
                {/* Job Description - Always visible */}
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                    <FaBriefcase className="text-blue-600 text-sm" />
                    Job Description
                  </h3>
                  <div className="prose prose-xs sm:prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedJobDetails.job_description ||
                        "No job description available."}
                    </p>
                  </div>
                </div>
                {/* About Company - Always visible */}
                {selectedJobDetails.aboutCompany && (
                  <div className="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                      <FaBuilding className="text-blue-600 text-sm" />
                      About {selectedJobDetails.company_name}
                    </h3>
                    <div className="prose prose-xs sm:prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {selectedJobDetails.aboutCompany}
                      </p>
                    </div>
                  </div>
                )}

                {/* Expandable Content Container */}
                <div className="relative">
                  <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
                    {/* Job Details - Single Column */}
                    <div className="space-y-3 sm:space-y-4 mb-4">
                      {/* Internship Details */}
                      {selectedJobDetails.opportunity_type === "Internship" && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-1.5 text-sm">
                            <FaCalendarAlt className="text-blue-600 text-xs" />
                            Internship Details
                          </h4>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">
                                {selectedJobDetails.internshipDuration}
                              </span>
                            </div>
                            {selectedJobDetails.internship_start_date && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Start Date:</span>
                                <span className="font-medium">
                                  {new Date(
                                    selectedJobDetails.internship_start_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {selectedJobDetails.incentive_per_year && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Incentive/Year:
                                </span>
                                <span className="font-medium">
                                 {selectedJobDetails.incentive_per_year}
                                </span>
                              </div>
                            )}
                            {selectedJobDetails.stipend_type && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Stipend Type:</span>
                                <span className="font-medium">
                                  {selectedJobDetails.stipend_type}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Company Information */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5 text-sm">
                          <FaBuilding className="text-gray-600 text-xs" />
                          Company Information
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Industry:</span>
                            <span className="font-medium">
                              {selectedJobDetails.companyIndustry}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">
                              {selectedJobDetails.companyLocation}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Openings:</span>
                            <span className="font-medium">
                              {selectedJobDetails.number_of_openings}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span
                              className={`font-medium ${selectedJobDetails.hiringStatus ===
                                "Actively Hiring"
                                ? "text-green-600"
                                : "text-orange-600"
                                }`}
                            >
                              {selectedJobDetails.hiringStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Skills Required */}
                      {selectedJobDetails.skillsRequired &&
                        selectedJobDetails.skillsRequired.length > 0 && (
                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-1.5 text-sm">
                              <FaStar className="text-purple-600 text-xs" />
                              Skills Required
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedJobDetails.skillsRequired.map(
                                (skill, index) => (
                                  <Badge
                                    key={index}
                                    color="bg-purple-100 text-purple-700 hover:bg-purple-200"
                                    text={skill}
                                    className="text-xs border border-purple-200"
                                  />
                                )
                              )}
                            </div>
                            {selectedJobDetails.skill_required_note && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                {selectedJobDetails.skill_required_note}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Perks & Benefits */}
                      {selectedJobDetails.perks &&
                        selectedJobDetails.perks.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-1.5 text-sm">
                              <FaGift className="text-yellow-600 text-xs" />
                              Perks & Benefits
                            </h4>
                            <div className="space-y-1.5">
                              {selectedJobDetails.perks.map((perk, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1.5 text-xs"
                                >
                                  <FaCheckCircle className="text-yellow-600 text-xs" />
                                  <span>{perk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Eligible Cities */}
                      {selectedJobDetails.eligible_cities && selectedJobDetails.eligible_cities.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-1.5 text-sm">
                            <FaMapMarkerAlt className="text-blue-600 text-xs" />
                            Eligible Cities
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJobDetails.eligible_cities.map((city, index) => (
                              <Badge
                                key={`city-${index}`}
                                color="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                text={city.name}
                                className="text-xs border border-blue-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Eligible Colleges */}
                      {selectedJobDetails.eligible_colleges && selectedJobDetails.eligible_colleges.length > 0 && (
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-1.5 text-sm">
                            <FaBuilding className="text-purple-600 text-xs" />
                            Eligible Colleges
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJobDetails.eligible_colleges.map((college, index) => (
                              <Badge
                                key={`college-${index}`}
                                color="bg-purple-100 text-purple-700 hover:bg-purple-200"
                                text={college.name}
                                className="text-xs border border-purple-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Eligible Courses */}
                      {selectedJobDetails.eligible_courses && selectedJobDetails.eligible_courses.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1.5 text-sm">
                            <FaGraduationCap className="text-green-600 text-xs" />
                            Eligible Courses
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJobDetails.eligible_courses.map((course, index) => (
                              <Badge
                                key={`course-${index}`}
                                color="bg-green-100 text-green-700 hover:bg-green-200"
                                text={course.name}
                                className="text-xs border border-green-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Candidate Preferences */}
                      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                        <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-1.5 text-sm">
                          <FaUserGraduate className="text-indigo-600 text-xs" />
                          Candidate Preferences
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Preferences:</span>
                            <span className="font-medium">
                              {selectedJobDetails.candidate_preferences}
                            </span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="text-gray-600">
                              Hiring Preferences:
                            </span>
                            <span className="font-medium">
                              {selectedJobDetails.hiring_preferences}
                            </span>
                          </div> */}
                          {selectedJobDetails.women_preferred && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Women Preferred:
                              </span>
                              <span className="font-medium text-green-600 flex items-center gap-1">
                                <FaVenus className="text-pink-500 text-xs" />
                                Yes
                              </span>
                            </div>
                          )}
                          {selectedJobDetails.languages_known && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Languages:</span>
                              <span className="font-medium">
                                {selectedJobDetails.languages_known}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Screening Questions */}
                    {selectedJobDetails.screening_questions &&
                      selectedJobDetails.screening_questions.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                            <FaQuestionCircle className="text-blue-600 text-sm" />
                            Screening Questions
                          </h3>
                          <div className="space-y-2">
                            {selectedJobDetails.screening_questions.map(
                              (question, index) => (
                                <div
                                  key={index}
                                  className="bg-orange-50 rounded-lg p-3 border border-orange-200"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold rounded-full px-1.5 py-0.5 mt-0.5">
                                      Q{index + 1}
                                    </span>
                                    <p className="text-gray-700 text-xs">
                                      {question}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Recruiter Information */}
                    <div className="mb-4">
                      <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                        <FaUserTie className="text-blue-600 text-sm" />
                        Recruiter Information
                      </h3>
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={selectedJobDetails.recruiter_profile_pic}
                              alt="Recruiter"
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {selectedJobDetails.recruiter_full_name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {selectedJobDetails.recruiterDesignationName}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <FaEnvelope className="text-gray-400 text-xs" />
                              <span className="text-gray-700">
                                {selectedJobDetails.recruiter_email}
                              </span>
                            </div>
                            {selectedJobDetails.phone_contact && (
                              <div className="flex items-center gap-1.5">
                                <FaPhone className="text-gray-400 text-xs" />
                                <span className="text-gray-700">
                                  {selectedJobDetails.phone_contact}
                                </span>
                              </div>
                            )}
                            {selectedJobDetails.alternate_phone_number && (
                              <div className="flex items-center gap-1.5">
                                <FaPhone className="text-gray-400 text-xs" />
                                <span className="text-gray-700">
                                  {selectedJobDetails.alternate_phone_number}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="mb-4">
                      <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                        <FaCheckCircle className="text-blue-600 text-sm" />
                        Verification Status
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div
                          className={`flex items-center gap-1.5 p-2 rounded-lg ${selectedJobDetails.is_email_verified
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                            }`}
                        >
                          <FaEnvelope
                            className={`text-xs ${selectedJobDetails.is_email_verified
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          />
                          <span
                            className={`text-xs font-medium ${selectedJobDetails.is_email_verified
                              ? "text-green-700"
                              : "text-red-700"
                              }`}
                          >
                            Email{" "}
                            {selectedJobDetails.is_email_verified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 p-2 rounded-lg ${selectedJobDetails.is_phone_verified
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                            }`}
                        >
                          <FaPhone
                            className={`text-xs ${selectedJobDetails.is_phone_verified
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          />
                          <span
                            className={`text-xs font-medium ${selectedJobDetails.is_phone_verified
                              ? "text-green-700"
                              : "text-red-700"
                              }`}
                          >
                            Phone{" "}
                            {selectedJobDetails.is_phone_verified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 p-2 rounded-lg ${selectedJobDetails.is_gst_verified
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                            }`}
                        >
                          <FaBuilding
                            className={`text-xs ${selectedJobDetails.is_gst_verified
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          />
                          <span
                            className={`text-xs font-medium ${selectedJobDetails.is_gst_verified
                              ? "text-green-700"
                              : "text-red-700"
                              }`}
                          >
                            GST{" "}
                            {selectedJobDetails.is_gst_verified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Gradient Fade Effect - Only visible when content is collapsed */}
                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white to-transparent pointer-events-none"></div>
                  )}
                </div>
                {/* Show More/Less Button */}
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={toggleExpanded}
                    variant="outline"
                    size="default"
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 px-6 py-2 rounded-full font-medium text-gray-700 hover:text-blue-600"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show Less</span>
                        <FaChevronUp className="text-sm" />
                      </>
                    ) : (
                      <>
                        <span>Show More Details</span>
                        <FaChevronDown className="text-sm" />
                      </>
                    )}
                  </Button>
                </div>

              </>
            )}
          </main>
        </div>
      </div>

      {/* Apply Form Popup */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowApplyForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <ApplyForm
              jobId={job_id}
              onClose={() => setShowApplyForm(false)}
              onSubmit={(formData) => {
                console.log('Form submitted:', formData);
                // The actual submission is handled by the useApplyToJob hook in the ApplyForm component
                setShowApplyForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};