import { NavLink } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
    };

    return (
        <div className="relative flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 w-full h-16" style={{ background: 'linear-gradient(90deg, #f5f6f7 60%, #ffe9b3 100%)' }}>
            {/* Logo */}
            <div className="flex items-center">
                <p className="text-lg sm:text-xl md:text-2xl font-bold">Your Logo</p>
            </div>

            {/* Desktop Nav Tabs - absolutely centered */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-sm px-1 py-1 gap-1 z-10">
                <NavLink
                    to="/Feed"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-3 md:px-4 lg:px-6 py-2 font-medium shadow text-sm md:text-base"
                            : "text-[#00194A] px-3 md:px-4 lg:px-6 py-2 rounded-full font-medium hover:bg-gray-100 text-sm md:text-base"
                    }
                >Feed</NavLink>
                <NavLink
                    to="/all-jobs"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-3 md:px-4 lg:px-6 py-2 font-medium shadow text-sm md:text-base"
                            : "text-[#00194A] px-3 md:px-4 lg:px-6 py-2 rounded-full font-medium hover:bg-gray-100 text-sm md:text-base"
                    }
                >Jobs</NavLink>
                <NavLink
                    to="/ai-prediction"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-3 md:px-4 lg:px-6 py-2 font-medium shadow text-sm md:text-base"
                            : "text-[#00194A] px-3 md:px-4 lg:px-6 py-2 rounded-full font-medium hover:bg-gray-100 text-sm md:text-base"
                    }
                >AI Prediction</NavLink>
            </div>

            {/* Search Bar and Right Icons */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                {/* Desktop Search Bar */}
                <div className="hidden md:flex bg-white items-center rounded-full px-3 md:px-4 py-2 w-[200px] lg:w-[280px] xl:w-[340px] shadow-inner">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-sm md:text-base"
                    />
                    <FaSearch className="text-[#00194A] text-base md:text-lg" />
                </div>

                {/* Mobile Search Icon */}
                <div className="md:hidden bg-white cursor-pointer rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow" onClick={toggleSearch}>
                    <FaSearch className="text-[#00194A] text-base md:text-lg" />
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                    {/* Desktop Icons */}
                    <div className="hidden md:flex items-center gap-2 md:gap-3 lg:gap-4">
                        <div className="bg-white cursor-pointer rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow">
                            <FiMessageCircle className="text-[#00194A] text-lg md:text-xl" />
                        </div>
                        <div className="bg-white cursor-pointer rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow">
                            <FaBell className="text-[#00194A] text-lg md:text-xl" />
                        </div>
                        <div className="bg-white cursor-pointer rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow">
                            <FaUser className="text-[#00194A] text-lg md:text-xl" />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden bg-white cursor-pointer rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? (
                            <FaTimes className="text-[#00194A] text-lg md:text-xl" />
                        ) : (
                            <FaBars className="text-[#00194A] text-lg md:text-xl" />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Expandable */}
            {isSearchExpanded && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-3 md:p-4 z-20 md:hidden">
                    <div className="flex items-center rounded-full px-3 md:px-4 py-2 border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-sm md:text-base"
                            autoFocus
                        />
                        <FaSearch className="text-[#00194A] text-base md:text-lg" />
                    </div>
                </div>
            )}

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 md:hidden">
                    <div className="flex flex-col p-3 md:p-4 space-y-3 md:space-y-4">
                        {/* Mobile Nav Links */}
                        <div className="flex flex-col space-y-2 md:space-y-3">
                            <NavLink
                                to="/Feed"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-3 md:px-4 py-2 md:py-3 font-medium text-sm md:text-base"
                                        : "text-[#00194A] px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-100 text-sm md:text-base"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >Feed</NavLink>
                            <NavLink
                                to="/all-jobs"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-3 md:px-4 py-2 md:py-3 font-medium text-sm md:text-base"
                                        : "text-[#00194A] px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-100 text-sm md:text-base"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >Jobs</NavLink>
                            <NavLink
                                to="/ai-prediction"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-3 md:px-4 py-2 md:py-3 font-medium text-sm md:text-base"
                                        : "text-[#00194A] px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-100 text-sm md:text-base"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >AI Prediction</NavLink>
                        </div>

                        {/* Mobile Action Icons */}
                        <div className="flex items-center justify-around pt-3 md:pt-4 border-t border-gray-200">
                            <div className="bg-gray-100 cursor-pointer rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                                <FiMessageCircle className="text-[#00194A] text-lg md:text-xl" />
                            </div>
                            <div className="bg-gray-100 cursor-pointer rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                                <FaBell className="text-[#00194A] text-lg md:text-xl" />
                            </div>
                            <div className="bg-gray-100 cursor-pointer rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                                <FaUser className="text-[#00194A] text-lg md:text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}