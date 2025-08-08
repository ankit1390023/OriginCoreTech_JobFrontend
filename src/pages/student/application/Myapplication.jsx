import React from "react";
import { Badge } from "../../../components/ui";

const Dashboard = () => {
  // Mock data for the dashboard
  const userData = {
    name: "Aman Gupta",
    username: "@amangupta09",
    level: 0,
    skillsCompleted: 10,
    totalSkills: 21,
    progressPercentage: (10 / 21) * 100
  };

  const pathwayData = {
    title: "Graphic Design",
    completionPercentage: 38,
    learners: "16,856",
    duration: "8 weeks",
    type: "Course",
    skills: [
      { name: "Typography", icon: "Aa", completed: true },
      { name: "Color Theory", icon: "🎨", completed: true },
      { name: "Adobe Photoshop", icon: "A", completed: true },
      { name: "Composition", icon: "Aa", completed: false },
      { name: "Adobe Illustrator", icon: "A", completed: false },
      { name: "Color wheel", icon: "🎨", completed: false },
      { name: "Figma", icon: "A", completed: false },
      { name: "Typography", icon: "Aa", completed: false },
      { name: "Color Theory", icon: "🎨", completed: false }
    ]
  };

  const applications = [
    {
      company: "Company Name",
      applicants: "62,583",
      type: "Internship",
      duration: "2 months",
      status: "Hired",
      skills: 7,
      color: "bg-orange-500",
      logo: "📱"
    },
    {
      company: "Company Name",
      applicants: "122,263",
      type: "Project",
      duration: "2 weeks",
      skills: 5,
      color: "bg-gray-400",
      logo: "🔒"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        {/* User Profile Section */}
        <div className="bg-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-blue-200">{userData.username}</p>
              <p className="text-sm mt-1">Level {userData.level}</p>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-blue-700 rounded-full h-3">
                    <div 
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${userData.progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    SKILLS {userData.skillsCompleted} / {userData.totalSkills}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Pathway Section */}
        <div className="bg-blue-300 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            {/* Progress Circle */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-bold">{pathwayData.completionPercentage}%</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            </div>

            {/* Pathway Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold">{pathwayData.title}</h3>
              <p className="text-blue-800 text-sm">{pathwayData.learners} learners</p>
              
              {/* Course Badges */}
              <div className="flex gap-2 mt-2">
                <Badge 
                  color="bg-blue-400 text-white border-blue-400"
                  className="text-xs"
                >
                  {pathwayData.type}
                </Badge>
                <Badge 
                  color="bg-blue-400 text-white border-blue-400"
                  className="text-xs"
                >
                  {pathwayData.duration}
                </Badge>
              </div>

              {/* Skills List */}
              <div className="mt-4 space-y-2">
                {pathwayData.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      skill.completed ? 'bg-blue-400' : 'bg-gray-200'
                    } ${skill.completed ? 'text-white' : 'text-gray-700'}`}
                  >
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-lg">{skill.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Count Badge */}
            <Badge 
              color="bg-blue-400 text-white border-blue-400"
              className="text-xs"
            >
              👁️ {pathwayData.skills.length} Skills
            </Badge>
          </div>
        </div>

        {/* Job Applications Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app, index) => (
            <div key={index} className={`${app.color} rounded-xl p-4 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Company Logo */}
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{app.logo}</span>
                  </div>

                  {/* Company Info */}
                  <div>
                    <h4 className="font-bold">{app.company}</h4>
                    <p className="text-sm opacity-90">{app.applicants} applicants</p>
                    
                    {/* Application Badges */}
                    <div className="flex gap-2 mt-2">
                      <Badge 
                        color={`${app.color} text-white border-transparent`}
                        className="text-xs"
                      >
                        {app.type}
                      </Badge>
                      <Badge 
                        color={`${app.color} text-white border-transparent`}
                        className="text-xs"
                      >
                        {app.duration}
                      </Badge>
                      {app.status && (
                        <Badge 
                          color="bg-green-500 text-white border-transparent"
                          className="text-xs"
                        >
                          {app.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Count Badge */}
                <Badge 
                  color={`${app.color} text-white border-transparent`}
                  className="text-xs"
                >
                  👁️ {app.skills} Skills
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
