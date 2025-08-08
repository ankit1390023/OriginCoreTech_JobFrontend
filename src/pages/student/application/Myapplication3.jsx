import React from 'react';

const opportunities = [
  {
    title: 'Graphic Design',
    learners: '16,856 learners',
    tag: 'Course',
    duration: '8 weeks',
    skills: 9,
  },
  {
    title: 'Company Name',
    learners: '62,583 applicants',
    tag: 'Internship',
    duration: '2 months',
    skills: 7,
  },
  {
    title: 'Company Name',
    learners: '122,263 applicants',
    tag: 'Project',
    duration: '2 weeks',
    skills: 5,
  },
];

const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Profile Card */}
      <div className="bg-[#052C71] text-white rounded-lg p-4 flex items-center justify-between mb-6 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src="https://avatars.githubusercontent.com/u/1?v=4" // Placeholder avatar
            alt="User"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-lg">Aman Gupta</h2>
            <p className="text-sm">@amangupta09</p>
            <p className="text-sm mt-1">Level 0</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">SKILLS <span className="font-bold">0</span> / 21</p>
          <div className="w-40 h-2 bg-white rounded-full mt-1">
            <div className="h-2 bg-yellow-400 rounded-full w-0"></div>
          </div>
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-4">
        {opportunities.map((item, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 20h16M4 4h16M4 8h16M4 16h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-700">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.learners}</p>
                <div className="flex gap-2 mt-1">
                  <span className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full shadow">
                    {item.tag}
                  </span>
                  <span className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full shadow">
                    {item.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-700 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553 2.276A1 1 0 0120 13.118V14a2 2 0 01-2 2H6a2 2 0 01-2-2v-.882a1 1 0 01.447-.842L9 10m6 0V5a3 3 0 00-6 0v5m6 0H9"
                />
              </svg>
              {item.skills} Skills
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
