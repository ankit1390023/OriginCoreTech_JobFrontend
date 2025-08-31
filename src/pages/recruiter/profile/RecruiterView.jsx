
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaCamera } from 'react-icons/fa';
// import MainLayout from '../../../components/layout/MainLayout';
// import RecruiterRightSide3 from './RecruiterRightSide3';
// import uploadImageApi from '../../../api/uploadImageApi';

// const RecruiterView = () => {
//   const navigate = useNavigate();
//   const [profileImage, setProfileImage] = useState('/src/assets/dummyProfile1.jpg');
//   const [activeSection, setActiveSection] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [resumeUrl, setResumeUrl] = useState(null);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setProfileImage(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleViewEdit = (section) => {
//     if (section === 'Skills') {
//       navigate('/feed-your-skills');
//     } else if (section === 'Work Experience') {
//       navigate('/feed-your-exprience');
//     } else if (section === 'Education') {
//       navigate('/feed-your-education');
//     } else {
//       // Toggle the section - if it's already active, close it; otherwise, open it
//       setActiveSection(activeSection === section ? null : section);
//     }
//   };

//   const handleUploadResume = () => {
//     // Create a hidden file input
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = '.pdf';
//     fileInput.style.display = 'none';
    
//     fileInput.onchange = async (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         if (file.type !== 'application/pdf') {
//           setUploadStatus({ type: 'error', message: 'Please select a PDF file' });
//           return;
//         }
        
//         if (file.size > 10 * 1024 * 1024) { // 10MB limit
//           setUploadStatus({ type: 'error', message: 'File size should be less than 10MB' });
//           return;
//         }

//         setIsUploading(true);
//         setUploadStatus(null);
        
//         try {
//           // Get token from localStorage or your auth state
//           const token = localStorage.getItem('token'); // Adjust based on your auth implementation
          
//           const uploadedUrl = await uploadImageApi.uploadImage(file, 'resume', token);
          
//           if (uploadedUrl) {
//             setResumeUrl(uploadedUrl);
//             setUploadStatus({ type: 'success', message: 'Resume uploaded successfully!' });
//           } else {
//             setUploadStatus({ type: 'error', message: 'Failed to upload resume' });
//           }
//         } catch (error) {
//           console.error('Error uploading resume:', error);
//           setUploadStatus({ 
//             type: 'error', 
//             message: error.response?.data?.message || 'Failed to upload resume. Please try again.' 
//           });
//         } finally {
//           setIsUploading(false);
//         }
//       }
//     };
    
//     fileInput.click();
//   };
  

//   const handleGetVerified = () => {
//     console.log('Get Verified clicked');
//   };

//   // Function to render specific section content
//   const renderSectionContent = (section) => {
//     switch (section) {
//       case 'About':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <p className="text-gray-700 leading-relaxed">
//               Hi, I am Aman working as a designer from 3 years...
//             </p>
//           </div>
//         );
      
//       case 'Career Objective':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <p className="text-gray-700 leading-relaxed">
//               lorem ipsum
//             </p>
//           </div>
//         );
      
//       case 'Resume':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             {resumeUrl ? (
//               <div className="flex items-center gap-2">
//                 <a 
//                   href={resumeUrl} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-sm text-green-600 hover:text-green-800 transition-colors"
//                 >
//                   View Resume
//                 </a>
//                 <button 
//                   className="text-sm text-blue-600 hover:text-blue-800 transition-colors" 
//                   onClick={handleUploadResume}
//                 >
//                   Replace
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 className="text-sm text-blue-600 hover:text-blue-800 transition-colors" 
//                 onClick={handleUploadResume}
//                 disabled={isUploading}
//               >
//                 {isUploading ? 'Uploading...' : 'Upload Resume'}
//               </button>
//             )}
//             {uploadStatus && (
//               <div className={`text-xs mt-2 ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//                 {uploadStatus.message}
//               </div>
//             )}
//           </div>
//         );
      
