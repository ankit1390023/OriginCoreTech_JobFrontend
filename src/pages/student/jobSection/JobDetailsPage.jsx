import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaMoneyBillWave, FaBuilding, FaCalendarAlt, FaUsers, FaClock, FaGraduationCap, FaPhone, FaEnvelope, FaStar, FaBars, FaTimes, FaBriefcase, FaLaptop, FaCertificate, FaGift, FaCheckCircle, FaQuestionCircle, FaIndustry, FaGlobe, FaUserGraduate, FaLanguage, FaVenus } from "react-icons/fa";
import Header from "../../../components/shared/Header";
import { useGetJobApi } from "../../../hooks/useGetJobApi";
import { useGetJobById } from "../../../hooks/useGetJobApi";
import { Button, Loader, Badge } from '../../../components/ui';
import { getImageUrl } from "../../../../utils";
export default function JobDetailsPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { allJobs, loading: allJobsLoading, error: allJobsError, refetch } = useGetJobApi();
    const { job: selectedJobDetails, loading: jobDetailsLoading, error: jobDetailsError } = useGetJobById(jobId);

    const [selectedId, setSelectedId] = useState(jobId);
    const [isJobListOpen, setIsJobListOpen] = useState(false);
    const [showFullDetails, setShowFullDetails] = useState(false);

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
                <div className="max-w-8xl mx-auto pt-10 sm:pt-12 md:pt-14 pb-8 sm:pb-10 px-2 sm:px-4 md:px-6 lg:px-8">
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
        <div className="bg-[#f5f6f7] min-h-[180vh]">
            <Header />

            {/* Mobile Job List Toggle */}
            <div className="lg:hidden px-2 sm:px-4 pt-2 sm:pt-4">
                <Button
                    onClick={toggleJobList}
                    variant="outline"
                    size="default"
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
                </Button>
            </div>

            <div className="max-w-8xl mx-auto pt-1 sm:pt-2 md:pt-4 lg:pt-8 pb-4 sm:pb-6 px-2 sm:px-3 md:px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-3 sm:gap-4">
                    {/* Left: Job List */}
                    <aside className={`bg-white rounded-xl shadow border border-gray-100 flex flex-col self-start min-h-[120vh] p-2 sm:p-3 md:p-4 ${isJobListOpen ? 'block' : 'hidden lg:flex'}`}>
                        <p className="text-gray-500 text-xs mb-2 sm:mb-3">Top Jobs Picks for you</p>
                        <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3 overflow-y-auto max-h-[120vh] border border-gray-100 rounded-lg p-1.5">
                            <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
                                {allJobs && allJobs.map((job) => (
                                    <button
                                        key={job.jobId}
                                        onClick={() => handleSelect(job.jobId)}
                                        className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 rounded-lg px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 md:py-3 text-left transition border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 focus:outline-none relative ${selectedId === job.jobId.toString() ? 'bg-blue-100 border-blue-400' : ''}`}
                                    >

                                        <img
                                            src={getImageUrl(job.logoUrl) || "https://via.placeholder.com/48x48?text=Logo"}
                                            alt="logo"
                                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-contain bg-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-xs sm:text-sm truncate mb-0.5">{job.jobProfile}</div>
                                            <div className="text-gray-500 text-xs truncate mb-1.5">{job.companyName}</div>
                                            <div className="flex flex-wrap items-center gap-1">
                                                <Badge
                                                    color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                >
                                                    <span className="truncate">{job.location}</span>
                                                </Badge>
                                                {job.salary && (
                                                    <Badge
                                                        color="bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                    >
                                                        <span className="truncate">₹{job.salary}</span>
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 min-w-[70px] sm:min-w-[80px] md:min-w-[90px]">
                                            <Badge
                                                color={job.hiringStatus === 'Actively Hiring' ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-green-400 text-white hover:bg-green-500'}
                                                text={job.hiringStatus}
                                                className="text-xs font-semibold shadow"
                                            />
                                            <Badge
                                                color={job.matchPercentage > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                                                text={`${job.matchPercentage || 0}% match`}
                                                className="text-xs border font-semibold"
                                            />
                                            <Badge
                                                color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            >
                                                <span className="hidden sm:inline">Posted: </span>
                                                {job.postedDaysAgo === 'Today' || job.postedDaysAgo === 0
                                                    ? 'Today'
                                                    : `${job.postedDaysAgo} days ago`}
                                            </Badge>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right: Job Details */}
                    <main className={`bg-white rounded-xl shadow border border-gray-100 p-2 sm:p-3 md:p-4 lg:p-6 flex flex-col relative ${showFullDetails ? 'min-h-auto' : 'min-h-[120vh] max-h-[100vh] overflow-hidden'}`}>
                        {jobDetailsLoading ? (
                            <Loader message="Loading job details..." />
                        ) : jobDetailsError ? (
                            <div className="text-center text-red-600">
                                <p className="text-base font-semibold">Error loading job details</p>
                                <p className="text-xs mt-1.5">{jobDetailsError}</p>
                            </div>
                        ) : !selectedJobDetails ? (
                            <div className="text-center text-gray-600">
                                <p className="text-base font-semibold">Select a job to view details</p>
                            </div>
                        ) : (
                            <>
                                {/* Header Section */}
                                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 relative">
                                    <img
                                        src={getImageUrl(selectedJobDetails.logoUrl)}
                                        alt="Company Logo"
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg object-contain bg-gray-100 border border-gray-200 flex-shrink-0 self-start"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-base sm:text-lg md:text-xl leading-tight mb-1.5">{selectedJobDetails.jobProfile}</div>
                                        <div className="text-gray-600 text-sm sm:text-base mb-2">{selectedJobDetails.companyName}</div>

                                        {/* Job Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {
                                                selectedJobDetails.companyLocation && (
                                                    <Badge
                                                        color="bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                    >
                                                        <FaMapMarkerAlt className="text-purple-500 text-xs" />
                                                        <span className="truncate">{selectedJobDetails.companyLocation}</span>
                                                    </Badge>
                                                )
                                            }

                                            {
                                                selectedJobDetails.opportunityType && (
                                                    <Badge
                                                        color="bg-orange-100 text-orange-700 hover:bg-orange-200"
                                                    >
                                                        <FaUserTie className="text-orange-500 text-xs" />
                                                        <span className="truncate">{selectedJobDetails.opportunityType}</span>
                                                    </Badge>
                                                )
                                            }
                                            {
                                                selectedJobDetails.salary && (
                                                    <Badge
                                                        color="bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                    >
                                                        <span className="truncate">₹{selectedJobDetails.salary}</span>
                                                    </Badge>)
                                            }
                                            {
                                                selectedJobDetails.postedDaysAgo && (
                                                    <Badge
                                                        color="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                    >
                                                        <FaCalendarAlt className="text-blue-500 text-xs inline mr-1" />
                                                        <span className="truncate">{selectedJobDetails.postedDaysAgo}</span>
                                                    </Badge>
                                                )
                                            }
                                            {
                                                selectedJobDetails.numberofApplicants && (
                                                    <Badge
                                                        color="bg-teal-100 text-teal-700 hover:bg-teal-200"
                                                    >
                                                        <FaUsers className="text-teal-500 text-xs inline mr-1" />
                                                        <span className="truncate">{selectedJobDetails.numberOfApplicants} applicants</span>
                                                    </Badge>
                                                )
                                            }
                                            {
                                                selectedJobDetails.numberOfApplicants && (
                                                    <Badge
                                                        color="bg-teal-100 text-teal-700 hover:bg-teal-200"
                                                    >
                                                        <FaUsers className="text-teal-500 text-xs inline mr-1" />
                                                        <span className="truncate">{selectedJobDetails.numberOfApplicants} applicants</span>
                                                    </Badge>

                                                )
                                            }
                                            {
                                                selectedJobDetails.jobType && (
                                                    <Badge
                                                        color="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                                    >
                                                        <FaLaptop className="text-indigo-500 text-xs inline mr-1" />
                                                        <span className="truncate">{selectedJobDetails.jobType}</span>
                                                    </Badge>
                                                )
                                            }

                                        </div>
                                    </div>

                                    {/* Apply Now Button - Top Right */}
                                    <div className="absolute top-0 right-0">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-3 md:px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-1.5 text-xs sm:text-sm"
                                            onClick={() => {
                                                // Handle apply functionality here
                                                console.log('Applying for job:', selectedJobDetails.jobId);
                                            }}
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="mb-4">
                                    <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                                        <FaBriefcase className="text-blue-600 text-sm" />
                                        Job Description
                                    </h3>
                                    <div className="prose prose-xs sm:prose-sm max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {selectedJobDetails.jobDescription || "No job description available."}
                                        </p>
                                    </div>
                                </div>

                                {/* Job Details - Single Column */}
                                <div className="space-y-4 mb-4">
                                    {/* Internship Details */}
                                    {selectedJobDetails.opportunityType === 'Internship' && (
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-1.5 text-sm">
                                                <FaCalendarAlt className="text-blue-600 text-xs" />
                                                Internship Details
                                            </h4>
                                            <div className="space-y-1.5 text-xs">
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
                                                {
                                                    selectedJobDetails.stipendType && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Stipend Type:</span>
                                                            <span className="font-medium">{selectedJobDetails.stipendType}</span>
                                                        </div>
                                                    )
                                                }
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
                                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-1.5 text-sm">
                                                <FaStar className="text-purple-600 text-xs" />
                                                Skills Required
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedJobDetails.skillsRequired.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        color="bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                        text={skill}
                                                        className="text-xs border border-purple-200"
                                                    />
                                                ))}
                                            </div>
                                            {selectedJobDetails.skillRequiredNote && (
                                                <p className="text-xs text-gray-600 mt-2 italic">
                                                    {selectedJobDetails.skillRequiredNote}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Perks & Benefits */}
                                    {selectedJobDetails.perks && selectedJobDetails.perks.length > 0 && (
                                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-1.5 text-sm">
                                                <FaGift className="text-yellow-600 text-xs" />
                                                Perks & Benefits
                                            </h4>
                                            <div className="space-y-1.5">
                                                {selectedJobDetails.perks.map((perk, index) => (
                                                    <div key={index} className="flex items-center gap-1.5 text-xs">
                                                        <FaCheckCircle className="text-yellow-600 text-xs" />
                                                        <span>{perk}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Educational Requirements */}
                                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1.5 text-sm">
                                            <FaGraduationCap className="text-green-600 text-xs" />
                                            Educational Requirements
                                        </h4>
                                        <div className="space-y-1.5 text-xs">
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
                                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                        <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-1.5 text-sm">
                                            <FaUserGraduate className="text-indigo-600 text-xs" />
                                            Candidate Preferences
                                        </h4>
                                        <div className="space-y-1.5 text-xs">
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
                                                        <FaVenus className="text-pink-500 text-xs" />
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
                                    <div className="mb-4">
                                        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                                            <FaIndustry className="text-blue-600 text-sm" />
                                            About the Company
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                {selectedJobDetails.aboutCompany}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Screening Questions */}
                                {selectedJobDetails.screeningQuestions && selectedJobDetails.screeningQuestions.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                                            <FaQuestionCircle className="text-blue-600 text-sm" />
                                            Screening Questions
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedJobDetails.screeningQuestions.map((question, index) => (
                                                <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                                    <div className="flex items-start gap-2">
                                                        <span className="bg-orange-100 text-orange-700 text-xs font-semibold rounded-full px-1.5 py-0.5 mt-0.5">
                                                            Q{index + 1}
                                                        </span>
                                                        <p className="text-gray-700 text-xs">{question}</p>
                                                    </div>
                                                </div>
                                            ))}
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={selectedJobDetails.recruiterProfilePic || "https://via.placeholder.com/40x40?text=Avatar"}
                                                    alt="Recruiter"
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 text-sm">{selectedJobDetails.recruiterName}</h4>
                                                    <p className="text-xs text-gray-600">{selectedJobDetails.recruiterDesignation}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <FaEnvelope className="text-gray-400 text-xs" />
                                                    <span className="text-gray-700">{selectedJobDetails.recruiterEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FaPhone className="text-gray-400 text-xs" />
                                                    <span className="text-gray-700">{selectedJobDetails.recruiterPhone}</span>
                                                </div>
                                                {selectedJobDetails.phoneContact && (
                                                    <div className="flex items-center gap-1.5">
                                                        <FaPhone className="text-gray-400 text-xs" />
                                                        <span className="text-gray-700">{selectedJobDetails.phoneContact}</span>
                                                    </div>
                                                )}
                                                {selectedJobDetails.alternatePhoneNumber && (
                                                    <div className="flex items-center gap-1.5">
                                                        <FaPhone className="text-gray-400 text-xs" />
                                                        <span className="text-gray-700">{selectedJobDetails.alternatePhoneNumber}</span>
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <div className={`flex items-center gap-1.5 p-2 rounded-lg ${selectedJobDetails.isEmailVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <FaEnvelope className={`text-xs ${selectedJobDetails.isEmailVerified ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className={`text-xs font-medium ${selectedJobDetails.isEmailVerified ? 'text-green-700' : 'text-red-700'}`}>
                                                Email {selectedJobDetails.isEmailVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 p-2 rounded-lg ${selectedJobDetails.isPhoneVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <FaPhone className={`text-xs ${selectedJobDetails.isPhoneVerified ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className={`text-xs font-medium ${selectedJobDetails.isPhoneVerified ? 'text-green-700' : 'text-red-700'}`}>
                                                Phone {selectedJobDetails.isPhoneVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 p-2 rounded-lg ${selectedJobDetails.isGstVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <FaBuilding className={`text-xs ${selectedJobDetails.isGstVerified ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className={`text-xs font-medium ${selectedJobDetails.isGstVerified ? 'text-green-700' : 'text-red-700'}`}>
                                                GST {selectedJobDetails.isGstVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Show More/Less Button */}
                                {!showFullDetails && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent h-10 flex items-end justify-center pb-1">
                                        <Button
                                            onClick={() => setShowFullDetails(true)}
                                            variant="outline"
                                            size="small"
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-normal py-1 px-3 rounded-full shadow-sm border border-gray-300 transition-all duration-200 flex items-center gap-1 text-xs hover:shadow-md hover:scale-105"
                                        >
                                            Show more
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </div>
                                )}

                                {showFullDetails && (
                                    <div className="mt-4 flex justify-center">
                                        <Button
                                            onClick={() => setShowFullDetails(false)}
                                            variant="outline"
                                            size="small"
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-4 rounded-full shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-1.5 text-sm hover:shadow-md hover:scale-105"
                                        >
                                            Show less
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </Button>
                                    </div>
                                )}

                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
} 