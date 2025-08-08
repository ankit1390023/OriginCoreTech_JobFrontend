import React, { useState } from 'react';
import { Badge, Button } from '../../../components/ui';
import uberLogo from '../../../assets/uber-logo.png';
import carDashboard from '../../../assets/car-dashboard.png';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile';


const pathwayData = [
  {
    id: 1,
    color: '#6EB5DD',
    title: 'Pathway 1',
    badges: [
      { text: 'Course, Internship, Project', color: 'bg-blue-500 text-white' },
      { text: '3.5 months', color: 'bg-blue-500 text-white' },
    ],
    skills: '21 Skills',
    subCards: [
      {
        icon: (
          <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="#7C3AED" />
            </svg>
          </div>
        ),
        title: 'Graphic Design',
        subtitle: '16,839 learners',
        badges: [
          { text: 'Course', color: 'bg-gray-100 text-gray-800' },
          { text: '1 month', color: 'bg-gray-100 text-gray-800' },
        ],
      },
      {
        icon: (
          <div className="w-10 h-10 rounded bg-black flex items-center justify-center">
            <img src={uberLogo} alt="Uber" className="w-6 h-6" />
          </div>
        ),
        title: 'Company Name',
        subtitle: '16,839 applicants',
        badges: [
          { text: 'Internship', color: 'bg-gray-100 text-gray-800' },
          { text: '2 months', color: 'bg-gray-100 text-gray-800' },
        ],
      },
      {
        icon: (
          <div className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="#2563EB" />
            </svg>
          </div>
        ),
        title: 'Company Name',
        subtitle: '16,839 applicants',
        badges: [
          { text: 'Project', color: 'bg-gray-100 text-gray-800' },
          { text: '2 weeks', color: 'bg-gray-100 text-gray-800' },
        ],
      },
    ],
  },
  {
    id: 2,
    color: '#E8AC6E',
    title: 'Pathway 2',
    badges: [
      { text: 'Internship, Project, Project', color: 'bg-orange-400 text-white' },
      { text: '2 months', color: 'bg-orange-400 text-white' },
    ],
    skills: '21 Skills',
    subCards: [],
  },
  {
    id: 3,
    color: '#888CE4',
    title: 'Pathway 3',
    badges: [
      { text: 'Project, Course, Project', color: 'bg-purple-500 text-white' },
      { text: '4 weeks', color: 'bg-purple-500 text-white' },
    ],
    skills: '21 Skills',
    subCards: [],
  },
];

const Myapplication1 = () => {
  const [expandedPathway, setExpandedPathway] = useState(null);

  const handlePathwayClick = (pathwayId) => {
    if (pathwayId === 1) { // Only Pathway 1 is clickable
      setExpandedPathway(expandedPathway === pathwayId ? null : pathwayId);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
        
    <div
      className="mx-auto mt-10"
      style={{
        width: 729,
        height: 700,
        borderRadius: 10,
        padding: 20,
        gap: 10,
        background: '#fff',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your personalised pathways</h1>
        <div className="space-y-6">
          {pathwayData.map((pathway, idx) => (
            <div
              key={pathway.id}
              className={`rounded-xl px-6 pt-6 pb-4 relative ${pathway.id === 1 ? 'cursor-pointer' : ''}`}
              style={{ backgroundColor: pathway.color }}
              onClick={() => handlePathwayClick(pathway.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/30 rounded-lg flex items-center justify-center">
                    <img
                      src={carDashboard}
                      alt="dashboard"
                      className="w-12 h-12 object-contain rounded"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{pathway.title}</h2>
                    <p className="text-white/80 text-lg">?</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {pathway.badges.map((badge, i) => (
                        <Badge key={i} color={badge.color} text={badge.text} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    color="bg-white text-gray-900 border border-gray-300"
                    text={
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{pathway.skills}</span>
                      </div>
                    }
                  />
                </div>
              </div>
              {/* Subcards for Pathway 1 - Only show when expanded */}
              {pathway.id === 1 && expandedPathway === 1 && (
                <div className="mt-4 space-y-3">
                  {pathway.subCards.map((sub, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl flex items-center px-4 py-3 shadow-sm border border-gray-100"
                    >
                      <div className="mr-4">{sub.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">{sub.title}</h3>
                        <p className="text-gray-500 text-sm">{sub.subtitle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {sub.badges.map((badge, j) => (
                            <Badge key={j} color={badge.color} text={badge.text} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            size="large"
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-3 rounded-full"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
    
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

export default Myapplication1;
