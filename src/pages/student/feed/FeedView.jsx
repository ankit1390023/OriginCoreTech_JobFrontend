import React, { useState } from 'react';
import { Link } from '../../../components/ui';
import { FaCamera } from 'react-icons/fa';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';

const FeedView = () => {
  const [profileImage, setProfileImage] = useState('/src/assets/dummyProfile1.jpg');
  const [activeSection, setActiveSection] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewEdit = (section) => {
    setActiveSection(section);
    setShowContent(true);
  };

  const handleCloseContent = () => {
    setShowContent(false);
    setActiveSection(null);
  };

  const handleUploadResume = () => {
    console.log('Upload Resume clicked');
  };

  const handleGetVerified = () => {
    console.log('Get Verified clicked');
  };

  return (
    <MainLayout>
       <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>
                {/* Feed Content */}
    
    <section
      className="bg-white rounded-[10px] p-4 sm:p-6 shadow-lg relative overflow-hidden mx-auto mt-2  w-full max-w-[729px] min-h-[1000px]"
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {/* Camera Icon */}
          <div
            className="absolute bg-[#3D5CFF] border border-[#3D5CFF] rounded-full shadow-md flex items-center justify-center"
            style={{
              width: '20px',
              height: '20px',
              top: '5px',
              left: '70px',
            }}
          >
            <FaCamera className="w-3 h-3 text-white" />
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">Aman Gupta</h1>
        <p className="text-gray-500 text-sm">@amangupta09</p>
      </div>

      {/* Information Sections */}
      <div className="space-y-6">
        {[
          'About',
          'Career Objective',
          'Resume',
          'Skills',
          'Work Experience',
          'Education',
          'Languages',
          'Authentication'
        ].map((section, index) => (
          <div key={index} className="flex justify-between items-start flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{section === 'Languages' ? 'Languages you know' : section}</h3>
            </div>
            <div className="flex items-center gap-2">
              {section === 'Resume' ? (
                <Link to="#" variant="secondary" className="text-sm" onClick={handleUploadResume}>
                  Upload Resume
                </Link>
              ) : section === 'Authentication' ? (
                <>
                  <Link to="#" variant="secondary" className="text-sm" onClick={handleGetVerified}>
                    Get Verified
                  </Link>
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-bold">i</span>
                  </div>
                </>
              ) : (
                <Link to="#" variant="secondary" className="text-sm" onClick={() => handleViewEdit(section)}>
                  View/Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      {showContent && (
        <div className="absolute inset-0 bg-white z-10 p-4 sm:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{activeSection}</h2>
            <button onClick={handleCloseContent} className="text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            {activeSection === 'About' && (
              <p className="text-gray-700 leading-relaxed">
                Hi, I am Aman working as a designer from 3 years...
              </p>
            )}

            {activeSection === 'Career Objective' && (
              <p className="text-gray-700 leading-relaxed">
                To secure a challenging position in a reputable organization...
              </p>
            )}

            {activeSection === 'Skills' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Technical Skills:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Digital Marketing', desc: 'SEO, SEM, Social Media Marketing' },
                    { title: 'Sales', desc: 'B2B Sales, Customer Relationship' },
                    { title: 'UI Design', desc: 'Figma, Adobe XD, Sketch' },
                    { title: 'SEO', desc: 'On-page, Off-page, Technical SEO' }
                  ].map((skill, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-800">{skill.title}</span>
                      <p className="text-sm text-gray-600 mt-1">{skill.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'Work Experience' && (
              <div className="space-y-4">
                {[
                  { org: 'Microsoft', role: 'Senior Designer • 2021 - Present', desc: 'Led design initiatives...' },
                  { org: 'Startup', role: 'Product Designer • 2019 - 2021', desc: 'Designed and launched...' },
                  { org: 'Google', role: 'UX Designer • 2017 - 2019', desc: 'Contributed to Google\'s design system...' }
                ].map((job, idx) => (
                  <div key={idx} className="border-l-4 pl-4 border-blue-500">
                    <h3 className="font-semibold text-gray-900">{job.org}</h3>
                    <p className="text-sm text-gray-600">{job.role}</p>
                    <p className="text-gray-700 mt-2">{job.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'Education' && (
              <div className="space-y-4">
                {[
                  { title: 'Bachelor of Design', place: 'NID • 2013 - 2017' },
                  { title: 'Master of Fine Arts', place: 'Parsons • 2017 - 2019' },
                  { title: 'UX Certification', place: 'Google • 2020' }
                ].map((edu, idx) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{edu.title}</h3>
                    <p className="text-sm text-gray-600">{edu.place}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'Languages' && (
              <div className="space-y-3">
                {[
                  { lang: 'English', level: 'Native' },
                  { lang: 'Hindi', level: 'Fluent' },
                  { lang: 'Spanish', level: 'Intermediate' }
                ].map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{lang.lang}</span>
                    <span className="text-sm text-gray-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>

{/* Profile Card */}
<aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightProfile />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
    </div>
    </MainLayout>
  );
};

export default FeedView;
