import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaMoneyBillWave, FaBuilding, FaCalendarAlt, FaUsers, FaClock, FaGraduationCap, FaPhone, FaEnvelope, FaStar, FaBars, FaTimes } from "react-icons/fa";
import Header from "../../shared/Header";
import { useGetJobApi } from "../../../hooks/useGetJobApi";
import { useGetJobById } from "../../../hooks/useGetJobApi";

export default function JobDetailsPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { allJobs, loading: allJobsLoading, error: allJobsError, refetch } = useGetJobApi();
    const { job: selectedJobDetails, loading: jobDetailsLoading, error: jobDetailsError } = useGetJobById(jobId);

    const [selectedId, setSelectedId] = useState(jobId);
    const [isJobListOpen, setIsJobListOpen] = useState(false);

    const handleSelect = (id) => {
        setSelectedId(id);
        navigate(`/jobs/${id}`);
        // Close mobile job list after selection
        setIsJobListOpen(false);
    };

    const toggleJobList = () => {
        setIsJobListOpen(!isJobListOpen);
    };

    // Loading state for all jobs
    if (allJobsLoading) {
        return (
            <div className="bg-[#f5f6f7] min-h-screen">
                <Header />
                <div className="max-w-8xl mx-auto pt-14 pb-10 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
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
                <div className="max-w-8xl mx-auto pt-14 pb-10 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
                        <div className="text-center text-red-600">
                            <p className="text-lg font-semibold">Error loading jobs</p>
                            <p className="text-sm mt-2">{allJobsError}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f6f7] min-h-[180vh]">
            <Header />

            {/* Mobile Job List Toggle */}
            <div className="lg:hidden px-4 pt-4">
                <button
                    onClick={toggleJobList}
                    className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow border border-gray-200 w-full justify-center"
                >
                    {isJobListOpen ? (
                        <>
                            <FaTimes className="text-gray-600" />
                            <span className="font-medium">Close Job List</span>
                        </>
                    ) : (
                        <>
                            <FaBars className="text-gray-600" />
                            <span className="font-medium">Show Job List ({allJobs?.length || 0} jobs)</span>
                        </>
                    )}
                </button>
            </div>

            <div className="max-w-8xl mx-auto pt-4 lg:pt-14 pb-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6">
                    {/* Left: Job List */}
                    <aside className={`bg-white rounded-2xl shadow border border-gray-100 flex flex-col self-start min-h-[140vh] p-4 sm:p-6 ${isJobListOpen ? 'block' : 'hidden lg:flex'}`}>
                        <p className="text-gray-500 text-sm mb-4">Top Jobs Picks for you</p>
                        <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[140vh] border border-gray-100 rounded-lg p-2">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {allJobs && allJobs.map((job) => (
                                    <button
                                        key={job.jobId}
                                        onClick={() => handleSelect(job.jobId)}
                                        className={`flex items-center gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-left transition border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 focus:outline-none relative ${selectedId === job.jobId.toString() ? 'bg-blue-100 border-blue-400' : ''}`}
                                    >
                                        <img
                                            src={job.logoUrl || "https://via.placeholder.com/64x64?text=Logo"}
                                            alt="logo"
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain bg-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm sm:text-base truncate mb-1">{job.jobProfile}</div>
                                            <div className="text-gray-500 text-xs sm:text-sm truncate mb-2">{job.companyName}</div>
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                <span className="bg-gray-100 rounded-full px-2 sm:px-3 py-1 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                                                    <span className="truncate">{job.location}</span>
                                                </span>
                                                {job.salary && (
                                                    <span className="bg-emerald-100 text-emerald-600 text-xs rounded-full px-2 sm:px-3 py-1 border border-emerald-200">
                                                        <span className="truncate">₹{job.salary}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 sm:gap-2 min-w-[90px] sm:min-w-[110px]">
                                            <span className={`text-white text-xs font-semibold rounded-full px-2 sm:px-3 py-1 shadow ${job.hiringStatus === 'Actively Hiring' ? 'bg-red-400' : 'bg-green-400'}`}>
                                                {job.hiringStatus}
                                            </span>
                                            <span className={`text-xs rounded-full px-2 sm:px-3 py-1 border font-semibold ${job.matchPercentage > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {job.matchPercentage || 0}% match
                                            </span>
                                            <span className="bg-gray-100 rounded-full px-2 sm:px-3 py-1 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                                                <span className="hidden sm:inline">Posted: </span>
                                                {job.postedDaysAgo === 'Today' || job.postedDaysAgo === 0
                                                    ? 'Today'
                                                    : `${job.postedDaysAgo} days ago`}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right: Job Details */}
                    <main className="bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-6 lg:p-8 min-h-[120vh] flex flex-col relative">
                        {jobDetailsLoading ? (
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ) : jobDetailsError ? (
                            <div className="text-center text-red-600">
                                <p className="text-lg font-semibold">Error loading job details</p>
                                <p className="text-sm mt-2">{jobDetailsError}</p>
                            </div>
                        ) : !selectedJobDetails ? (
                            <div className="text-center text-gray-600">
                                <p className="text-lg font-semibold">Select a job to view details</p>
                            </div>
                        ) : (
                            <>
                                {/* Header Section */}
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6 relative">
                                    <img
                                        src={selectedJobDetails.logoUrl || "https://via.placeholder.com/96x96?text=Logo"}
                                        alt="Company Logo"
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-contain bg-gray-100 border border-gray-200 flex-shrink-0 self-start"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-xl sm:text-2xl leading-tight mb-2">{selectedJobDetails.jobProfile}</div>
                                        <div className="text-gray-600 text-base sm:text-lg mb-3">{selectedJobDetails.companyName}</div>

                                        {/* Job Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-purple-100 rounded-full px-2 sm:px-3 py-1 text-xs text-purple-700 border border-purple-200 flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-purple-500 text-xs" />
                                                <span className="truncate">{selectedJobDetails.companyLocation}</span>
                                            </span>
                                            <span className="bg-orange-100 rounded-full px-2 sm:px-3 py-1 text-xs text-orange-700 border border-orange-200 flex items-center gap-1">
                                                <FaUserTie className="text-orange-500 text-xs" />
                                                <span className="truncate">{selectedJobDetails.opportunityType}</span>
                                            </span>
                                            <span className="bg-emerald-100 rounded-full px-2 sm:px-3 py-1 text-xs text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                <FaMoneyBillWave className="text-emerald-500 text-xs" />
                                                <span className="truncate">₹{selectedJobDetails.salary}</span>
                                            </span>
                                            <span className="bg-blue-100 rounded-full px-2 sm:px-3 py-1 text-xs text-blue-700 border border-blue-200">
                                                <FaCalendarAlt className="text-blue-500 text-xs inline mr-1" />
                                                <span className="truncate">{selectedJobDetails.postedDaysAgo}</span>
                                            </span>
                                            <span className="bg-teal-100 rounded-full px-2 sm:px-3 py-1 text-xs text-teal-700 border border-teal-200">
                                                <FaUsers className="text-teal-500 text-xs inline mr-1" />
                                                <span className="truncate">{selectedJobDetails.numberOfApplicants} applicants</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Apply Now Button - Top Right */}
                                    <div className="absolute top-0 right-0">
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                                            onClick={() => {
                                                // Handle apply functionality here
                                                console.log('Applying for job:', selectedJobDetails.jobId);
                                            }}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 mb-6"></div>

                                {/* Job Details - Single Column */}
                                <div className="space-y-4 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
                                            <FaBuilding className="text-blue-600" />
                                            Company Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Industry:</span> {selectedJobDetails.companyIndustry}</p>
                                            <p><span className="font-medium">About:</span> {selectedJobDetails.aboutCompany}</p>
                                            <p><span className="font-medium">Location:</span> {selectedJobDetails.companyLocation}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
                                            <FaClock className="text-green-600" />
                                            Job Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Job Type:</span> {selectedJobDetails.jobType}</p>
                                            <p><span className="font-medium">Duration:</span> {selectedJobDetails.internshipDuration}</p>
                                            <p><span className="font-medium">Start Date:</span> {selectedJobDetails.internshipStartDate}</p>
                                            <p><span className="font-medium">Openings:</span> {selectedJobDetails.numberOfOpenings}</p>
                                            <p><span className="font-medium">Hiring Status:</span> {selectedJobDetails.hiringStatus}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
                                            <FaGraduationCap className="text-purple-600" />
                                            Requirements
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Course:</span> {selectedJobDetails.course}</p>
                                            <p><span className="font-medium">College:</span> {selectedJobDetails.collegeName}</p>
                                            <p><span className="font-medium">Languages:</span> {selectedJobDetails.languagesKnown}</p>
                                            <p><span className="font-medium">Experience Note:</span> {selectedJobDetails.skillRequiredNote}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
                                            <FaStar className="text-yellow-600" />
                                            Benefits & Perks
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Stipend Type:</span> {selectedJobDetails.stipendType}</p>
                                            <p><span className="font-medium">Incentive:</span> ₹{selectedJobDetails.incentivePerYear}/year</p>
                                            <p><span className="font-medium">Perks:</span></p>
                                            <ul className="list-disc list-inside ml-2">
                                                {selectedJobDetails.perks && selectedJobDetails.perks.map((perk, index) => (
                                                    <li key={index}>{perk}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Required */}
                                {selectedJobDetails.skillsRequired && selectedJobDetails.skillsRequired.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-base sm:text-lg mb-3">Skills Required</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJobDetails.skillsRequired.map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-blue-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Job Description */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-base sm:text-lg mb-3">Job Description</h3>
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{selectedJobDetails.jobDescription}</p>
                                </div>

                                {/* Screening Questions */}
                                {selectedJobDetails.screeningQuestions && selectedJobDetails.screeningQuestions.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-base sm:text-lg mb-3">Screening Questions</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
                                            {selectedJobDetails.screeningQuestions.map((question, index) => (
                                                <li key={index}>{question}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Recruiter Information */}
                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-base sm:text-lg mb-3">Recruiter Information</h3>
                                    <div className="flex items-center gap-4 mb-3">
                                        <img
                                            src={selectedJobDetails.recruiterProfilePic || "https://via.placeholder.com/48x48?text=RP"}
                                            alt="Recruiter"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{selectedJobDetails.recruiterName}</p>
                                            <p className="text-sm text-gray-600">{selectedJobDetails.recruiterDesignation}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-500" />
                                            <span className="truncate">{selectedJobDetails.recruiterEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-gray-500" />
                                            <span>{selectedJobDetails.recruiterPhone}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
} 