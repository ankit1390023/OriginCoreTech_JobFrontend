import React from "react";
import AiProfileIllustration1 from "../../assets/AiProfileIllustration1.png";
import websiteLogo from "../../assets/WebsiteLogo.svg";
import { Link } from "../ui";

export default function AiLayout1({
    children,
    heading,
    subheading,
    hideMobileIllustration = false,
    centerMobileContent = false,
}) {
    return (
        <div className="w-full min-h-screen bg-white overflow-hidden relative">
            {/* Logo */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-6 lg:top-8 lg:left-8 z-30">
                <Link
                    to="/"
                    className="text-xl sm:text-2xl font-bold text-white tracking-wide hover:opacity-80 transition-opacity"
                >
                    <img src={websiteLogo} alt="Logo" className="w-10 h-10" />
                </Link>
            </div>

            {/* Fixed Top Decorative Section with CSS Curve */}
            <div
                className="absolute top-0 left-0 w-full h-[85vh] bg-[#6EB5DD66] z-0 pointer-events-none"
                style={{
                    clipPath: "ellipse(110% 60% at 50% 0)"
                }}
            />


            {/* Main Content Wrapper for vertical centering on large screens */}
            <div className="w-full sm:mt-36 h-full flex flex-col lg:flex-row lg:items-center lg:justify-center min-h-screen">
                {/* Main Content Row */}
                <div className="relative z-20 flex flex-col lg:flex-row items-start justify-start max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto lg:px-6 py-4 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-8 xl:gap-x-16 2xl:gap-x-32 mt-4 w-full">
                    {/* Left Section - Desktop Only */}
                    <div className="hidden ml-14 lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-2 sm:space-y-3 lg:mt-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                            {heading}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-md">
                            {subheading}
                        </p>
                        <img
                            src={AiProfileIllustration1}
                            alt="AiProfileIllustration1"
                            className="w-40 sm:w-48 md:w-56 bg-white  lg:w-64 mt-10 sm:mt-12 hidden lg:block"
                        />
                    </div> 

                    {/* Right Section */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center lg:mt-8">
                        {/* Heading and Subheading for mobile/tablet */}
                        <div
                            className={`block lg:hidden flex flex-col mb-8 w-full mt-8 ${centerMobileContent
                                ? "items-center text-center"
                                : "items-start text-left"
                                }`}
                        >
                            {!hideMobileIllustration && (
                                <img
                                    src={AiProfileIllustration1}
                                    alt="Sign Up Illustration"
                                    className="w-80 h-80 sm:w-96 bg-white msm:h-96 object-contain mb-2 bg-white rounded-full"
                                />
                            )}
                            <h1 className="text-2xl font-bold text-black mb-1  w-full px-4 py-2">
                                {heading}
                            </h1>
                            <p className="text-sm -mt-4 text-gray-700 w-full px-4 py-2">
                                {subheading}
                            </p>
                        </div>

                        <div className="w-full -mt-8  lg:p-0">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
