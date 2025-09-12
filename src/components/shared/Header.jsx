import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useState } from "react";
import websiteLogo from "../../assets/WebsiteLogo.svg";
import { useSelector } from "react-redux";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded);
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.user_role?.toLowerCase(); 

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between w-full px-2 py-1 bg-white shadow-sm sm:px-3 md:px-4 h-14"
      style={{
        background: "linear-gradient(90deg, #f5f6f7 60%, #ffe9b3 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <p className="text-base font-bold sm:text-lg md:text-xl">
          <img src={websiteLogo} alt="Logo" className="w-8 h-8" />
        </p>
      </div>

      {/* Desktop Nav Tabs - centered */}
      <div className="absolute z-10 hidden gap-1 px-1 py-1 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-sm lg:flex left-1/2 top-1/2">
        {/* Always shown */}
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            isActive
              ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
              : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
          }
        >
          Feed
        </NavLink>

        {/* Shown for student, company, university */}
        {(userRole === "student" ||
          userRole === "company" ||
          userRole === "university") && (
          <NavLink
            to="/all-jobs"
            className={({ isActive }) =>
              isActive
                ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
            }
          >
            Jobs
          </NavLink>
        )}

        {/* Shown for student, company, university */}
        {userRole === "student" && (
          <NavLink
            to="/ai-prediction"
            className={({ isActive }) =>
              isActive
                ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
            }
          >
            AI Prediction
          </NavLink>
        )}

        {/* Company only */}
        {userRole === "company" && (
          <NavLink
            to="/recruiter-post-job-intern-details"
            className={({ isActive }) =>
              isActive
                ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
            }
          >
            Post Job
          </NavLink>
        )}

        {/* University only */}
        {userRole === "university" && (
          <NavLink
            to="/student-analytics"
            className={({ isActive }) =>
              isActive
                ? "bg-[#00194A] text-white rounded-full px-2 md:px-3 lg:px-4 py-1.5 font-medium shadow text-xs md:text-sm"
                : "text-[#00194A] px-2 md:px-3 lg:px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 text-xs md:text-sm"
            }
          >
            Analytics
          </NavLink>
        )}
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
        <div
          className="flex items-center justify-center bg-white rounded-full shadow cursor-pointer md:hidden w-7 h-7 md:w-8 md:h-8"
          onClick={toggleSearch}
        >
          <FaSearch className="text-[#00194A] text-sm md:text-base" />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
          {/* Desktop Icons (now clickable) */}
          <div className="hidden md:flex items-center gap-1.5 md:gap-2 lg:gap-3">
            {/* Always shown */}
            <div
              onClick={() =>
                navigate(
                  userRole === "student"
                    ? "/feed-ticket"
                    : userRole === "company"
                    ? "/recruiter-ticket"
                    : userRole === "university"
                    ? "/university-ticket"
                    : "/feed-ticket" // fallback to student profile
                )
              }
              className="flex items-center justify-center transition bg-white rounded-full shadow cursor-pointer w-7 h-7 md:w-8 md:h-8 hover:bg-gray-100 active:bg-gray-200"
            >
              <FiMessageCircle className="text-[#00194A] text-sm md:text-base" />
            </div>

            <div
              onClick={() => navigate("/feed-notifications")}
              className="flex items-center justify-center transition bg-white rounded-full shadow cursor-pointer w-7 h-7 md:w-8 md:h-8 hover:bg-gray-100 active:bg-gray-200"
            >
              <FaBell className="text-[#00194A] text-sm md:text-base" />
            </div>

            <div
              onClick={() =>
                navigate(
                  userRole === "student"
                    ? "/feed-profile"
                    : userRole === "company"
                    ? "/recruiter-dashboard"
                    : userRole === "university"
                    ? "/university-profile"
                    : "/feed-profile" // fallback to student profile
                )
              }
              className="flex items-center justify-center transition bg-white rounded-full shadow cursor-pointer w-7 h-7 md:w-8 md:h-8 hover:bg-gray-100 active:bg-gray-200"
            >
              <FaUser className="text-[#00194A] text-sm md:text-base" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div
            className="flex items-center justify-center bg-white rounded-full shadow cursor-pointer md:hidden w-7 h-7 md:w-8 md:h-8"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-[#00194A] text-sm md:text-base" />
            ) : (
              <FaBars className="text-[#00194A] text-sm md:text-base" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchExpanded && (
        <div className="absolute left-0 right-0 z-50 p-2 bg-white shadow-lg top-full md:p-3 md:hidden">
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
        <div className="absolute left-0 right-0 z-50 bg-white shadow-lg top-full md:hidden">
          <div className="flex flex-col p-2 space-y-2 md:p-3 md:space-y-3">
            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1.5 md:space-y-2">
              {/* Always shown */}
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                    : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feed
              </NavLink>

              {/* Shown for student, company, university */}
              {(userRole === "student" ||
                userRole === "company" ||
                userRole === "university") && (
                <NavLink
                  to="/all-jobs"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                      : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </NavLink>
              )}

              {userRole === "student" && (
                <NavLink
                  to="/ai-prediction"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                      : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Prediction
                </NavLink>
              )}

              {/* Company only */}
              {userRole === "company" && (
                <NavLink
                  to="/recruiter-post-job-intern-details"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                      : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Post Job
                </NavLink>
              )}

              {/* University only */}
              {userRole === "university" && (
                <NavLink
                  to="/student-analytics"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#00194A] text-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm"
                      : "text-[#00194A] px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium hover:bg-gray-100 text-xs md:text-sm"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Analytics
                </NavLink>
              )}
            </div>

            {/* Mobile Action Icons */}
            <div className="flex items-center justify-around pt-2 border-t border-gray-200 md:pt-3">
              {/* Always shown */}
              <div
                onClick={() =>
                  navigate(
                    userRole === "student"
                      ? "/feed-ticket"
                      : userRole === "company"
                      ? "/recruiter-ticket"
                      : userRole === "university"
                      ? "/university-ticket"
                      : "/feed-ticket" // fallback to student profile
                  )
                }
                className="flex items-center justify-center w-8 h-8 transition bg-gray-100 rounded-full cursor-pointer md:w-10 md:h-10 hover:bg-gray-200 active:bg-gray-300"
              >
                <FiMessageCircle className="text-[#00194A] text-sm md:text-base" />
              </div>

              <div
                onClick={() => navigate("/feed-notifications")}
                className="flex items-center justify-center w-8 h-8 transition bg-gray-100 rounded-full cursor-pointer md:w-10 md:h-10 hover:bg-gray-200 active:bg-gray-300"
              >
                <FaBell className="text-[#00194A] text-sm md:text-base" />
              </div>

              <div
                onClick={() =>
                  navigate(
                    userRole === "student"
                      ? "/feed-profile"
                      : userRole === "company"
                      ? "/recruiter-dashboard"
                      : userRole === "university"
                      ? "/university-profile"
                      : "/feed-profile" // fallback to student profile
                  )
                }
                className="flex items-center justify-center w-8 h-8 transition bg-gray-100 rounded-full cursor-pointer md:w-10 md:h-10 hover:bg-gray-200 active:bg-gray-300"
              >
                <FaUser className="text-[#00194A] text-sm md:text-base" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};