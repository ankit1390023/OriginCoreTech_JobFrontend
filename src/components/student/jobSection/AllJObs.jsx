import Header from "../../shared/Header";
import { FaSearch, FaBuilding, FaMapMarkerAlt, FaUserTie, FaMoneyBillWave, FaBriefcase, FaFilter, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetJobApi } from '../../../hooks/useGetJobApi';
import { useState } from 'react';

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
            <div className="max-w-7xl mx-auto pt-4 sm:pt-8 pb-8 px-4 sm:px-6 lg:px-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={toggleFilters}
                        className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow border border-gray-200 w-full justify-center"
                    >
                        {isFiltersOpen ? (
                            <>
                                <FaTimes className="text-gray-600" />
                                <span className="font-medium">Close Filters</span>
                            </>
                        ) : (
                            <>
                                <FaFilter className="text-gray-600" />
                                <span className="font-medium">Show Filters</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
                    {/* Left: Job Filters */}
                    <aside className={`bg-white rounded-2xl shadow border border-gray-100 p-6 lg:p-8 flex flex-col gap-6 self-start ${isFiltersOpen ? 'block' : 'hidden lg:flex'}`}>
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-extrabold mb-1">Job Filters</h2>
                            <p className="text-gray-500 text-sm">Help us match you with the best career opportunities</p>
                        </div>
                        <div className="flex flex-col gap-5 divide-y divide-gray-100">
                            <div className="flex flex-col gap-2 pb-4">
                                <label className="text-sm font-semibold flex items-center gap-2"><FaBriefcase className="text-gray-400" /> Profile</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="Eg. Marketing" aria-label="Profile" />
                            </div>
                            <div className="flex flex-col gap-2 py-4">
                                <label className="text-sm font-semibold flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> Location</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="Eg. Delhi" aria-label="Location" />
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <input type="checkbox" className="accent-black" aria-label="Remote" /> Remote
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <input type="checkbox" className="accent-black" aria-label="Hybrid" /> Hybrid
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 py-4">
                                <label className="text-sm font-semibold flex items-center gap-2"><FaUserTie className="text-gray-400" /> Years of experience</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="Total experience" aria-label="Years of experience" />
                            </div>
                            <div className="flex flex-col gap-2 py-4">
                                <label className="text-sm font-semibold flex items-center gap-2"><FaBuilding className="text-gray-400" /> Company</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="Company name" aria-label="Company" />
                            </div>
                            <div className="flex flex-col gap-2 pt-4">
                                <label className="text-sm font-semibold flex items-center gap-2"><FaMoneyBillWave className="text-gray-400" /> Annual Salary (in lakhs)</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="Eg. 4,00,000" aria-label="Annual Salary" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-2">
                            <button className="text-blue-500 text-sm font-semibold hover:underline w-full sm:w-auto text-center" aria-label="Clear all filters">Clear all</button>
                            <button className="bg-[#ff4d3d] hover:bg-[#e63c2a] transition text-white rounded-full px-6 sm:px-8 py-2 font-semibold text-sm sm:text-base shadow focus:ring-2 focus:ring-red-200 w-full sm:w-auto" aria-label="Apply filters">Apply</button>
                        </div>
                    </aside>

                    {/* Right: Jobs List */}
                    <main className="bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col min-h-[80vh]">
                        <header className="mb-4 sm:mb-6">
                            <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">Jobs</h2>
                            <p className="text-gray-500 text-sm">Start applying to the latest job vacancies at the leading companies in India below.</p>
                        </header>

                        {/* Job Cards */}
                        <section className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                            {loading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading jobs...</p>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-8">
                                    <p className="text-red-500">Error loading jobs: {error}</p>
                                    <button
                                        onClick={refetch}
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {!loading && !error && allJobs && allJobs.length > 0 && allJobs.map((job, idx) => (
                                <Link
                                    key={job.jobId}
                                    to={`/jobs/${job.jobId}`}
                                    className="no-underline"
                                >
                                    <article
                                        className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:px-6 sm:py-5 transition hover:shadow-md hover:border-blue-100 group cursor-pointer"
                                        tabIndex={0}
                                        aria-label={`Job: ${job.jobProfile} at ${job.companyName}`}
                                    >
                                        {/* Skills missing badge - positioned at top of card */}
                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="absolute -top-2 sm:-top-4 left-4 z-10">
                                                <span className="bg-blue-600 text-white text-xs font-semibold rounded-full px-2 sm:px-3 py-1 shadow-lg border border-blue-700 flex items-center gap-1">
                                                    {job.skillsRequired.length} skills required
                                                </span>
                                            </div>
                                        )}

                                        <img src={job.logoUrl || "https://via.placeholder.com/56x56?text=Logo"} alt={`${job.companyName} logo`} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-contain bg-gray-100 border border-gray-200 self-start sm:self-auto" />

                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-base sm:text-lg leading-tight truncate">{job.jobProfile}</div>
                                            <div className="text-gray-500 text-sm mb-2 truncate">{job.companyName}</div>
                                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                                                <span className="bg-gray-100 rounded-full px-2 sm:px-3 py-1 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                                    <span className="truncate">{job.location}</span>
                                                </span>
                                                <span className="bg-gray-100 rounded-full px-2 sm:px-3 py-1 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                                                    <FaUserTie className="text-gray-400 text-xs" />
                                                    <span className="truncate">{job.experience}</span>
                                                </span>
                                                {job.salary && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs rounded-full px-2 sm:px-3 py-1 border border-green-200 flex items-center gap-1">
                                                        <span className="truncate">INR: {job.salary}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 min-w-[100px] sm:min-w-[110px]">
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
                                    </article>
                                </Link>
                            ))}

                            {!loading && !error && (!allJobs || allJobs.length === 0) && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No jobs found.</p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}