//       case 'Skills':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <div className="flex flex-wrap gap-2">
//               {['Digital Marketing', 'Sales', 'UI Design', 'SEO'].map((skill, idx) => (
//                 <div key={idx} className="flex items-center">
//                   <span className="text-gray-700">{skill}</span>
//                   {idx < 3 && <span className="text-red-500 mx-2">•</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'Work Experience':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <div className="flex flex-wrap gap-2">
//               {['Microsoft', 'Startup', 'Google'].map((company, idx) => (
//                 <div key={idx} className="flex items-center">
//                   <span className="text-gray-700">{company}</span>
//                   {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'Education':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <div className="flex flex-wrap gap-2">
//               {['abc', 'abc', 'abc'].map((edu, idx) => (
//                 <div key={idx} className="flex items-center">
//                   <span className="text-gray-700">{edu}</span>
//                   {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'Languages':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <div className="flex flex-wrap gap-2">
//               {['English', 'Hindi', 'Spanish'].map((lang, idx) => (
//                 <div key={idx} className="flex items-center">
//                   <span className="text-gray-700">{lang}</span>
//                   {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'Authentication':
//         return (
//           <div className="border border-gray-200 rounded-lg p-4 mt-3">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-wrap gap-2">
//                 {['Email ID', 'Phone no.', 'Aadhaar'].map((auth, idx) => (
//                   <div key={idx} className="flex items-center">
//                     <span className="text-gray-700">{auth}</span>
//                     {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors" onClick={handleGetVerified}>
//                   Get Verified
//                 </button>
//                 <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
//                   <span className="text-xs text-gray-600 font-bold">i</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <MainLayout>
//        <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
//         {/* Left Spacer */}
//         <div className="hidden lg:block flex-grow"></div>
//                 {/* Feed Content */}
    
//     <section
//       className="bg-white rounded-[10px] p-4 sm:p-6 shadow-lg relative overflow-hidden mx-auto mt-2  w-full max-w-[729px] min-h-[1000px]"
//     >
//       {/* Profile Section */}
//       <div className="flex flex-col items-center mb-8">
//         <div className="relative">
//           <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200">
//             <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
//           </div>
//           {/* Camera Icon */}
//           <div
//             className="absolute bg-[#3D5CFF] border border-[#3D5CFF] rounded-full shadow-md flex items-center justify-center"
//             style={{
//               width: '20px',
//               height: '20px',
//               top: '5px',
//               left: '70px',
//             }}
//           >
//             <FaCamera className="w-3 h-3 text-white" />
//           </div>
//         </div>
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">Aman Gupta</h1>
//         <p className="text-gray-500 text-sm">@amangupta09</p>
//       </div>

//       {/* Information Sections */}
//       <div className="space-y-6">
//         {[
//           'About',
//           'Career Objective',
//           'Resume',
//           'Skills',
//           'Work Experience',
//           'Education',
//           'Languages',
//           'Authentication'
//         ].map((section, index) => (
//           <div key={index}>
//             <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
//               <div className="flex-1">
//                 <h3 className="font-semibold text-gray-900 mb-2">{section === 'Languages' ? 'Languages you know' : section}</h3>
//               </div>

//               <div className="flex items-center gap-2">
//                 {section === 'Resume' ? (
//                   <div className="flex flex-col items-end gap-2">
//                     {resumeUrl ? (
//                       <div className="flex items-center gap-2">
//                         <a 
//                           href={resumeUrl} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="text-sm text-green-600 hover:text-green-800 transition-colors"
//                         >
//                           View Resume
//                         </a>
//                         <button 
//                           className="text-sm text-blue-600 hover:text-blue-800 transition-colors" 
//                           onClick={handleUploadResume}
//                         >
//                           Replace
//                         </button>
//                       </div>
//                     ) : (
//                       <button 
//                         className="text-sm text-blue-600 hover:text-blue-800 transition-colors" 
//                         onClick={handleUploadResume}
//                         disabled={isUploading}
//                       >
//                         {isUploading ? 'Uploading...' : 'Upload Resume'}
//                       </button>
//                     )}
//                     {uploadStatus && (
//                       <div className={`text-xs ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//                         {uploadStatus.message}
//                       </div>
//                     )}
//                   </div>
//                 ) : section === 'Authentication' ? (
//                   <>
//                     <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors" onClick={handleGetVerified}>
//                       Get Verified
//                     </button>
//                     <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
//                       <span className="text-xs text-gray-600 font-bold">i</span>
//                     </div>
//                   </>
//                 ) : (
//                   <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors" onClick={() => handleViewEdit(section)}>
//                     {activeSection === section ? 'Close' : 'View/Edit'}
//                   </button>
//                 )}    
//               </div>
//             </div>
            
