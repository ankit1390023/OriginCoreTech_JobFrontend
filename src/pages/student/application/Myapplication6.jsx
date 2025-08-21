import React, { useState } from 'react';
import { Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightSide3 from '../feed/FeedRightSide3';

const Myapplication6 = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (cardType) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };
  return (
    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
      

        <div className="min-h-screen w-full max-w-3xl bg-white px-4 sm:px-6 md:px-8 mt-2 flex justify-center">
  <div className="w-full max-w-3xl min-h-screen mt-2 rounded-[10px] p-5 flex flex-col gap-6">

    {/* Top Section: User Profile and Skills Overview */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* User Profile Card */}
      <div className="bg-blue-900 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Aman Gupta</h2>
              <p className="text-blue-200 text-sm sm:text-base">@amangupta09</p>
              <p className="text-blue-200 text-sm sm:text-base">Level 0</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-base sm:text-lg font-semibold">SKILLS 10 / 21</p>
            <div className="w-28 sm:w-32 h-2 bg-blue-800 rounded-full mt-2">
              <div className="w-14 sm:w-16 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Middle Section: Clickable Cards */}
    <div className="space-y-4">
      {/* Graphic Design Card */}
      <div>
        <div
          className="rounded-lg p-4 sm:p-6 cursor-pointer"
          style={{ backgroundColor: '#6EB5DD' }}
          onClick={() => handleCardClick('graphic')}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">38%</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Graphic Design</h3>
                <p className="text-white/80 text-sm sm:text-base">16,856 learners</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge color="bg-white/20 text-white border-0" text="Course" />
              <Badge color="bg-white/20 text-white border-0" text="8 weeks" />
              <Badge color="bg-white text-gray-900" text="9 Skills" />
            </div>
          </div>
        </div>

        {/* Skills Dropdown for Graphic Design */}
        {expandedCard === 'graphic' && (
          <div className="mt-2 space-y-2">
            {[
              { name: "Typography", icon: "Aa", bgColor: "bg-blue-50" },
              { name: "Color Theory", icon: "Aa", bgColor: "bg-blue-50" },
              { name: "Adobe Photoshop", icon: "🎨", bgColor: "bg-blue-50" },
              { name: "Composition", icon: "🔺", bgColor: "bg-gray-50" },
              { name: "Adobe Illustrator", icon: "🎨", bgColor: "bg-gray-50" },
              { name: "Color wheel", icon: "🎨", bgColor: "bg-gray-50" },
              { name: "Figma", icon: "🔺", bgColor: "bg-gray-50" },
              { name: "Typography", icon: "Aa", bgColor: "bg-gray-50" },
              { name: "Color Theory", icon: "Aa", bgColor: "bg-gray-50" }
            ].map((skill, index) => (
              <div key={index} className={`${skill.bgColor} rounded-lg p-3 sm:p-4 flex items-center justify-between`}>
                <span className="font-medium text-gray-900 text-sm sm:text-base">{skill.name}</span>
                <span className="text-gray-600">{skill.icon}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Bottom Section: Company Applications */}
    <div className="space-y-4">
      {/* First Application Card */}
      <div>
        <div
          className="rounded-lg p-4 sm:p-6 cursor-pointer"
          style={{ backgroundColor: '#E8AC6E' }}
          onClick={() => handleCardClick('company1')}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Company Name</h3>
                <p className="text-white/80 text-sm sm:text-base">62,583 applicants</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge color="bg-white/20 text-white border-0" text="Internship" />
              <Badge color="bg-white/20 text-white border-0" text="2 months" />
              <Badge color="bg-green-200 text-green-800" text="Hired" />
              <Badge color="bg-white text-gray-900" text="7 Skills" />
            </div>
          </div>
        </div>

        {/* Dropdown Content */}
        {expandedCard === 'company1' && (
          <div className="mt-2 space-y-2">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge color="bg-green-100 text-green-800" text="Hired" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied Date:</span>
                  <span className="text-gray-900">March 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="text-gray-900">5 days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Second Application Card */}
      <div className="bg-gray-300 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2-2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Company Name</h3>
              <p className="text-gray-600 text-sm sm:text-base">122,263 applicants</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge color="bg-gray-100 text-gray-800" text="Project" />
            <Badge color="bg-gray-100 text-gray-800" text="2 weeks" />
            <Badge color="bg-gray-100 text-gray-800" text="5 Skills" />
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

   {/* Profile Card */}
   <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                        <FeedRightSide3 />
                    </aside>
                    {/* Right Spacer */}
                    <div className="hidden lg:block flex-grow"></div>
                </div>
            </MainLayout>

  );
};

export default Myapplication6 ;
