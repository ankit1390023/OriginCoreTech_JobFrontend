import React from 'react';
import { Badge, Button } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile'; 


const Myapplication8 = () => {
  const pathways = [
    {
      id: 1,
      title: "Pathway 1",
      background: "bg-blue-500",
      contentBadges: ["Course", "Internship", "Project"],
      duration: "3 months",
      skills: "21 Skills"
    },
    {
      id: 2,
      title: "Pathway 2",
      background: "bg-orange-400",
      contentBadges: ["Internship", "Project", "Project"],
      duration: "2 months",
      skills: "21 Skills"
    },
    {
      id: 3,
      title: "Pathway 3",
      background: "bg-purple-500",
      contentBadges: ["Project", "Course", "Project"],
      duration: "4 weeks",
      skills: "21 Skills"
    }
  ];

  return (

    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
    
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Your personalised pathways
          </h1>
        </div>

        {/* Pathway Cards */}
        <div className="space-y-6">
          {pathways.map((pathway) => (
            <div
              key={pathway.id}
              className={`${pathway.background} rounded-lg p-6 text-white relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                {/* Left side - Image and content */}
                <div className="flex items-center space-x-6">
                  {/* Thumbnail Image */}
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <div className="w-16 h-12 bg-white/30 rounded flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{pathway.title}</h2>
                    <p className="text-white/80 text-lg">?</p>
                    
                    {/* Content Badges */}
                    <div className="flex items-center space-x-2">
                      <Badge 
                        color={`${pathway.background.replace('bg-', 'bg-').replace('-500', '-600').replace('-400', '-500')} text-white border-0`}
                        text={pathway.contentBadges.join(", ")}
                      />
                      <Badge 
                        color={`${pathway.background.replace('bg-', 'bg-').replace('-500', '-600').replace('-400', '-500')} text-white border-0`}
                        text={pathway.duration}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side - Skills badge */}
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
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="text-center pt-8">
          <Button 
            variant="primary" 
            size="large"
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-lg"
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

export default Myapplication8;
