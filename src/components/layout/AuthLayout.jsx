import React from "react";
import LoginIllustration from "../../assets/Login_Illustration.png";
import websiteLogo from "../../assets/WebsiteLogo.svg";
import { Link } from "react-router-dom";
export default function AuthLayout({ children, title, subtitle, showIllustration = true }) {
    return (
        <div className="fixed sticky inset-0 top-0 z-50 w-full h-screen overflow-hidden bg-white">

            {/* Large screen background split: top half blue, bottom half white */}
            <div className="absolute inset-0 z-0 hidden pointer-events-none lg:block">
                <div className="w-full h-1/2 bg-[#072366]"></div>
                <div className="absolute bottom-0 w-full bg-white h-1/2"></div>
            </div>


            {/* Logo */}
            <div className="absolute z-30 hidden lg:block top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-6 lg:top-8 lg:left-8">
                <Link to="/" className="text-xl font-bold tracking-wide text-white transition-opacity sm:text-2xl hover:opacity-80">
                    <img src={websiteLogo} alt="Logo" className="w-10 h-10" />
                </Link>
            </div>
            {/* Mobile Header (Blue Top) - Only for small devices */}
            <div className="block lg:hidden w-full bg-[#072366] h-48 sm:h-56 md:h-64 px-2 sm:px-4 md:px-6 flex flex-col justify-start pt-8">
                <div className="flex items-center mb-6">
                    <img src={websiteLogo} alt="Logo" className="w-10 h-10" />
                </div>
                <h1 className="mb-1 text-2xl font-bold leading-tight text-left text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm font-medium leading-relaxed text-left text-white">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Main Content for Mobile: form strictly below blue header, no card, no shadow */}
            <div className="block w-full px-4 pt-6 pb-8 bg-white lg:hidden">
                {children}
            </div>

            {/* Desktop/Large Screen Layout (unchanged, but now above split background) */}
            <div className="relative z-20 flex-col items-center justify-center hidden max-w-5xl min-h-screen px-2 py-8 mx-auto lg:flex lg:flex-row lg:max-w-6xl xl:max-w-7xl sm:px-4 lg:px-6 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-2">
                {/* Left Section - Desktop Only */}
                <div className="flex-col items-center flex-1 hidden space-y-2 text-center ml-14 lg:flex lg:items-start lg:text-left sm:space-y-3 lg:sticky lg:top-28">
                    <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="max-w-md text-xs font-medium text-white sm:text-sm md:text-base">
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
                <div className="flex justify-center flex-1 w-full">
                    <div className="w-full ">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
