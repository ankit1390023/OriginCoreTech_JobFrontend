import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  User,
  FileText,
  Bell,
  Settings,
  LogOut,
  Mail,
  Lock,
  Trash2,
  HelpCircle,
  Shield,
} from "lucide-react";
import { HiOutlineEye } from "react-icons/hi";
import UniversityRightSide1 from "./UniversityRightSide1";
import MainLayout from "../../../components/layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/feature/authSlice";
import feedApi from "../../../api/feedApi";

const UniversityProfile = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [universityDetail, setUniversityDetail] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  useEffect(() => {
    const userData = async () => {
      try {
        if (user?.id) {
          const res = await feedApi.GetUserData(user, token);
          setUniversityDetail(res.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    userData();
  }, [user,token]);

  // ✅ Delete Account handler
  const handleDeleteAccount = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete your account?"))
        return;
      const response = await feedApi.softDeleteAccount(
        {
          user_id: user.id,
        },
        token
      );

      if (response) {
        alert("Account deleted successfully!");
        dispatch(logout());
        navigate("/login");
      } else {
        alert(response?.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Failed to delete account", error);
      throw error;
    }
  };

  const profileOptions = [
    {
      id: "profile",
      icon: <User size={20} />,
      title: "My Profile",
      subtitle: "Make changes to your profile",
      hasChevron: true,
      action: () => navigate("/university-view"),
    },
    {
      id: "activity",
      icon: <FileText size={20} />,
      title: "Activity Feed",
      subtitle: "Your recent activity",
      hasChevron: true,
      action: () => navigate("/university-view"),
    },
    {
      id: "terms",
      icon: <Bell size={20} />,
      title: "Terms & Conditions",
      hasChevron: true,
      action: () => navigate("/feed-terms"),
    },
    {
      id: "Permission",
      icon: <Shield size={20} />,
      title: "Terms & Permission",
      hasChevron: true,
      action: () => navigate("/feed-terms"),
    },
    {
      id: "help",
      icon: <HelpCircle size={20} />,
      title: "Help & Support",
      hasChevron: true,
      action: () => toggleDropdown("help"),
    },
    {
      id: "manage",
      icon: <Settings size={20} />,
      title: "Manage Account",
      hasChevron: true,
      action: () => toggleDropdown("manage"),
    },
    {
      id: "logout",
      icon: <LogOut size={20} />,
      title: "Log out",
      subtitle: "Further secure your account for safety",
      hasChevron: true,
      action: () => {
        dispatch(logout());
        navigate("/login");
      },
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block "></div>

        {/* Profile Section */}
        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
          {/* Profile Header */}
          <div className="bg-[#002B6B] text-white p-3 sm:p-4 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-[5px] gap-3 sm:gap-4">
            <div className="flex items-center flex-1 min-w-0 gap-3 sm:gap-4">
              <img
                src={
                  universityDetail?.profile_pic || "https://i.pravatar.cc/100"
                }
                alt="avatar"
                className="flex-shrink-0 object-cover w-12 h-12 rounded-full sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-semibold truncate sm:text-lg md:text-xl lg:text-2xl">
                  {universityDetail?.college_name || "Unknown University"}
                </h1>
                <p className="text-xs text-gray-200 truncate sm:text-sm">
                  @{user?.email}
                </p>
                <p className="text-xs text-gray-200 truncate sm:text-sm">
                  {user?.user_role}
                </p>
              </div>
            </div>
            <button
              className="border border-white rounded-full bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-[#002B6B] transition-colors flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto whitespace-nowrap min-h-[44px] sm:min-h-[40px]"
              onClick={() => navigate("/feed-my-profile")}
            >
              <HiOutlineEye size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Profile</span>
              <span className="xs:hidden">View</span>
            </button>
          </div>

          {/* Main Options */}
          <div className="p-3 sm:p-4 lg:p-6 max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-180px)] lg:max-h-[calc(100vh-200px)] overflow-y-auto space-y-1 sm:space-y-2">
            {profileOptions.map((option) => (
              <div key={option.id}>
                <button
                  onClick={option.action}
                  className="w-full flex items-center justify-between p-3 sm:p-4 md:p-5 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 min-h-[60px] sm:min-h-[64px] md:min-h-[72px]"
                >
                  <div className="flex items-center w-[641px] h-[40px] gap-[15px] opacity-100">
                    <div className="w-[40px] h-[40px] bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                      {option.icon}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-gray-900 sm:text-base">
                        {option.title}
                      </span>
                      {option.subtitle && (
                        <span className="text-xs text-gray-400 sm:text-sm">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {option.hasChevron && (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </button>

                {/* Dropdowns */}
                {activeDropdown === option.id && (
                  <div className="mt-2 ml-10 space-y-2 sm:ml-12">
                    {(option.id === "help"
                      ? [
                          {
                            icon: <Settings size={16} />,
                            label: "Raise a ticket",
                            action: () => navigate("/university-ticket"),
                          },
                          {
                            icon: <Settings size={16} />,
                            label: "Chat with us!",
                            action: () => navigate("/university-faq"),
                          },
                        ]
                      : [
                          {
                            icon: <Mail size={16} />,
                            label: "Change email",
                            action: () => navigate("/university-change-email"),
                          },
                          {
                            icon: <Lock size={16} />,
                            label: "Change password",
                            action: () => navigate("/university-change-password"),
                          },
                          {
                            icon: <Trash2 size={16} />,
                            label: "Delete my account",
                            action: handleDeleteAccount,
                          },
                        ]
                    ).map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className="flex items-center w-full gap-3 p-3 transition-colors rounded-lg sm:p-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <div className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-100 rounded-full">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-900 sm:text-base">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right Side */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <UniversityRightSide1 />
        </aside>

        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default UniversityProfile;