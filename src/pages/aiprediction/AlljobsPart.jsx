import React, { useState } from "react";
import { FaEye, FaPalette, FaFont, FaRegImage } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";
import CoursePart from "./CoursePart";

const GraphicDesignCard = () => {
  const [open, setOpen] = useState(false); // toggle for dropdown

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[425px] max-w-[425px] p-2 sticky top-4 h-fit ml-4">
          <CoursePart />
        </aside>

        <div className="hidden lg:block flex-grow"></div>

        {/* Main Card */}
        <div
          className="bg-white shadow-md flex flex-col"
          style={{
            width: "759px",
            minHeight: "903px",
            borderRadius: "10px",
            padding: "20px 24px",
            gap: "20px",
          }}
        >
          {/* Header & Skills Container */}
          <div
            className="flex flex-col cursor-pointer"
            style={{
              width: "681px",
              borderRadius: "10px",
              background: "#6EB5DD",
              padding: "16px 20px",
            }}
            onClick={() => setOpen((prev) => !prev)} // toggle dropdown
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src="https://via.placeholder.com/60"
                alt="graphic"
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex flex-col text-white">
                <h2 className="text-lg font-semibold">Graphic Design</h2>
                <p className="text-sm">122,263 learners</p>
              </div>

              <div className="ml-auto flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                <FaEye className="text-gray-600 text-sm" />
                <span className="text-xs text-gray-700">Skills</span>
              </div>
            </div>

            {/* Lessons */}
            <div className="flex items-center gap-4 mt-2">
              <span className="bg-white/70 px-3 py-1 text-xs rounded-full text-gray-700">
                Lesson
              </span>
              <span className="bg-white/70 px-3 py-1 text-xs rounded-full text-gray-700">
                8 weeks
              </span>
            </div>

            {/* Collapsible Skills */}
            {open && (
              <div className="flex flex-col mt-3 rounded-b-md overflow-hidden transition-all duration-300">
                <button className="flex items-center justify-between bg-[#6EB5DDCC] px-4 py-2">
                  <span>Typography</span> <FaFont />
                </button>
                <button className="flex items-center justify-between bg-[#6EB5DDCC] px-4 py-2">
                  <span>Color Theory</span> <FaPalette />
                </button>
                <button className="flex items-center justify-between bg-[#6EB5DDCC] px-4 py-2">
                  <span>Adobe Photoshop</span> <FaRegImage />
                </button>
              </div>
            )}
          </div>

          {/* Skills List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
            <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
              <li>Fundamentals of Visual Design</li>
              <li>Design for Print & Digital</li>
              <li>Design for Digital</li>
              <li>Brand Identity Design</li>
              <li>Portfolio Development</li>
              <li>Motion Graphics</li>
              <li>Brand Promotion & Communication</li>
            </ul>
          </div>

          {/* About Course */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About the course</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our Graphic Design courses teach you how to visualise an idea from a
              concept to impactful communications. Learn to design brand identities,
              web pages, social media posts, brochures, etc. Create a portfolio
              based on real-world projects as part of the course and get hired by
              top brands.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Get a unique classroom-like learning experience with interactive
              online sessions.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Lectures by leading faculties and dedicated mentorship by industry
              professionals from around the world.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Our programmes come with best-in-class placement support/Job
              Guarantee.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Build a network of design professionals and make lifelong
              connections.
            </p>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center mt-4">
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-full shadow-md transition">
              Apply
            </button>
          </div>
        </div>

        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow "></div>
      </div>
    </MainLayout>
  );
};

export default GraphicDesignCard;
