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

      {/* Mobile/Tablet Header Section - Only visible on small devices */}
      <div className="lg:hidden absolute top-16 left-4 sm:top-20 sm:left-6 md:top-24 md:left-8 z-30 max-w-xs sm:max-w-sm">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black leading-tight mb-1 sm:mb-2">
          {heading}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
          {subheading}
        </p>
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
      <div className="relative z-20 flex flex-col lg:flex-row items-start justify-between max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 gap-x-6 mt-32 sm:mt-36 md:mt-40 lg:mt-20 lg:mt-24 lg:mt-28">
        {/* Left Section - Desktop Only */}
        <div className="hidden lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-3 sm:space-y-4 lg:sticky lg:top-28">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            {heading}
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 max-w-md">
            {subheading}
          </p>
          <img
            src={SignUpIllustration}
            alt="Sign Up Illustration"
            className="w-52 sm:w-64 md:w-72 lg:w-80 mt-2 sm:mt-4 hidden lg:block"
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
