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
            <div className="max-w-7xl mx-auto pt-1 sm:pt-2 md:pt-4 lg:pt-6 pb-4 sm:pb-6 px-2 sm:px-3 md:px-4 lg:px-6">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-2 sm:mb-3">
                    <button
                        onClick={toggleFilters}
                        className="flex items-center gap-1.5 bg-white rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 shadow border border-gray-200 w-full justify-center"
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
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 sm:gap-4 lg:gap-6">
                    {/* Left: Job Filters */}
                    <aside className={`bg-white rounded-2xl shadow border border-gray-100 p-3 sm:p-4 lg:p-6 flex flex-col gap-3 sm:gap-4 self-start ${isFiltersOpen ? 'block' : 'hidden lg:flex'}`}>
                        <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-1">Job Filters</h2>
                            <p className="text-gray-500 text-xs">Help us match you with the best career opportunities</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:gap-4 divide-y divide-gray-100">
                            <div className="flex flex-col gap-1.5 pb-2 sm:pb-3">
                                <label className="text-xs font-semibold flex items-center gap-1.5"><FaBriefcase className="text-gray-400 text-xs" /> Profile</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100" placeholder="Eg. Marketing" aria-label="Profile" />
                            </div>
                            <div className="flex flex-col gap-1.5 py-2 sm:py-3">
                                <label className="text-xs font-semibold flex items-center gap-1.5"><FaMapMarkerAlt className="text-gray-400 text-xs" /> Location</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100" placeholder="Eg. Delhi" aria-label="Location" />
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mt-1">
                                    <label className="flex items-center gap-1.5 text-xs font-medium">
                                        <input type="checkbox" className="accent-black" aria-label="Remote" /> Remote
                                    </label>
                                    <label className="flex items-center gap-1.5 text-xs font-medium">
                                        <input type="checkbox" className="accent-black" aria-label="Hybrid" /> Hybrid
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 py-2 sm:py-3">
                                <label className="text-xs font-semibold flex items-center gap-1.5"><FaUserTie className="text-gray-400 text-xs" /> Years of experience</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100" placeholder="Total experience" aria-label="Years of experience" />
                            </div>
                            <div className="flex flex-col gap-1.5 py-2 sm:py-3">
                                <label className="text-xs font-semibold flex items-center gap-1.5"><FaBuilding className="text-gray-400 text-xs" /> Company</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100" placeholder="Company name" aria-label="Company" />
                            </div>
                            <div className="flex flex-col gap-1.5 pt-2 sm:pt-3">
                                <label className="text-xs font-semibold flex items-center gap-1.5"><FaMoneyBillWave className="text-gray-400 text-xs" /> Annual Salary (in lakhs)</label>
                                <input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100" placeholder="Eg. 4,00,000" aria-label="Annual Salary" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2">
                            <button className="text-blue-500 text-xs font-semibold hover:underline w-full sm:w-auto text-center" aria-label="Clear all filters">Clear all</button>
                            <button className="bg-[#ff4d3d] hover:bg-[#e63c2a] transition text-white rounded-full px-3 sm:px-4 md:px-6 py-1.5 font-semibold text-xs sm:text-sm shadow focus:ring-2 focus:ring-red-200 w-full sm:w-auto" aria-label="Apply filters">Apply</button>
                        </div>
                    </aside>

                    {/* Right: Jobs List */}
                    <main className="bg-white rounded-2xl shadow border border-gray-100 p-2 sm:p-3 md:p-4 lg:p-6 flex flex-col min-h-[80vh]">
                        <header className="mb-2 sm:mb-3 md:mb-4">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-1">Jobs</h2>
                            <p className="text-gray-500 text-xs">Start applying to the latest job vacancies at the leading companies in India below.</p>
                        </header>

                        {/* Job Cards */}
                        <section className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                            {loading && (
                                <div className="text-center py-6">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2 text-sm">Loading jobs...</p>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-6">
                                    <p className="text-red-500 text-sm">Error loading jobs: {error}</p>
                                    <button
                                        onClick={refetch}
                                        className="mt-2 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
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
                                    className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-3 md:px-4 md:py-4 transition hover:shadow-md hover:border-blue-100 group cursor-pointer"
                                    tabIndex={0}
                                    aria-label={`Job: ${job.jobProfile} at ${job.companyName}`}
                                >
                                    {/* Skills missing badge - positioned at top of card */}
                                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                                        <div className="absolute -top-1.5 sm:-top-3 left-3 z-10">
                                            <span className="bg-blue-600 text-white text-xs font-semibold rounded-full px-1.5 sm:px-2 py-0.5 shadow-lg border border-blue-700 flex items-center gap-1">
                                                {job.skillsRequired.length} skills required
                                            </span>
                                        </div>
                                    )}

                                        {/* <img src={job.logoUrl} alt={`${job.companyName} logo`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain bg-gray-100 border border-gray-200 self-start sm:self-auto" /> */}
                                        
                                        <img src={"https://images.squarespace-cdn.com/content/v1/65da3ae088ac635ab34abd13/c6caad75-54ea-4e3f-840b-a7aa78473188/transparent-google-logo-google-logo-green-and-blue-g-in-circle65cf691984e008.0012613817080916735443.png?format=1500w"} alt={`${job.companyName} logo`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain bg-gray-100 border border-gray-200 self-start sm:self-auto" />


                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm sm:text-base leading-tight truncate">{job.jobProfile}</div>
                                        <div className="text-gray-500 text-xs mb-1.5 truncate">{job.companyName}</div>
                                        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1.5">
                                            <span className="bg-gray-100 rounded-full px-1.5 sm:px-2 py-0.5 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                                <span className="truncate">{job.location}</span>
                                            </span>
                                            <span className="bg-gray-100 rounded-full px-1.5 sm:px-2 py-0.5 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
                                                <FaUserTie className="text-gray-400 text-xs" />
                                                <span className="truncate">{job.experience}</span>
                                            </span>
                                            {job.salary && (
                                                <span className="bg-gray-100 text-gray-700 text-xs rounded-full px-1.5 sm:px-2 py-0.5 border border-green-200 flex items-center gap-1">
                                                    <span className="truncate">INR: {job.salary}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-1.5 min-w-[90px] sm:min-w-[100px]">
                                        <span className={`text-white text-xs font-semibold rounded-full px-1.5 sm:px-2 py-0.5 shadow ${job.hiringStatus === 'Actively Hiring' ? 'bg-red-400' : 'bg-green-400'}`}>
                                            {job.hiringStatus}
                                        </span>
                                        <span className={`text-xs rounded-full px-1.5 sm:px-2 py-0.5 border font-semibold ${job.matchPercentage > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {job.matchPercentage || 0}% match
                                        </span>
                                        <span className="bg-gray-100 rounded-full px-1.5 sm:px-2 py-0.5 text-xs text-gray-700 border border-gray-200 flex items-center gap-1">
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