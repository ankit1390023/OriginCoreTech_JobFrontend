import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile'; 
// Dummy Components (Replace with your actual ones)
const UserCard = () => (
  <div className="bg-[#052C71] text-white rounded-lg p-4 flex items-center justify-between mb-6 shadow-md">
    <div className="flex items-center gap-4">
      <img
        src="https://avatars.githubusercontent.com/u/1?v=4"
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
      <p className="font-semibold">SKILLS <span className="font-bold">3</span> / 21</p>
      <div className="w-40 h-2 bg-white rounded-full mt-1">
        <div className="h-2 bg-yellow-400 rounded-full w-[14%]"></div>
      </div>
    </div>
  </div>
);

const SkillProgressBar = ({ percent }) => (
  <div className="flex items-center gap-2 text-xs text-white font-semibold bg-yellow-400 rounded-full w-[80px] h-[80px] justify-center items-center text-center p-2">
    <div className="text-center text-xs">
      <span className="text-lg font-bold block">{percent}%</span>
      Complete
    </div>
  </div>
);

const SkillItem = ({ label, active }) => (
  <div className={`flex justify-between px-4 py-1 items-center text-sm ${active ? 'bg-blue-300 text-white' : 'bg-gray-200 text-gray-500'}`}>
    <span>{label}</span>
    <span>{active ? '🅰️' : 'Aa'}</span>
  </div>
);

const OpportunityCard = ({ title, learners, tag, duration, skills, completed = false }) => (
  <div className={`rounded-lg shadow-sm p-4 mb-4 ${completed ? 'bg-blue-200' : 'bg-gray-200'}`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {completed && <SkillProgressBar percent={38} />}
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-700">{learners}</p>
          <div className="flex gap-2 mt-1">
            <span className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full shadow">
              {tag}
            </span>
            <span className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full shadow">
              {duration}
            </span>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-700 flex items-center gap-1">
        👁️ {skills} Skills
      </div>
    </div>

    {/* Skills List (only for completed) */}
    {completed && (
      <div className="mt-3 border rounded overflow-hidden">
        <SkillItem label="Typography" active />
        <SkillItem label="Color Theory" active />
        <SkillItem label="Adobe Photoshop" active />
        <SkillItem label="Composition" active={false} />
        <SkillItem label="Adobe Illustrator" active={false} />
        <SkillItem label="Color wheel" active={false} />
        <SkillItem label="Figma" active={false} />
        <SkillItem label="Typography" active={false} />
        <SkillItem label="Color Theory" active={false} />
      </div>
    )}
  </div>
);

const Dashboard = () => {
  return (
  <MainLayout>
             <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
                 <div className="hidden lg:block flex-grow"></div>
                 

    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <UserCard />

      {/* Completed Opportunity */}
      <OpportunityCard
        completed
        title="Graphic Design"
        learners="16,856 learners"
        tag="Course"
        duration="8 weeks"
        skills={9}
      />

      {/* Locked Opportunity */}
      <OpportunityCard
        title="Company Name"
        learners="62,583 applicants"
        tag="Internship"
        duration="2 months"
        skills={7}
      />
      <OpportunityCard
        title="Company Name"
        learners="122,263 applicants"
        tag="Project"
        duration="2 weeks"
        skills={5}
      />
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

export default Dashboard;
