import React from "react";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import websiteLogo from "../../assets/WebsiteLogo.svg";
import { Link } from "../ui";

export default function SignUpLayoutForLarge({
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

            {/* Main Content */}
            <div className="relative z-20 flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-center max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto lg:px-6 py-8 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-8 xl:gap-x-16 2xl:gap-x-32 mt-20 md:mt-28 lg:mt-4 min-h-[calc(100vh-2rem)]">
                {/* Left Section - Desktop Only */}
                <div className="hidden relative -top-8 ml-14 lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-2 sm:space-y-3 lg:sticky lg:top-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                        {heading}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-md">
                        {subheading}
                    </p>
                    <img
                        src={SignUpIllustration}
                        alt="Sign Up Illustration"
                        className="w-40 sm:w-48 md:w-56 lg:w-64 mt-10 sm:mt-12 hidden lg:block"
                    />
                </div>

                {/* Right Section */}
                <div className="flex-1 w-full flex flex-col items-center justify-center h-full">
                    {/* Heading and Subheading for mobile/tablet */}
                    <div
                        className={`block lg:hidden flex flex-col mb-8 w-full -mt-4 ${centerMobileContent
                            ? "items-center text-center"
                            : "items-start text-left"
                            }`}
                    >
                        {!hideMobileIllustration && (
                            <img
                                src={SignUpIllustration}
                                alt="Sign Up Illustration"
                                className="w-80 h-80 sm:w-96 sm:h-96 object-contain mb-2"
                            />
                        )}
                        <h1 className="text-2xl font-bold text-black mb-1  w-full px-4 py-2">
                            {heading}
                        </h1>
                        <p className="text-sm -mt-4 text-gray-700 w-full px-4 py-2">
                            {subheading}
                        </p>
                    </div>

                    <div className="w-full lg:p-0">{children}</div>
                </div>
            </div>
        </div>
    );
}
