import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaMoneyBillWave, FaBuilding, FaCalendarAlt, FaUsers, FaClock, FaGraduationCap, FaPhone, FaEnvelope, FaStar, FaBars, FaTimes, FaBriefcase, FaLaptop, FaCertificate, FaGift, FaCheckCircle, FaQuestionCircle, FaIndustry, FaGlobe, FaUserGraduate, FaLanguage, FaVenus } from "react-icons/fa";
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
                <div className="max-w-8xl mx-auto pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 sm:p-8">
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
                <div className="max-w-8xl mx-auto pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 sm:p-8">
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
            <div className="lg:hidden px-2 sm:px-4 pt-2 sm:pt-4">
                <button
                    onClick={toggleJobList}
                    className="flex items-center gap-2 bg-white rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow border border-gray-200 w-full justify-center"
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

            <div className="max-w-8xl mx-auto pt-2 sm:pt-4 md:pt-6 lg:pt-14 pb-8 sm:pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-4 sm:gap-6">
                    {/* Left: Job List */}
                    <aside className={`bg-white rounded-2xl shadow border border-gray-100 flex flex-col self-start min-h-[140vh] p-3 sm:p-4 md:p-6 ${isJobListOpen ? 'block' : 'hidden lg:flex'}`}>
                        <p className="text-gray-500 text-sm mb-3 sm:mb-4">Top Jobs Picks for you</p>
                        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-y-auto max-h-[140vh] border border-gray-100 rounded-lg p-2">
                            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                                {allJobs && allJobs.map((job) => (
                                    <button
                                        key={job.jobId}
                                        onClick={() => handleSelect(job.jobId)}
                                        className={`flex items-center gap-2 sm:gap-3 md:gap-4 rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-left transition border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 focus:outline-none relative ${selectedId === job.jobId.toString() ? 'bg-blue-100 border-blue-400' : ''}`}
                                    >
                                        <img
                                            src={job.logoUrl || "https://via.placeholder.com/64x64?text=Logo"}
                                            alt="logo"
                                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg object-contain bg-gray-100 flex-shrink-0"
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
                                        <div className="flex flex-col items-end gap-1 sm:gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[110px]">
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
                    <main className="bg-white rounded-2xl shadow border border-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 min-h-[120vh] flex flex-col relative">
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
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 relative">
                                    <img
                                        src={selectedJobDetails.logoUrl || "https://via.placeholder.com/96x96?text=Logo"}
                                        alt="Company Logo"
                                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-contain bg-gray-100 border border-gray-200 flex-shrink-0 self-start"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-lg sm:text-xl md:text-2xl leading-tight mb-2">{selectedJobDetails.jobProfile}</div>
                                        <div className="text-gray-600 text-sm sm:text-base md:text-lg mb-3">{selectedJobDetails.companyName}</div>

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
                                            <span className="bg-red-100 rounded-full px-2 sm:px-3 py-1 text-xs text-red-700 border border-red-200">
                                                <FaClock className="text-red-500 text-xs inline mr-1" />
                                                <span className="truncate">{selectedJobDetails.jobTime}</span>
                                            </span>
                                            <span className="bg-indigo-100 rounded-full px-2 sm:px-3 py-1 text-xs text-indigo-700 border border-indigo-200">
                                                <FaLaptop className="text-indigo-500 text-xs inline mr-1" />
                                                <span className="truncate">{selectedJobDetails.jobType}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Apply Now Button - Top Right */}
                                    <div className="absolute top-0 right-0">
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 md:px-8 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                                            onClick={() => {
                                                // Handle apply functionality here
                                                console.log('Applying for job:', selectedJobDetails.jobId);
                                            }}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                        <FaBriefcase className="text-blue-600" />
                                        Job Description
                                    </h3>
                                    <div className="prose prose-sm sm:prose-base max-w-none">
                                        <p className="text-gray-700 leading-relaxed">
                                            {selectedJobDetails.jobDescription || "No job description available."}
                                        </p>
                                    </div>
                                </div>

                                {/* Job Details - Single Column */}
                                <div className="space-y-6 mb-6">
                                    {/* Internship Details */}
                                    {selectedJobDetails.opportunityType === 'Internship' && (
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                                <FaCalendarAlt className="text-blue-600" />
                                                Internship Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Duration:</span>
                                                    <span className="font-medium">{selectedJobDetails.internshipDuration}</span>
                                                </div>
                                                {selectedJobDetails.internshipStartDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Start Date:</span>
                                                        <span className="font-medium">{new Date(selectedJobDetails.internshipStartDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                {selectedJobDetails.incentivePerYear && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Incentive/Year:</span>
                                                        <span className="font-medium">₹{selectedJobDetails.incentivePerYear}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Stipend Type:</span>
                                                    <span className="font-medium">{selectedJobDetails.stipendType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Company Information */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <FaBuilding className="text-gray-600" />
                                            Company Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Industry:</span>
                                                <span className="font-medium">{selectedJobDetails.companyIndustry}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Location:</span>
                                                <span className="font-medium">{selectedJobDetails.companyLocation}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Openings:</span>
                                                <span className="font-medium">{selectedJobDetails.numberOfOpenings}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`font-medium ${selectedJobDetails.hiringStatus === 'Actively Hiring' ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {selectedJobDetails.hiringStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Required */}
                                    {selectedJobDetails.skillsRequired && selectedJobDetails.skillsRequired.length > 0 && (
                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                                <FaStar className="text-purple-600" />
                                                Skills Required
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedJobDetails.skillsRequired.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-purple-100 text-purple-700 text-xs rounded-full px-3 py-1 border border-purple-200"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            {selectedJobDetails.skillRequiredNote && (
                                                <p className="text-sm text-gray-600 mt-3 italic">
                                                    {selectedJobDetails.skillRequiredNote}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Perks & Benefits */}
                                    {selectedJobDetails.perks && selectedJobDetails.perks.length > 0 && (
                                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                                                <FaGift className="text-yellow-600" />
                                                Perks & Benefits
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedJobDetails.perks.map((perk, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <FaCheckCircle className="text-yellow-600 text-xs" />
                                                        <span>{perk}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Educational Requirements */}
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                            <FaGraduationCap className="text-green-600" />
                                            Educational Requirements
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">College:</span>
                                                <span className="font-medium">{selectedJobDetails.collegeName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Course:</span>
                                                <span className="font-medium">{selectedJobDetails.course}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Candidate Preferences */}
                                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                        <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                                            <FaUserGraduate className="text-indigo-600" />
                                            Candidate Preferences
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Preferences:</span>
                                                <span className="font-medium">{selectedJobDetails.candidatePreferences}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Hiring Preferences:</span>
                                                <span className="font-medium">{selectedJobDetails.hiringPreferences}</span>
                                            </div>
                                            {selectedJobDetails.womenPreferred && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Women Preferred:</span>
                                                    <span className="font-medium text-green-600 flex items-center gap-1">
                                                        <FaVenus className="text-pink-500" />
                                                        Yes
                                                    </span>
                                                </div>
                                            )}
                                            {selectedJobDetails.languagesKnown && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Languages:</span>
                                                    <span className="font-medium">{selectedJobDetails.languagesKnown}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* About Company */}
                                {selectedJobDetails.aboutCompany && (
                                    <div className="mb-6">
                                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                            <FaIndustry className="text-blue-600" />
                                            About the Company
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedJobDetails.aboutCompany}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Screening Questions */}
                                {selectedJobDetails.screeningQuestions && selectedJobDetails.screeningQuestions.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                            <FaQuestionCircle className="text-blue-600" />
                                            Screening Questions
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedJobDetails.screeningQuestions.map((question, index) => (
                                                <div key={index} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                                    <div className="flex items-start gap-3">
                                                        <span className="bg-orange-100 text-orange-700 text-xs font-semibold rounded-full px-2 py-1 mt-1">
                                                            Q{index + 1}
                                                        </span>
                                                        <p className="text-gray-700 text-sm">{question}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recruiter Information */}
                                <div className="mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                        <FaUserTie className="text-blue-600" />
                                        Recruiter Information
                                    </h3>
                                    <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={selectedJobDetails.recruiterProfilePic || "https://via.placeholder.com/48x48?text=Avatar"}
                                                    alt="Recruiter"
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{selectedJobDetails.recruiterName}</h4>
                                                    <p className="text-sm text-gray-600">{selectedJobDetails.recruiterDesignation}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400" />
                                                    <span className="text-gray-700">{selectedJobDetails.recruiterEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaPhone className="text-gray-400" />
                                                    <span className="text-gray-700">{selectedJobDetails.recruiterPhone}</span>
                                                </div>
                                                {selectedJobDetails.phoneContact && (
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone className="text-gray-400" />
                                                        <span className="text-gray-700">{selectedJobDetails.phoneContact}</span>
                                                    </div>
                                                )}
                                                {selectedJobDetails.alternatePhoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone className="text-gray-400" />
                                                        <span className="text-gray-700">{selectedJobDetails.alternatePhoneNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Status */}
                                <div className="mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                        <FaCheckCircle className="text-blue-600" />
                                        Verification Status
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className={`flex items-center gap-2 p-3 rounded-lg ${selectedJobDetails.isEmailVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <FaEnvelope className={selectedJobDetails.isEmailVerified ? 'text-green-600' : 'text-red-600'} />
                                            <span className={`text-sm font-medium ${selectedJobDetails.isEmailVerified ? 'text-green-700' : 'text-red-700'}`}>
                                                Email {selectedJobDetails.isEmailVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-2 p-3 rounded-lg ${selectedJobDetails.isPhoneVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <FaPhone className={selectedJobDetails.isPhoneVerified ? 'text-green-600' : 'text-red-600'} />
                                            <span className={`text-sm font-medium ${selectedJobDetails.isPhoneVerified ? 'text-green-700' : 'text-red-700'}`}>
                                                Phone {selectedJobDetails.isPhoneVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-2 p-3 rounded-lg ${selectedJobDetails.isGstVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <FaBuilding className={selectedJobDetails.isGstVerified ? 'text-green-600' : 'text-red-600'} />
                                            <span className={`text-sm font-medium ${selectedJobDetails.isGstVerified ? 'text-green-700' : 'text-red-700'}`}>
                                                GST {selectedJobDetails.isGstVerified ? 'Verified' : 'Not Verified'}
                                            </span>
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