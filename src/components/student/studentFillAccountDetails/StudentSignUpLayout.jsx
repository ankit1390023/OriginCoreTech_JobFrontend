import React from "react";
import SignUpIllustration from "../../../assets/SignUp_Illustration.png";

export default function StudentSignUpLayout({ children, heading, subheading }) {
  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-30">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          YourLogo
        </span>
      </div>
      {/* Fixed Top Decorative Section */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-[#6EB5DD66] z-0 pointer-events-none" />
      {/* Fixed SVG Divider */}
      <div className="absolute top-[40vh] left-0 w-full z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q720,100 1440,0 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>
      {/* Main Content */}
      <div className="relative z-20 flex flex-col lg:flex-row items-start justify-between max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 py-16 gap-y-10 gap-x-6 mt-28">
        {/* Left Section */}
        <div className="hidden ml-12 lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:sticky lg:top-28">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            {heading}
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 max-w-md">
            {subheading}
          </p>
          <img
            src={SignUpIllustration}
            alt="Sign Up Illustration"
            className="w-52 sm:w-64 md:w-72 lg:w-80 mt-4"
          />
        </div>
        {/* Right Section */}
        <div className="flex-1 w-full flex justify-center">
            <div className="w-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>
        </div>
      </div>
    </div>
  );
}
