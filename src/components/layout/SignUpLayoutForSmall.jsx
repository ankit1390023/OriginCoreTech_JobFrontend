import React from "react";
import LoginIllustration from "../../assets/Login_Illustration.png";
import websiteLogo from "../../assets/WebsiteLogo.svg";

export default function SignUpLayoutForSmall({ children, title, subtitle, showIllustration = true }) {
    return (
        <div className="w-full min-h-screen bg-white overflow-hidden relative">
            {/* Large screen background split: top half blue, bottom half white */}
            <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-1/2 bg-[#072366]"></div>
                <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
            </div>

            {/* Logo for large devices (top left) */}
            <div className="hidden lg:block absolute top-8 left-6 z-30">
                <img src={websiteLogo} alt="Logo" className="w-12 h-12" />
            </div>

            {/* Mobile Header (Blue Top) - Only for small devices */}
            <div className="block lg:hidden w-full bg-[#6EB5DD66] h-48 sm:h-56 md:h-64 px-4 sm:px-6 flex flex-col justify-start pt-8">
                <div className="flex items-center mb-6">
                    <img src={websiteLogo} alt="Logo" className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-black leading-tight mb-1 text-left">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm font-medium text-black leading-relaxed text-left">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Main Content for Mobile: form strictly below blue header, no card, no shadow */}
            <div className="block lg:hidden w-full bg-white px-4 pt-6 pb-8">
                {children}
            </div>

            {/* Desktop/Large Screen Layout (unchanged, but now above split background) */}
            <div className="hidden lg:flex relative z-20 flex-col lg:flex-row items-start justify-start max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-2 mt-20 sm:mt-24 md:mt-28 lg:mt-12 lg:mt-16 lg:mt-20">
                {/* Left Section - Desktop Only */}
                <div className="hidden ml-14 lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-2 sm:space-y-3 lg:sticky lg:top-28">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs sm:text-sm md:text-base font-medium text-white max-w-md">
                            {subtitle}
                        </p>
                    )}
                    {showIllustration && (
                        <img
                            src={LoginIllustration}
                            alt="Login Illustration"
                            className="w-40 sm:w-48 md:w-56 lg:w-64 mt-1 sm:mt-2 hidden lg:block rotate-[-90deg]"
                        />
                    )}
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
