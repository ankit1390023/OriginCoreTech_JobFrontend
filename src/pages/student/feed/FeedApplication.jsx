import React, { useState } from 'react';
import { Button, Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';

const FeedApplication = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = [
        { id: 'All', label: 'All' },
        { id: 'Skills Missing', label: 'Skills Missing' },
        { id: 'Applied/Ongoing', label: 'Applied/Ongoing' },
        { id: 'Hired', label: 'Hired' },
        { id: 'Rejected', label: 'Rejected' }
    ];

    const applications = [
        {
            id: 1,
            company: 'Company Name',
            status: 'Hired',
            applicants: 160,
            appliedDate: '23rd March',
            bgColor: 'bg-green-50',
            statusColor: 'bg-green-100 text-green-800'
        },
        {
            id: 2,
            company: 'Uber',
            status: 'Application Sent',
            applicants: 230,
            appliedDate: '23rd March',
            bgColor: 'bg-orange-50',
            statusColor: 'bg-orange-100 text-orange-800'
        },
        {
            id: 3,
            company: 'Uber',
            status: 'Skills missing',
            applicants: 230,
            appliedDate: '23rd March',
            bgColor: 'bg-red-50',
            statusColor: 'bg-red-100 text-red-800'
        }
    ];

    const filteredApplications = activeFilter === 'All' 
        ? applications 
        : applications.filter(app => {
            if (activeFilter === 'Skills Missing') return app.status === 'Skills missing';
            if (activeFilter === 'Applied/Ongoing') return app.status === 'Application Sent';
            if (activeFilter === 'Hired') return app.status === 'Hired';
            if (activeFilter === 'Rejected') return app.status === 'Rejected';
            return true;
        });

    return (
        <MainLayout>
            <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
                <div className="hidden lg:block flex-grow"></div>
                {/* Left: Applications List (scrollable on lg+) */}
                <section 
                    className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 w-full lg:w-[60%] lg:h-screen lg:overflow-y-auto"
                >
                    {/* Header */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6">
                        Your Applications
                    </h1>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                        {filters.map((filter) => (
                            <Button
                                key={filter.id}
                                variant={activeFilter === filter.id ? "primary" : "outline"}
                                size="default"
                                className={`rounded-full px-4 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm ${
                                    activeFilter === filter.id 
                                        ? 'bg-gray-200 text-gray-800 border-gray-300' 
                                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                                onClick={() => setActiveFilter(filter.id)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>

                    {/* Application Cards */}
                    <div className="space-y-3 sm:space-y-4">
                        {filteredApplications.map((application) => (
                            <div
                                key={application.id}
                                className={`${application.bgColor} rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                    <div className="flex-1">
                                        <h3 className="text-base sm:text-lg font-bold text-black mb-1 sm:mb-2">
                                            {application.company}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            {application.applicants} Applicants, Applied on {application.appliedDate}
                                        </p>
                                    </div>
                                    <Badge
                                        className={`${application.statusColor} rounded-full px-2 py-1 sm:px-3 text-[10px] sm:text-xs font-medium mt-2 sm:mt-0`}
                                        text={application.status}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredApplications.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <p className="text-gray-500 text-base sm:text-lg">
                                No applications found for the selected filter.
                            </p>
                        </div>
                    )}
                </section>
                {/* Profile Card */}
                <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                    <FeedRightProfile />
                </aside>
                {/* Right Spacer */}
                <div className="hidden lg:block flex-grow"></div>
            </div>
        </MainLayout>
    );
};

export default FeedApplication;
