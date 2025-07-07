import React from "react";
import LoginIllustration from "../../assets/Login_Illustration.png";

export default function AuthLayout({ children, title, subtitle, showIllustration = true }) {
    return (
        <div className="min-h-screen w-full relative bg-white overflow-hidden">
            {/* Logo at top-left */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    YourLogo
                </span>
            </div>

            {/* Top Blue Section */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#072366] z-0" />
            {/* Bottom White Section */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-0" />

            {/* Content */}
            <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
                {/* Left Side: Text and Illustration */}
                <div className="flex-1 flex flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-16 pt-24 sm:pt-28 md:pt-32 lg:pt-28">
                    {/* Top-left text in blue section */}
                    <div className="text-center lg:text-left mb-8 lg:mb-0">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-white text-sm sm:text-base mb-2">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Bottom-left illustration in white section */}
                    {showIllustration && (
                        <div className="hidden lg:block lg:pb-12">
                            <img
                                src={LoginIllustration}
                                alt="Login Illustration"
                                className="w-[280px] sm:w-[320px] lg:w-[340px] max-w-full rotate-[-90deg]"
                            />
                        </div>
                    )}
                </div>

                {/* Right Side: Form Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 lg:py-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
