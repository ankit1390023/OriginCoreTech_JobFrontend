import React, { useState, useEffect } from "react";
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
import FeedRightProfile from "../feed/FeedRightProfile";
import MainLayout from "../../../components/layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/feature/authSlice";
import softDeleteAccount from "../../../api/feedApi";
import { userDetailsApi } from "../../../api/userDetailsApi";
import { getImageUrl } from "../../../../utils.js";

const Feedprofile = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Assuming you store token and user in Redux
  const { token, user } = useSelector((state) => state.auth);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  const[loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await userDetailsApi.getMiniUserDetails(user.id, token);
        console.log(result);
        if (result.success) {
          setProfile(result.data.user); // Updated to match API response structure
        } else {
          setError(result.message || "Failed to fetch user details.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch user details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [token, user]);

  // ✅ Delete Account handler
  const handleDeleteAccount = async () => {
    try {
      // confirmation prompt
      if (!window.confirm("Are you sure you want to delete your account?")) {
        return;
      }

      // ✅ Call API correctly
      const response = await softDeleteAccount({ user_Id: user._id }, token);

      if (response?.success) {
        // ✅ After delete → log out user
        dispatch(logout());
        navigate("/login");
      } else {
        alert(response?.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Failed to delete account", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting account."
      );
    }
  };

  const profileOptions = [
    {
      id: "profile",
      icon: <User size={20} />,
      title: "My Profile",
      subtitle: "Make changes to your profile",
      hasChevron: true,
      action: () => navigate("/feed-view"),
    },
    {
      id: "applications",
      icon: <FileText size={20} />,
      title: "My Applications",
      subtitle: "Manage your applications",
      hasChevron: true,
      action: () => navigate("/feed-application"),
    },
    {
      id: "terms",
      icon: <Shield size={20} />,
      title: "Terms & Conditions",
      hasChevron: true,
      action: () => navigate("/feed-terms"),
    },
    {
      id: "help",
      icon: <HelpCircle size={20} />,
      title: "Help & Support",
      hasChevron: true,
      action: () => navigate("/feed-faq"),
    },
    {
      id: "manage",
      icon: <Settings size={20} />,
      title: "Manage Account",
      hasChevron: true,
    },
    {
      id: "notifications",
      icon: <Bell size={20} />,
      title: "Notifications",
      hasChevron: true,
      action: () => navigate("/application-mynotification"),
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

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
          <div className="flex-grow hidden lg:block"></div>
          <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
            <div className="bg-[#002B6B] text-white p-3 sm:p-4 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-[5px] gap-3 sm:gap-4">
              <div className="flex items-center flex-1 min-w-0 gap-3 sm:gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-5 mb-2 bg-gray-200 rounded sm:h-6 animate-pulse"></div>
                  <div className="h-4 mb-1 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="p-3 space-y-3 sm:p-4 lg:p-6">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </section>
          <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
            <div className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>
          </aside>
          <div className="flex-grow hidden lg:block"></div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
          <div className="flex-grow hidden lg:block"></div>
          <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
            <div
              className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </section>
          <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
            <FeedRightProfile />
          </aside>
          <div className="flex-grow hidden lg:block"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block"></div>
        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
          {/* Profile Header */}
          <div className="bg-[#002B6B] text-white p-3 sm:p-4 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-[5px] gap-3 sm:gap-4">
            <div className="flex items-center flex-1 min-w-0 gap-3 sm:gap-4">
              <img
                src={
                  profile.user_profile_pic? getImageUrl(profile.user_profile_pic) : "https://i.pravatar.cc/100?img=1"
                }
                alt="avatar"
                className="flex-shrink-0 object-cover w-12 h-12 rounded-md sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-semibold truncate sm:text-lg md:text-xl lg:text-2xl">
                  {profile
                    ? `${profile.first_name} ${profile.last_name}`
                    : "Loading..."}
                </h1>
                <p className="text-xs text-gray-200 truncate sm:text-sm">
                  {/* @{profile?.first_name.toLowerCase()}
                  {profile?.last_name.toLowerCase()} */}
                  {profile.email}
                </p>
                <p className="text-xs text-gray-200 truncate sm:text-sm">
                  {profile?.user_role === "STUDENT"
                    ? "Student"
                    : "Recruiter"}
                </p>
              </div>
            </div>
            <button
              className="border border-white rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-[#002B6B] transition-colors flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto whitespace-nowrap min-h-[44px] sm:min-h-[40px]"
              onClick={() => navigate("/feed-my-profile")}
            >
              <HiOutlineEye size={14} className="sm:w-4 sm:h-4" />
              <span>Profile</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="p-3 sm:p-4 lg:p-6 max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-180px)] lg:max-h-[calc(100vh-200px)] overflow-y-auto space-y-1 sm:space-y-2">
            {profileOptions.map((option) => (
              <div key={option.id}>
                <button
                  onClick={() => {
                    if (option.id === "manage") {
                      toggleDropdown(option.id);
                    } else {
                      option.action?.();
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-4 md:p-5 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 min-h-[60px] sm:min-h-[64px] md:min-h-[72px]"
                >
                  <div className="flex items-center w-[641px] h-[40px] gap-[15px] opacity-100">
                    <div className="w-[40px] h-[40px] opacity-100 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="text-gray-600 w-[40px] h-[40px] flex items-center justify-center opacity-100">
                        {option.icon}
                      </div>
                    </div>
                    <div className="flex flex-col w-auto text-left opacity-100">
                      <span className="text-sm font-medium text-gray-900 sm:text-base md:text-medium lg:text-medium">
                        {option.title}
                      </span>
                      {option.subtitle && (
                        <span className="text-xs text-gray-400 sm:text-sm md:text-base">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {option.hasChevron && (
                    <ChevronRight
                      size={18}
                      className="flex-shrink-0 ml-2 text-gray-400 sm:ml-3"
                    />
                  )}
                </button>

                {/* Dropdowns */}
                {activeDropdown === option.id && (
                  <div className="mt-1 ml-10 space-y-1 sm:ml-12 md:ml-14 lg:ml-16 sm:mt-2 sm:space-y-2">
                    {(option.id === "help"
                      ? [
                          {
                            icon: <Settings size={16} />,
                            label: "Raise a ticket",
                            action: () => navigate("/feed-ticket"),
                          },
                          {
                            icon: <Settings size={16} />,
                            label: "Chat with us!",
                            action: () => navigate("/feed-help"),
                          },
                        ]
                      : [
                          {
                            icon: <Mail size={16} />,
                            label: "Change email",
                            action: () => navigate("/feed-change-email"),
                          },
                          {
                            icon: <Lock size={16} />,
                            label: "Change password",
                            action: () => navigate("/feed-change-password"),
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
                        className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[48px] sm:min-h-[52px]"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-600 bg-gray-100 rounded-full sm:w-10 sm:h-10">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">
                            {item.icon}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate sm:text-base md:text-lg">
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

        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightProfile />
        </aside>
        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default Feedprofile;
