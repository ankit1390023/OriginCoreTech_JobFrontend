import { NavLink } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useState } from "react";
import websiteLogo from "../../assets/WebsiteLogo.svg";
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
        <div className="relative flex items-center justify-between px-2 sm:px-3 md:px-4 py-1 w-full h-14" style={{ background: 'linear-gradient(90deg, #f5f6f7 60%, #ffe9b3 100%)' }}>
            {/* Logo */}
            <div className="flex items-center">
                <p className="text-base sm:text-lg md:text-xl font-bold">
                    <img src={websiteLogo} alt="Logo" className="w-8 h-8" />
                </p>
            </div>

            {/* Desktop Nav Tabs - absolutely centered */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-sm px-1 py-1 gap-1 z-10">
                <NavLink
                    to="/Feed"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                            : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
                    }
                >Feed</NavLink>
                <NavLink
                    to="/all-jobs"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                            : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
                    }
                >Jobs</NavLink>
                <NavLink
                    to="/ai-prediction"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                            : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
                    }
                >AI Prediction</NavLink>
            </div>

            {/* Search Bar and Right Icons */}
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                {/* Desktop Search Bar */}
                <div className="hidden md:flex bg-white items-center rounded-full px-2 md:px-3 py-1.5 w-[180px] lg:w-[250px] xl:w-[300px] shadow-inner">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-xs md:text-sm"
                    />
                    <FaSearch className="text-[#00194A] text-sm md:text-base" />
                </div>

                {/* Mobile Search Icon */}
                <div className="md:hidden bg-white cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow" onClick={toggleSearch}>
                    <FaSearch className="text-[#00194A] text-sm md:text-base" />
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                    {/* Desktop Icons */}
                    <div className="hidden md:flex items-center gap-1.5 md:gap-2 lg:gap-3">
                        <div className="bg-white cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow">
                            <FiMessageCircle className="text-[#00194A] text-sm md:text-base" />
                        </div>
                        <div className="bg-white cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow">
                            <FaBell className="text-[#00194A] text-sm md:text-base" />
                        </div>
                        <div className="bg-white cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow">
                            <FaUser className="text-[#00194A] text-sm md:text-base" />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden bg-white cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? (
                            <FaTimes className="text-[#00194A] text-sm md:text-base" />
                        ) : (
                            <FaBars className="text-[#00194A] text-sm md:text-base" />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Expandable */}
            {isSearchExpanded && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-2 md:p-3 z-20 md:hidden">
                    <div className="flex items-center rounded-full px-2 md:px-3 py-1.5 border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-xs md:text-sm"
                            autoFocus
                        />
                        <FaSearch className="text-[#00194A] text-sm md:text-base" />
                    </div>
                </div>
            )}

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 md:hidden">
                    <div className="flex flex-col p-2 md:p-3 space-y-2 md:space-y-3">
                        {/* Mobile Nav Links */}
                        <div className="flex flex-col space-y-1.5 md:space-y-2">
                            <NavLink
                                to="/Feed"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                                        : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >Feed</NavLink>
                            <NavLink
                                to="/all-jobs"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                                        : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >Jobs</NavLink>
                            <NavLink
                                to="/ai-prediction"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                                        : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >AI Prediction</NavLink>
                        </div>

                        {/* Mobile Action Icons */}
                        <div className="flex items-center justify-around pt-2 md:pt-3 border-t border-gray-200">
                            <div className="bg-gray-100 cursor-pointer rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                                <FiMessageCircle className="text-[#00194A] text-sm md:text-base" />
                            </div>
                            <div className="bg-gray-100 cursor-pointer rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                                <FaBell className="text-[#00194A] text-sm md:text-base" />
                            </div>
                            <div className="bg-gray-100 cursor-pointer rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                                <FaUser className="text-[#00194A] text-sm md:text-base" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
