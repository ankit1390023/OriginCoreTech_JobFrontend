import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { HiOutlineEye } from 'react-icons/hi';
import RecruiterRightSide3 from './RecruiterRightSide3';   
import MainLayout from '../../../components/layout/MainLayout';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/feature/authSlice';


const  RecruiterProfile = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const profileOptions = [
    {
      id: 'profile',
      icon: <User size={20} />,
      title: 'My Profile',
      subtitle: 'Make changes to your profile',
      hasChevron: true,
      action: () => navigate('/feed-my-profile'),
    },
    {
      id: 'applications',
      icon: <FileText size={20} />,
      title: 'My Applications',
      subtitle: 'Manage your applications',
      hasChevron: true,
      action: () => navigate('/feed-application'),
    },
    {
      id: 'terms',
      icon: <Shield size={20} />,
      title: 'Terms & Conditions',
      hasChevron: true,
      action: () => navigate('/feed-terms'),
    },
    {
      id: 'help',
      icon: <HelpCircle size={20} />,
      title: 'Help & Support',
      hasChevron: true,
      action: () => navigate('/feed-faq'),
      // no navigate here → handled by toggleDropdown
    },
    {
      id: 'manage',
      icon: <Settings size={20} />,
      title: 'Manage Account',
      hasChevron: true,
      // no navigate here → handled by toggleDropdown
    },
    {
      id: 'notifications',
      icon: <Bell size={20} />,
      title: 'Notifications',
      hasChevron: true,
      action: () => navigate('/feed-notifications'),
    },
    {
      id: 'logout',
      icon: <LogOut size={20} />,
      title: 'Log out',
      subtitle: 'Further secure your account for safety',
      hasChevron: true,
      action: () => {
        dispatch(logout());
        navigate('/login');
      },
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow "></div>
        <section className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto p-3 sm:p-4 md:p-5 lg:p-6 rounded-[5px] bg-white flex flex-col shadow-lg gap-3 sm:gap-4 mt-2 mx-auto">
          {/* Profile Header */}
          <div className="bg-[#002B6B] text-white p-3 sm:p-4 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-[5px] gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <img
                src="https://i.pravatar.cc/100?img=1"
                alt="avatar"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-md object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate">Aman Gupta</h1>
                <p className="text-xs sm:text-sm text-gray-200 truncate">@amangupta09</p>
                <p className="text-xs sm:text-sm text-gray-200 truncate">Visual Designer</p>
              </div>
            </div>
            <button
              className="border border-white rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-[#002B6B] transition-colors flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto whitespace-nowrap min-h-[44px] sm:min-h-[40px]"
              onClick={() => navigate('/feed-my-profile')}
            >
              <HiOutlineEye size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Profile</span>
              <span className="xs:hidden">View</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="p-3 sm:p-4 lg:p-6 max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-180px)] lg:max-h-[calc(100vh-200px)] overflow-y-auto space-y-1 sm:space-y-2">
            {profileOptions.map((option) => (
              <div key={option.id}>
                <button
                  onClick={() => {
                    if (option.id === 'manage') {
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
                      <span className="text-sm sm:text-base md:text-medium lg:text-medium text-gray-900 font-medium">
                        {option.title}
                      </span>
                      {option.subtitle && (
                        <span className="text-xs sm:text-sm md:text-base text-gray-400">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {option.hasChevron && (
                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0 ml-2 sm:ml-3" />
                  )}
                </button>

                {/* Dropdowns */}
                {activeDropdown === option.id && (
                    <div className="ml-10 sm:ml-12 md:ml-14 lg:ml-16 mt-1 sm:mt-2 space-y-1 sm:space-y-2">
                      {(activeDropdown === 'help'
                        ? [
                            {
                              icon: <Settings size={16} />,
                              label: 'Raise a ticket',
                              action: () => navigate('/feed-ticket'),
                            },
                            {
                              icon: <Settings size={16} />,
                              label: 'Chat with us!',
                              action: () => navigate('/feed-help'),
                            },
                          ]
                        : [
                            {
                              icon: <Mail size={16} />,
                              label: 'Change email',
                              action: () => navigate('/feed-change-email'),
                            },
                            {
                              icon: <Lock size={16} />,
                              label: 'Change password',
                              action: () => navigate('/feed-change-password'),
                            },
                            {
                              icon: <Trash2 size={16} />,
                              label: 'Delete my account',
                              action: () => console.log('Delete account'),
                            },
                          ]
                      ).map((item, i) => (
                        <button
                          key={i}
                          onClick={item.action}
                          className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[48px] sm:min-h-[52px]"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                              {item.icon}
                            </div>
                          </div>
                          <span className="text-sm sm:text-base md:text-lg text-gray-900 font-medium truncate">
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
          <RecruiterRightSide3 />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default RecruiterProfile;
