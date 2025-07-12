import React from "react";
import SignUpIllustration from "../../../assets/SignUp_Illustration.png";
import websiteLogo from "../../../assets/websiteLogo.svg";
export default function StudentSignUpLayout({ children, heading, subheading, hideMobileIllustration = false, centerMobileContent = false }) {
  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-30">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          <img src={websiteLogo} alt="Logo" className="w-10 h-10" />
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
      <div className="relative z-20 flex flex-col lg:flex-row items-start justify-start max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-2 mt-20 sm:mt-24 md:mt-28 lg:mt-12 lg:mt-16 lg:mt-20">
        {/* Left Section - Desktop Only */}
        <div className="hidden ml-14 lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-2 sm:space-y-3 lg:sticky lg:top-28">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            {heading}
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-md">
            {subheading}
          </p>
          <img
            src={SignUpIllustration}
            alt="Sign Up Illustration"
            className="w-40 sm:w-48 md:w-56 lg:w-64 mt-1 sm:mt-2 hidden lg:block"
          />
        </div>
        {/* Right Section */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          {/* Heading and Subheading for mobile/tablet */}
          <div className={`block lg:hidden flex flex-col mb-8 w-full ${centerMobileContent ? 'items-center text-center' : 'items-start text-left'}`}>
            {!hideMobileIllustration && (
              <img
                src={SignUpIllustration}
                alt="Sign Up Illustration"
                className="w-60 h-60 sm:w-64 sm:h-64 object-contain mb-2"
              />
            )}
            <h1 className="text-2xl font-bold text-black mb-1">{heading}</h1>
            <p className="text-sm text-gray-700">{subheading}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
