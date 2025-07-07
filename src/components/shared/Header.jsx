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
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-2 w-full h-16" style={{ background: 'linear-gradient(90deg, #f5f6f7 60%, #ffe9b3 100%)' }}>
            {/* Logo */}
            <div className="flex items-center">
                <p className="text-xl sm:text-2xl font-bold">Your Logo</p>
            </div>

            {/* Desktop Nav Tabs - absolutely centered */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-sm px-1 py-1 gap-1 z-10">
                <NavLink
                    to="/Feed"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-4 sm:px-6 py-2 font-medium shadow text-sm sm:text-base"
                            : "text-[#00194A] px-4 sm:px-6 py-2 rounded-full font-medium hover:bg-gray-100 text-sm sm:text-base"
                    }
                >Feed</NavLink>
                <NavLink
                    to="/all-jobs"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-4 sm:px-6 py-2 font-medium shadow text-sm sm:text-base"
                            : "text-[#00194A] px-4 sm:px-6 py-2 rounded-full font-medium hover:bg-gray-100 text-sm sm:text-base"
                    }
                >Jobs</NavLink>
                <NavLink
                    to="/ai-prediction"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-4 sm:px-6 py-2 font-medium shadow text-sm sm:text-base"
                            : "text-[#00194A] px-4 sm:px-6 py-2 rounded-full font-medium hover:bg-gray-100 text-sm sm:text-base"
                    }
                >AI Prediction</NavLink>
            </div>

            {/* Search Bar and Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Search Bar */}
                <div className="hidden sm:flex bg-white items-center rounded-full px-4 py-2 w-[280px] lg:w-[340px] shadow-inner">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-sm lg:text-base"
                    />
                    <FaSearch className="text-[#00194A] text-lg" />
                </div>

                {/* Mobile Search Icon */}
                <div className="sm:hidden bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow" onClick={toggleSearch}>
                    <FaSearch className="text-[#00194A] text-lg" />
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Desktop Icons */}
                    <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                        <div className="bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow">
                            <FiMessageCircle className="text-[#00194A] text-xl" />
                        </div>
                        <div className="bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow">
                            <FaBell className="text-[#00194A] text-xl" />
                        </div>
                        <div className="bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow">
                            <FaUser className="text-[#00194A] text-xl" />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? (
                            <FaTimes className="text-[#00194A] text-xl" />
                        ) : (
                            <FaBars className="text-[#00194A] text-xl" />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Expandable */}
            {isSearchExpanded && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 z-20 sm:hidden">
                    <div className="flex items-center rounded-full px-4 py-2 border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-base"
                            autoFocus
                        />
                        <FaSearch className="text-[#00194A] text-lg" />
                    </div>
                </div>
            )}

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 sm:hidden">
                    <div className="flex flex-col p-4 space-y-4">
                        {/* Mobile Nav Links */}
                        <div className="flex flex-col space-y-2">
                            <NavLink
                                to="/Feed"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-4 py-3 font-medium"
                                        : "text-[#00194A] px-4 py-3 rounded-lg font-medium hover:bg-gray-100"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >Feed</NavLink>
                            <NavLink
                                to="/all-jobs"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-4 py-3 font-medium"
                                        : "text-[#00194A] px-4 py-3 rounded-lg font-medium hover:bg-gray-100"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >Jobs</NavLink>
                            <NavLink
                                to="/ai-prediction"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-4 py-3 font-medium"
                                        : "text-[#00194A] px-4 py-3 rounded-lg font-medium hover:bg-gray-100"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >AI Prediction</NavLink>
                        </div>

                        {/* Mobile Action Icons */}
                        <div className="flex items-center justify-around pt-4 border-t border-gray-200">
                            <div className="bg-gray-100 cursor-pointer rounded-full w-12 h-12 flex items-center justify-center">
                                <FiMessageCircle className="text-[#00194A] text-xl" />
                            </div>
                            <div className="bg-gray-100 cursor-pointer rounded-full w-12 h-12 flex items-center justify-center">
                                <FaBell className="text-[#00194A] text-xl" />
                            </div>
                            <div className="bg-gray-100 cursor-pointer rounded-full w-12 h-12 flex items-center justify-center">
                                <FaUser className="text-[#00194A] text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}