//             {/* Show section content inline if active */}
//             {activeSection === section && renderSectionContent(section)}
//           </div>
//         ))}
//       </div>
//     </section>

// {/* Profile Card */}
// <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
//           <RecruiterRightSide3 />
//         </aside>
//         {/* Right Spacer */}
//         <div className="hidden lg:block flex-grow"></div>
//     </div>
//     </MainLayout>
//   );
// };

// export default RecruiterView;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightSide3 from './RecruiterRightSide3';
import { useSelector } from "react-redux";
import axios from "axios";

const UniversityView = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    "/src/assets/dummyProfile1.jpg"
  );
  const [universityDetail, setUniversityDetail] = useState(null);

  const { user, token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const userData = async () => {
      try {
        if (user?.id) {
          const res = await axios.get(
           `${BASE_URL}/university/detail/${user.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUniversityDetail(res.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    userData();
  }, [user]);

  console.log(universityDetail);

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

  const handleEditSection = (section) => {
    // Navigate to edit pages based on section
    if (section === "About") {
      navigate("/edit-about");
    } else if (section === "Contact Information") {
      navigate("/edit-contact");
    } else if (section === "Courses Offered") {
      navigate("/edit-courses");
    } else if (section === "Social Media") {
      navigate("/edit-social-media");
    }
  };

  const handleGetVerified = () => {
    console.log("Get Verified clicked");
    // Add verification logic here
  };

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>

        {/* Main Content */}
        <section className="bg-white rounded-[10px] p-4 sm:p-6 shadow-lg relative overflow-hidden mx-auto mt-2 w-full max-w-[729px] min-h-[1000px]">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200">
                <img
                  src={universityDetail?.profile_pic || profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Camera Icon */}
              <label htmlFor="profile-upload" className="cursor-pointer">
                <div
                  className="absolute bg-[#3D5CFF] border border-[#3D5CFF] rounded-full shadow-md flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    top: "5px",
                    left: "70px",
                  }}
                >
                  <FaCamera className="w-3 h-3 text-white" />
                </div>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
              {universityDetail?.college_name || "University Name"}
            </h1>
            <p className="text-gray-500 text-sm">
              @{universityDetail?.email_id || "email"}
            </p>
          </div>

          {/* Information Sections */}
          <div className="space-y-6">
            {/* About Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">About</h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => handleEditSection("About")}
                >
                  View/Edit
                </button>
              </div>
              <div className="text-gray-700 text-sm leading-relaxed">
                {universityDetail?.about ||
                  "82 years of Tradition of excellence in Engineering.."}
              </div>
            </div>


            {/* Contact Information Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">
                  Contact Information
                </h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => handleEditSection("Contact Information")}
                >
                  Edit Info
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{universityDetail?.phone || "+91 xxxxxxxxxx"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>
                    {universityDetail?.email_id || "college@gmail.com"}
                  </span>
                </div>
              </div>
            </div>

            {/* Hiring Preferences Section */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-900">Hiring Preferences</h3>
    <button
      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      onClick={() => handleEditSection("Hiring Preferences")}
    >
      Edit/Add
    </button>
  </div>
  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <span>Design</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      <span>Tech</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
      <span>Sales</span>
    </div>
  </div>
</div>

{/* Access & Permissions Section */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-900">Access & Permissions</h3>
    <button
      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      onClick={() => handleEditSection("Access & Permissions")}
    >
      Edit/Add
    </button>
  </div>
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span>Admin</span>
  </div>
</div>

{/* Languages You Know Section */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-900">Languages you know</h3>
    <button
      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      onClick={() => handleEditSection("Languages")}
    >
      Edit/Add
    </button>
  </div>
  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <span>English</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <span>Hindi</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <span>Spanish</span>
    </div>
  </div>
</div>
 


            {/* Authentication Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Authentication</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={handleGetVerified}
                  >
                    Get Verified
                  </button>
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-xs text-gray-600 font-bold">i</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      universityDetail?.email_id_verified
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span>Email ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      universityDetail?.phone
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span>Phone no.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      universityDetail?.adhar_verified
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span>Aadhaar</span>
                </div>
              </div>
            </div>
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

export default UniversityView;