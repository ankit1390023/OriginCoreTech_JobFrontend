import React from "react";
import { FaEye } from "react-icons/fa";

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

const CoursesCard = () => {
  return (
    <div
    className="bg-white shadow-md flex flex-col w-[347px] h-[543px] top-[99px] ml-40 rounded-[10px] p-[20px_10px] gap-[30px] opacity-1"
>
      {/* Title */}
      <h2 className="text-2xl font-bold text-black">Courses</h2>
      <p className="text-sm text-gray-500">Lorem Ipsum</p>

      {/* Course List */}
      <div className="flex flex-col gap-6 mt-4">
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
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <h3 className="text-base font-semibold">{course.title}</h3>
                <p className="text-xs text-gray-100">{course.learners}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
                <FaEye className="text-gray-600 text-xs" />
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
              <span className="bg-white text-gray-800 px-3 py-1 rounded-md text-xs">
                {course.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default CoursesCard;
