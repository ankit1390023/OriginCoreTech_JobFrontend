import Header from "../../../components/shared/Header";
import { FaSearch, FaBuilding, FaMapMarkerAlt, FaUserTie, FaMoneyBillWave, FaBriefcase, FaFilter, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetJobApi } from '../../../hooks/useGetJobApi';
import { useState } from 'react';
import { Input, Button, Loader, Checkbox, Badge } from '../../../components/ui';
import { getImageUrl } from "../../../../utils";

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
            <div className="max-w-7xl mx-auto pt-2 sm:pt-3 md:pt-4 lg:pt-6 pb-4 sm:pb-6 px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-3 sm:mb-4">
                    <Button
                        onClick={toggleFilters}
                        variant="outline"
                        size="default"
                        className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow border border-gray-200 w-full justify-center hover:bg-gray-50 transition-colors"
                    >
                        {isFiltersOpen ? (
                            <>
                                <FaTimes className="text-gray-600 text-sm" />
                                <span className="font-medium text-sm">Close Filters</span>
                            </>
                        ) : (
                            <>
                                <FaFilter className="text-gray-600 text-sm" />
                                <span className="font-medium text-sm">Show Filters</span>
                            </>
                        )}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 sm:gap-4 lg:gap-2" style={{ marginLeft: '35px',marginRight: '35px' }}>
                    {/* Left: Job Filters */}
                    <aside className={`bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-5 lg:p-6 flex flex-col gap-1 sm:gap-5 self-start ${isFiltersOpen ? 'block' : 'hidden lg:flex'}`}>
                        <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-2 text-gray-900">Job Filters</h2>
                            <p className="text-gray-500 text-sm">Help us match you with the best career opportunities</p>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Input
                                    label={
                                        <span className="text-sm font-semibold flex items-center gap-2 text-gray-700">
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
                                        <span className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                            <FaMapMarkerAlt className="text-gray-400" /> Location
                                        </span>
                                    }
                                    placeholder="Eg. Delhi"
                                    aria-label="Location"
                                    size="small"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <Checkbox
                                        label="Remote"
                                        className="flex items-center gap-2 text-sm font-medium p-0 border-0 bg-transparent"
                                    />
                                    <Checkbox
                                        label="Hybrid"
                                        className="flex items-center gap-2 text-sm font-medium p-0 border-0 bg-transparent"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Input
                                    label={
                                        <span className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                            <FaUserTie className="text-gray-400" /> Years of experience
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
                                        <span className="text-sm font-semibold flex items-center gap-2 text-gray-700">
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
                                        <span className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                            <FaMoneyBillWave className="text-gray-400" /> Annual Salary (in lakhs)
                                        </span>
                                    }
                                    placeholder="Eg. 4,00,000"
                                    aria-label="Annual Salary"
                                    size="small"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                            <button className="text-blue-500 text-sm font-semibold hover:underline w-full sm:w-auto text-center transition-colors" aria-label="Clear all filters">
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
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2 text-gray-900">Jobs</h2>
                            <p className="text-gray-500 text-sm sm:text-base">Start applying to the latest job vacancies at the leading companies in India below.</p>
                        </header>

                        {/* Job Cards */}
                        <section className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                            {loading && (
                                <div className="text-center py-8 sm:py-12">
                                    <Loader message="Loading jobs..." />
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-8 sm:py-12">
                                    <p className="text-red-500 text-sm sm:text-base mb-4">Error loading jobs: {error}</p>
                                    <Button
                                        onClick={refetch}
                                        variant="secondary"
                                        size="small"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm transition-colors"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {!loading && !error && allJobs && allJobs.length > 0 && allJobs.map((job, idx) => (
                                <Link
                                    key={job.jobId}
                                    to={`/jobs/${job.jobId}`}
                                    className="no-underline"
                                >
                                    <article
                                        className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-200 group cursor-pointer"
                                        tabIndex={0}
                                        aria-label={`Job: ${job.jobProfile} at ${job.companyName}`}
                                    >
                                        {/* Skills required badge */}
                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="absolute -top-2 sm:-top-3 left-4 z-10">
                                                <Badge
                                                    color="bg-blue-600 text-white hover:bg-blue-700"
                                                    text={`${job.skillsRequired.length} skills required`}
                                                    className="text-xs font-semibold shadow-lg border border-blue-700"
                                                />
                                            </div>
                                        )}

                                        {/* Company Logo */}
                                        <div className="flex-shrink-0">
                                            <img 
                                                src={getImageUrl(job.logoUrl)} 
                                                alt={`${job.companyName} logo`} 
                                                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg object-contain bg-gray-100 border border-gray-200" 
                                            />
                                        </div>

                                        {/* Job Details */}
                                        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                                            <div>
                                                <h3 className="font-bold text-base sm:text-lg lg:text-xl leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {job.jobProfile}
                                                </h3>
                                                <p className="text-gray-600 text-sm sm:text-base font-medium">
                                                    {job.companyName}
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                                <Badge
                                                    color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                                    <span className="truncate">{job.location}</span>
                                                </Badge>
                                                <Badge
                                                    color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    <FaUserTie className="text-gray-400 text-xs" />
                                                    <span className="truncate">{job.experience}</span>
                                                </Badge>
                                                {job.salary && (
                                                    <Badge
                                                        color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        <span className="truncate">INR: {job.salary}</span>
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status and Match Info */}
                                        <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]">
                                            <Badge
                                                color={job.hiringStatus === 'Actively Hiring' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}
                                                text={job.hiringStatus}
                                                className="text-xs sm:text-sm font-semibold shadow"
                                            />
                                            <Badge
                                                color={job.matchPercentage > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                                                text={`${job.matchPercentage || 0}% match`}
                                                className="text-xs sm:text-sm border font-semibold"
                                            />
                                            <Badge
                                                color="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                className="text-xs sm:text-sm"
                                            >
                                                <span className="hidden sm:inline">Posted: </span>
                                                {job.postedDaysAgo === 'Today' || job.postedDaysAgo === 0
                                                    ? 'Today'
                                                    : `${job.postedDaysAgo} days ago`}
                                            </Badge>
                                        </div>
                                    </article>
                                </Link>
                            ))}

                            {!loading && !error && (!allJobs || allJobs.length === 0) && (
                                <div className="text-center py-12 sm:py-16">
                                    <p className="text-gray-500 text-lg">No jobs found.</p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}