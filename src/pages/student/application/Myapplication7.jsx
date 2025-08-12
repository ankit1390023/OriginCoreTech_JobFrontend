import React from 'react';
import { Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile';

const Myapplication7 = () => {
  const contentCards = [
    {
      id: 1,
      color:'#D9D9D9',

      title: "Graphic Design",
      subtitle: "16,856 learners",
      badges: ["Course", "8 weeks"],
      skills: "9 Skills"
    },
    {
      id: 2,
      background: '#D9D9D9',

      title: "Company Name",
      subtitle: "62,583 applicants",
      badges: ["Internship", "2 months"],
      skills: "7 Skills"
    },
    {
      id: 3,
      title: "Company Name",
      subtitle: "122,263 applicants",
      badges: ["Project", "2 weeks"],
      skills: "5 Skills"
    }
  ];

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
        
        <div className="min-h-screen bg-white p-6">
        <div className="w-[689px] h-[503px] rounded-[10px] p-5 gap-[10px] opacity-100 mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            </div>

            {/* User Profile and Skills Overview Card */}
            <div className="bg-blue-900 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* User Avatar */}
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Aman Gupta</h2>
                    <p className="text-blue-200">@amangupta09</p>
                    <p className="text-blue-200">Level 0</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">SKILLS 0 / 21</p>
                  <div className="w-32 h-2 bg-blue-800 rounded-full mt-2">
                    <div className="w-0 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-4">
              {contentCards.map((card) => (
                <div key={card.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Padlock Icon */}
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                        <p className="text-gray-600">{card.subtitle}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {card.badges.map((badge, index) => (
                            <Badge 
                              key={index}
                              variant="secondary" 
                              text={badge}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        color="bg-gray-100 text-gray-800 border border-gray-300"
                        text={card.skills}
                      />
                    </div>
                  </div>
                </div>
              ))}
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

export default Myapplication7;
