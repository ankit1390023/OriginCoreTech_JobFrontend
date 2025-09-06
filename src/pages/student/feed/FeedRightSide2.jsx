import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button } from "../../../components/ui";
import dummyProfile1 from "../../../assets/dummyProfile1.jpg";
import dummyProfile2 from "../../../assets/dummyProfile2.jpg";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";
import uberLogo from "../../../assets/uber-logo.png";
import carDashboard from "../../../assets/car-dashboard.png";
import { getImageUrl } from "../../../../utils.js";

import { FaEye } from 'react-icons/fa';

  // Course Data
const courses = [
  {
    id: 1,
    title: "Graphic Design",
    learners: "122,263 learners",
    tag: "Lesson",
    duration: "8 weeks",
    bgColor: "bg-[#6EB5DD]",
    tagColor: "bg-[#4599C8]",
  },
  {
    id: 2,
    title: "Graphic Design",
    learners: "122,263 learners",
    tag: "Competition",
    duration: "4 days",
    bgColor: "bg-[#E8AC6E]",
    tagColor: "bg-[#C57829]",
  },
  {
    id: 3,
    title: "Graphic Design",
    learners: "122,263 learners",
    tag: "Project",
    duration: "2 weeks",
    bgColor: "bg-[#888CE4]",
    tagColor: "bg-[#5B60CD]",
  },
];


const FeedRightSide2 = () => {
  const navigate = useNavigate();
  const [expandedPathway, setExpandedPathway] = useState(null);

  const profileVisitors = [
    { name: "Olivia Rhye", img: dummyProfile1 },
    { name: "Phoenix Baker", img: dummyProfile2 },
    { name: "Lana Steiner", img: dummyProfile3 },
    { name: "Milo Thorne", img: dummyProfile1 },
    { name: "Olivia Rhye", img: dummyProfile1 },
    { name: "Lana Steiner", img: dummyProfile3 },
    { name: "Milo Thorne", img: dummyProfile1 },
    { name: "Phoenix Baker", img: dummyProfile2 },
  ];

  const stats = [
    { value: "367", label: "Views today" },
    { value: "15", label: "Post views" },
    { value: "09", label: "Search appearance" },
  ];

  const handlePathwayClick = (pathwayId) => {
    if (pathwayId === 1) {
      setExpandedPathway(expandedPathway === pathwayId ? null : pathwayId);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100">
      <div
        className="flex flex-col mt-4 bg-white shadow-md"
        style={{
          width: "375px",
          height: "725px",
          borderRadius: "10px",
          paddingTop: "20px",
          paddingRight: "10px",
          paddingBottom: "20px",
          paddingLeft: "10px",
          gap: "30px",
          opacity: 1,
        }}
      >

        {/* Profile Visitors */}
        <div>
          <h2 className="text-lg font-semibold">Profile Visitors</h2>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {profileVisitors.map((visitor, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={visitor.img}
                  alt={visitor.name}
                  className="object-cover rounded-md w-14 h-14"
                />
                <p className="mt-1 text-xs text-center text-gray-700">
                  {visitor.name}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/recruiter-see-more-visitors")}
            className="block mt-2 text-sm text-center text-blue-500 hover:underline"
          >
            See more
          </button>
        </div>

        <hr />

        {/* Dashboard Stats */}
        <div>
          <h2 className="text-lg font-semibold">Your Dashboard</h2>
          <div className="grid grid-cols-3 mt-3 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <p className="text-2xl font-bold text-yellow-600">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/recruiter-see-more-dashboard-stats")}
            className="block mt-2 text-sm text-center text-blue-500 hover:underline"
          >
            See more
          </button>
        </div>

        <hr />

        {/* Course List */}
                  <div className="flex flex-col gap-6 mt-4">
                  <h1 className="mb-2 text-lg font-bold text-gray-900">Your Like thease</h1>
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className={`${course.bgColor} text-white rounded-lg p-4 flex flex-col gap-3`}
                      >
                        {/* Top Row */}
                        <div className="flex items-center gap-3">
                          <img
                            src="https://via.placeholder.com/50"
                            alt="course"
                            className="object-cover w-12 h-12 rounded-md"
                          />
                          <div>
                            <h3 className="text-base font-semibold">{course.title}</h3>
                            <p className="text-xs text-gray-100">{course.learners}</p>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1 ml-auto bg-gray-100 rounded-full">
                            <FaEye className="text-xs text-gray-600" />
                            <span className="text-[10px] text-gray-700">Skills</span>
                          </div>
                        </div>
            
                        {/* Bottom Row */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`${course.tagColor} px-3 py-1 rounded-md text-xs`}
                          >
                            {course.tag}
                          </span>
                          <span className="px-3 py-1 text-xs text-gray-800 bg-white rounded-md">
                            {course.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
      </div>
    </div>
  );
};

export default FeedRightSide2;
