import React, { useState } from 'react';
import { Button, Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';

const FeedDashBoard = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filterOptions = [
        'All',
        'Skills Missing',
        'Applied/Ongoing',
        'Hired',
        'Rejected'
    ];

    const jobApplications = [
        {
            id: 1,
            company: 'Uber',
            status: 'Skills missing',
            matchPercentage: '63%',
            applicants: 230,
            appliedDate: '23rd March'
        },
        {
            id: 2,
            company: 'Google',
            status: 'Skills missing',
            matchPercentage: '63%',
            applicants: 230,
            appliedDate: '23rd March'
        },
        {
            id: 3,
            company: 'Swiggy',
            status: 'Skills missing',
            matchPercentage: '63%',
            applicants: 230,
            appliedDate: '23rd March'
        }
    ];

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
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
                        Dashboard
                    </h1>
                    
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {filterOptions.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterChange(filter)}
                                className={`px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                                    activeFilter === filter
                                        ? 'bg-gray-800 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Application Cards */}
                <div className="space-y-3 sm:space-y-4">
                    {jobApplications.map((job) => (
                        <div
                            key={job.id}
                            className="bg-red-50 border border-red-100 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                                <div className="flex-1">
                                    {/* Company Name */}
                                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                        {job.company}
                                    </h3>
                                    
                                    {/* Status Tags */}
                                    <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                                        <Badge
                                            variant="danger"
                                            className="bg-red-100 text-red-700 border-red-200 text-xs sm:text-sm"
                                        >
                                            {job.status}
                                        </Badge>
                                        <Badge
                                            className="bg-orange-100 text-orange-700 border-orange-200 text-xs sm:text-sm"
                                        >
                                            {job.matchPercentage} match
                                        </Badge>
                                    </div>
                                    
                                    {/* Applicant Details */}
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                        {job.applicants} Applicants, Applied on {job.appliedDate}
                                    </p>
                                </div>
                                
                                {/* Action Button */}
                                <div className="flex justify-start sm:justify-end">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        className="w-full sm:w-auto"
                                    >
                                        Career Path
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default FeedDashBoard;
