import React from "react";
import LoginIllustration from "../../assets/Login_Illustration.png";

export default function AuthLayout({ children, title, subtitle, showIllustration = true }) {
    return (
        <div className="relative w-full min-h-screen bg-white overflow-hidden">
            {/* Fixed Background Split */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-1/2 bg-[#072366]"></div>
                <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
            </div>

            {/* Logo */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-30">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    YourLogo
                </span>
            </div>

            {/* Content */}
            <div className="relative top-16 z-10 flex flex-col lg:flex-row items-start min-h-screen ml-4 sm:ml-8 md:ml-12 lg:ml-20">
                {/* Left Side */}
                <div className="w-full lg:w-3/5 pl-4 sm:pl-8 md:pl-12 lg:pl-16 pr-4 py-8 sm:py-12 md:py-16 lg:py-32 relative">
                    <div className="max-w-xl">
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-white text-sm sm:text-base mt-1 sm:mt-2">{subtitle}</p>
                        )}
                    </div>

                    {showIllustration && (
                        <div className="mt-6 sm:mt-8 lg:mt-10 hidden lg:block">
                            <img
                                src={LoginIllustration}
                                alt="Login Illustration"
                                className="w-[280px] sm:w-[320px] lg:w-[340px] max-w-full rotate-[-90deg]"
                            />
                        </div>
                    )}
                </div>

                {/* Right Side (Form) - Scrollable with fixed height */}
                <div className="w-full lg:w-3/5 px-4 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-8 md:pt-12 lg:pt-24 pb-32 h-screen overflow-y-auto">
                    <div className="max-w-md mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
