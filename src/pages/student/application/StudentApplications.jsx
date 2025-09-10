import React, { useState, useEffect } from 'react';
import { Button, Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { useGetStudentApplications } from '../../../hooks/useApplications';
import { useSelector } from 'react-redux';
import FeedRightProfile from '../feed/FeedRightProfile';
import { getImageUrl } from '../../../../utils';
import { useNavigate } from 'react-router-dom';

const StudentApplications = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [filteredApplications, setFilteredApplications] = useState([]);
    const { token } = useSelector(state => state.auth);
    const filterOptions = [
        'All',
        'applied',
        'interview',
        'hired',
        'rejected'
    ];

    const { applications: applicationsData, loading, error } = useGetStudentApplications();
    const navigate = useNavigate();

    // Filter applications when activeFilter or applicationsData changes
    useEffect(() => {
        if (!applicationsData?.applications) return;

        if (activeFilter === 'All') {
            setFilteredApplications(applicationsData.applications);
        } else {
            const filtered = applicationsData.applications.filter(app =>
                app.status.toLowerCase() === activeFilter.toLowerCase()
            );
            setFilteredApplications(filtered);
        }
    }, [activeFilter, applicationsData]);

    // Ensure applications is always an array
    const applications = filteredApplications.length > 0 || activeFilter !== 'All'
        ? filteredApplications
        : applicationsData?.applications || [];
    // Add loading state
    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        <p className="text-gray-600">Loading your applications...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    // Format filter display text
    const getFilterDisplayText = (filter) => {
        if (filter === 'applied') return 'Applied';
        if (filter === 'interview') return 'Interview';
        return filter.charAt(0).toUpperCase() + filter.slice(1);
    };

    // Handle View Details button click
    const handleViewDetails = (e, jobPostId) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the parent div
        navigate(`/jobs/${jobPostId}`);
    };

    return (
        <MainLayout>
            <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
                {/* Left Spacer */}
                <div className="hidden lg:block flex-grow "></div>


                <section className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-auto opacity-100 gap-[10px]">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Your Applications
                        </h1>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => handleFilterChange(filter)}
                                    className={`px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${activeFilter === filter
                                        ? 'bg-gray-800 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {getFilterDisplayText(filter)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Application Cards */}
                    <div className="space-y-3 sm:space-y-4">
                        {applications.length > 0 ? (
                            applications.map((job) => (
                                <div
                                    key={job.application_id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        {/* Company Logo */}
                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {job.company_logo ? (
                                                <img
                                                    src={getImageUrl(job.company_logo)}
                                                    alt={job.company_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-2xl font-semibold">
                                                    {job.company_name?.charAt(0) || 'C'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Job Details */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {job.jobRole || 'Job Role Not Specified'}
                                            </h3>
                                            <p className="text-gray-600">{job.company_name}</p>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                {job.applied_date && (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Applied: {new Date(job.applied_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 12h.01M16 12h.01M20 12h.01" />
                                                    </svg>
                                                    {job.number_of_openings || 'N/A'} Openings
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {job.applicantCount || '0'} Applicants
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Column: Status, Skill Match, and View Details */}
                                        <div className="flex flex-col items-end gap-3 w-30">
                                            {/* Status Badge */}
                                            <div className="w-full flex justify-end">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium text-center w-full ${job.status === 'hired' ? 'bg-green-100 text-green-800' :
                                                    job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Applied'}
                                                </span>
                                            </div>

                                            {/* Skill Match */}
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Match</span>
                                                    <span className="font-medium">{job.skill_match_percentage || 0}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${(job.skill_match_percentage || 0) >= 70 ? 'bg-green-500' :
                                                            (job.skill_match_percentage || 0) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${job.skill_match_percentage || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* View Details Button */}
                                            <button
                                                onClick={(e) => handleViewDetails(e, job.job_post_id)}
                                                className="w-full px-2 py-1 bg-white border border-gray-200 text-blue-600 rounded text-[11px] font-medium hover:bg-blue-50 transition-colors text-center"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No applications found.
                            </div>
                        )}
                    </div>
                </section>

                {/* Profile Card */}
                <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit ml-4">
                    <FeedRightProfile />
                </aside>
                {/* Right Spacer */}
                <div className="hidden lg:block flex-grow "></div>
            </div>
        </MainLayout>
    );
};

export default StudentApplications;
