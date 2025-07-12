import React from "react";
import LoginIllustration from "../../assets/Login_Illustration.png";
import websiteLogo from "../../assets/websiteLogo.svg";

export default function AuthLayout({ children, title, subtitle, showIllustration = true }) {
    return (
        <div className="w-full min-h-screen bg-white overflow-hidden relative">
            {/* Fixed Background Split */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-1/2 bg-[#072366]"></div>
                <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
            </div>

            {/* Logo */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-30">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    <img src={websiteLogo} alt="Logo" className="w-10 h-10" />
                </span>
            </div>

            {/* Mobile/Tablet Header Section - Only visible on small devices */}
            <div className="lg:hidden absolute top-12 left-4 sm:top-16 sm:left-6 md:top-20 md:left-8 z-30 max-w-xs sm:max-w-sm">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight mb-1">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xs font-medium text-white leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Main Content */}
            <div className="relative z-20 flex flex-col lg:flex-row items-start justify-start max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-2 mt-20 sm:mt-24 md:mt-28 lg:mt-12 lg:mt-16 lg:mt-20">
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
