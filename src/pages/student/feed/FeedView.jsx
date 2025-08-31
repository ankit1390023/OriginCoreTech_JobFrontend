// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaCamera } from 'react-icons/fa';
// import MainLayout from '../../../components/layout/MainLayout';
// import FeedRightProfile from '../feed/FeedRightProfile';
// import uploadImageApi from '../../../api/uploadImageApi';

// const FeedView = () => {
//   const navigate = useNavigate();
//   const [profileImage, setProfileImage] = useState('/src/assets/dummyProfile1.jpg');
//   const [activeSection, setActiveSection] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [resumeUrl, setResumeUrl] = useState(null);

//   // ✅ Upload Profile Image
//   const handleProfileImageUpload = () => {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = 'image/*';
//     fileInput.style.display = 'none';

//     fileInput.onchange = async (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         if (!file.type.startsWith('image/')) {
//           setUploadStatus({ type: 'error', message: 'Please select an image file' });
//           return;
//         }
//         if (file.size > 5 * 1024 * 1024) { // 5MB limit
//           setUploadStatus({ type: 'error', message: 'Image size should be less than 5MB' });
//           return;
//         }

//         setIsUploading(true);
//         setUploadStatus(null);

//         try {
//           const token = localStorage.getItem('token'); // get auth token
//           const uploadedUrl = await uploadImageApi.uploadImage(file, 'profile', token);

//           if (uploadedUrl) {
//             setProfileImage(uploadedUrl); // set new profile image from server
//             setUploadStatus({ type: 'success', message: 'Profile picture updated!' });
//           } else {
//             setUploadStatus({ type: 'error', message: 'Failed to upload profile picture' });
//           }
//         } catch (error) {
//           console.error('Error uploading profile picture:', error);
//           setUploadStatus({
//             type: 'error',
//             message: error.response?.data?.message || 'Upload failed. Please try again.',
//           });
//         } finally {
//           setIsUploading(false);
//         }
//       }
//     };

//     fileInput.click();
//   };

//   // ✅ Upload Resume (kept as before)
//   const handleUploadResume = () => {
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

//         if (file.size > 10 * 1024 * 1024) {
//           setUploadStatus({ type: 'error', message: 'File size should be less than 10MB' });
//           return;
//         }

//         setIsUploading(true);
//         setUploadStatus(null);

//         try {
//           const token = localStorage.getItem('token');
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
//             message: error.response?.data?.message || 'Failed to upload resume. Please try again.',
//           });
//         } finally {
//           setIsUploading(false);
//         }
//       }
//     };

//     fileInput.click();
//   };

//   const handleViewEdit = (section) => {
//     if (section === 'Skills') {
//       navigate('/feed-your-skills');
//     } else if (section === 'Work Experience') {
//       navigate('/feed-your-exprience');
//     } else if (section === 'Education') {
//       navigate('/feed-your-education');
//     } else {
//       setActiveSection(activeSection === section ? null : section);
//     }
//   };

//   const handleGetVerified = () => {
//     console.log('Get Verified clicked');
//   };

// // Function to render specific section content
// const renderSectionContent = (section) => {
//   switch (section) {
//     case 'About':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <p className="text-gray-700 leading-relaxed">
//             Hi, I am Aman working as a designer from 3 years...
//           </p>
//         </div>
//       );
    
//     case 'Career Objective':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <p className="text-gray-700 leading-relaxed">
//             lorem ipsum
//           </p>
//         </div>
//       );
    
//     case 'Resume':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           {resumeUrl ? (
//             <div className="flex items-center gap-2">
//               <a 
//                 href={resumeUrl} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-sm text-green-600 hover:text-green-800 transition-colors"
//               >
//                 View Resume
//               </a>
//               <button 
//                 className="text-sm text-blue-600 hover:text-blue-800 transition-colors" 
//                 onClick={handleUploadResume}
//               >
//                 Replace
//               </button>
//             </div>
//           ) : (
//             <button 
//               className="text-sm text-blue-600 hover:text-blue-800 transition-colors" 
//               onClick={handleUploadResume}
//               disabled={isUploading}
//             >
//               {isUploading ? 'Uploading...' : 'Upload Resume'}
//             </button>
//           )}
//           {uploadStatus && (
//             <div className={`text-xs mt-2 ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//               {uploadStatus.message}
//             </div>
//           )}
//         </div>
//       );
    
//     case 'Skills':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <div className="flex flex-wrap gap-2">
//             {['Digital Marketing', 'Sales', 'UI Design', 'SEO'].map((skill, idx) => (
//               <div key={idx} className="flex items-center">
//                 <span className="text-gray-700">{skill}</span>
//                 {idx < 3 && <span className="text-red-500 mx-2">•</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       );
    
//     case 'Work Experience':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <div className="flex flex-wrap gap-2">
//             {['Microsoft', 'Startup', 'Google'].map((company, idx) => (
//               <div key={idx} className="flex items-center">
//                 <span className="text-gray-700">{company}</span>
//                 {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       );
    
//     case 'Education':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <div className="flex flex-wrap gap-2">
//             {['abc', 'abc', 'abc'].map((edu, idx) => (
//               <div key={idx} className="flex items-center">
//                 <span className="text-gray-700">{edu}</span>
//                 {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       );
    
//     case 'Languages':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <div className="flex flex-wrap gap-2">
//             {['English', 'Hindi', 'Spanish'].map((lang, idx) => (
//               <div key={idx} className="flex items-center">
//                 <span className="text-gray-700">{lang}</span>
//                 {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       );
    
//     case 'Authentication':
//       return (
//         <div className="border border-gray-200 rounded-lg p-4 mt-3">
//           <div className="flex items-center justify-between">
//             <div className="flex flex-wrap gap-2">
//               {['Email ID', 'Phone no.', 'Aadhaar'].map((auth, idx) => (
//                 <div key={idx} className="flex items-center">
//                   <span className="text-gray-700">{auth}</span>
//                   {idx < 2 && <span className="text-red-500 mx-2">•</span>}
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors" onClick={handleGetVerified}>
//                 Get Verified
//               </button>
//               <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-xs text-gray-600 font-bold">i</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
    
//     default:
//       return null;
//   }
// };

//   return ( 
//     <MainLayout>
//       <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
//         <div className="hidden lg:block flex-grow"></div>

//         {/* Feed Content */}
//         <section className="bg-white rounded-[10px] p-4 sm:p-6 shadow-lg relative overflow-hidden mx-auto mt-2 w-full max-w-[729px] min-h-[1000px]">
//           {/* Profile Section */}
//           <div className="flex flex-col items-center mb-8">
//             <div className="relative">
//               <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200">
//                 <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
//               </div>
//               {/* Camera Icon */}
            
//                 <FaCamera 
//                 onClick={handleProfileImageUpload}
//                 disabled={isUploading}
//                 className="w-3 h-3 absolute text-blue-600 rounded-full shadow-md flex items-center justify-center"
//                 style={{
//                   width: '20px',
//                   height: '20px',
//                   top: '5px',
//                   left: '70px',
//                 }}
//               />
   
           
//             </div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">Aman Gupta</h1>
//             <p className="text-gray-500 text-sm">@amangupta09</p>
//           </div>

//           {/* Show upload status (for both profile & resume) */}
//           {uploadStatus && (
//             <div className={`text-center text-sm mb-4 ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//               {uploadStatus.message}
//             </div>
//           )}

//           {/* Information Sections (same as your mapping) */}
//           <div className="space-y-6">
//             {[
//               'About',
//               'Career Objective',
//               'Resume',
//               'Skills',
//               'Work Experience',
//               'Education',
//               'Languages',
//               'Authentication',
//             ].map((section, index) => (
//               <div key={index}>
//                 <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 mb-2">
//                       {section === 'Languages' ? 'Languages you know' : section}
//                     </h3>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {section === 'Resume' ? (
//                       <div className="flex flex-col items-end gap-2">
//                         {resumeUrl ? (
//                           <div className="flex items-center gap-2">
//                             <a
//                               href={resumeUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-sm text-green-600 hover:text-green-800 transition-colors"
//                             >
//                               View Resume
//                             </a>
//                             <button
//                               className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
//                               onClick={handleUploadResume}
//                               disabled={isUploading}
//                             >
//                               Replace
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
//                             onClick={handleUploadResume}
//                             disabled={isUploading}
//                           >
//                             {isUploading ? 'Uploading...' : 'Upload Resume'}
//                           </button>
//                         )}
//                       </div>
//                     ) : section === 'Authentication' ? (
//                       <>
//                         <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors" onClick={handleGetVerified}>
//                           Get Verified
//                         </button>
//                         <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
//                           <span className="text-xs text-gray-600 font-bold">i</span>
//                         </div>
//                       </>
//                     ) : (
//                       <button
//                         className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
//                         onClick={() => handleViewEdit(section)}
//                       >
//                         {activeSection === section ? 'Close' : 'View/Edit'}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {activeSection === section && renderSectionContent(section)}
//               </div>
//             ))}
//           </div>
//         </section>

//         <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
//           <FeedRightProfile />
//         </aside>

//         <div className="hidden lg:block flex-grow"></div>
//       </div>
//     </MainLayout>
//   );
// };

// export default FeedView;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightProfile from "../feed/FeedRightProfile";
import uploadImageApi from "../../../api/uploadImageApi";

const FeedView = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    "/src/assets/dummyProfile1.jpg"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  // ✅ Upload Profile Image
  const handleProfileImageUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setUploadStatus({
            type: "error",
            message: "Please select an image file",
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setUploadStatus({
            type: "error",
            message: "Image size should be less than 5MB",
          });
          return;
        }

        setIsUploading(true);
        setUploadStatus(null);

        try {
          const token = localStorage.getItem("token");
          const uploadedUrl = await uploadImageApi.uploadImage(
            file,
            "profile",
            token
          );

          if (uploadedUrl) {
            setProfileImage(uploadedUrl);
            setUploadStatus({
              type: "success",
              message: "Profile picture updated!",
            });
          } else {
            setUploadStatus({
              type: "error",
              message: "Failed to upload profile picture",
            });
          }
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          setUploadStatus({
            type: "error",
            message:
              error.response?.data?.message ||
              "Upload failed. Please try again.",
          });
        } finally {
          setIsUploading(false);
        }
      }
    };

    fileInput.click();
  };

  // ✅ Upload Resume
  const handleUploadResume = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.style.display = "none";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.type !== "application/pdf") {
          setUploadStatus({
            type: "error",
            message: "Please select a PDF file",
          });
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          setUploadStatus({
            type: "error",
            message: "File size should be less than 10MB",
          });
          return;
        }

        setIsUploading(true);
        setUploadStatus(null);

        try {
          const token = localStorage.getItem("token");
          const uploadedUrl = await uploadImageApi.uploadImage(
            file,
            "resume",
            token
          );

          if (uploadedUrl) {
            setResumeUrl(uploadedUrl);
            setUploadStatus({
              type: "success",
              message: "Resume uploaded successfully!",
            });
          } else {
            setUploadStatus({
              type: "error",
              message: "Failed to upload resume",
            });
          }
        } catch (error) {
          console.error("Error uploading resume:", error);
          setUploadStatus({
            type: "error",
            message:
              error.response?.data?.message ||
              "Failed to upload resume. Please try again.",
          });
        } finally {
          setIsUploading(false);
        }
      }
    };

    fileInput.click();
  };

  // Navigation for sections
  const handleEditSection = (section) => {
    if (section === "Skills") navigate("/feed-your-skills");
    if (section === "Work Experience") navigate("/feed-your-exprience");
    if (section === "Education") navigate("/feed-your-education");
  };

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        <div className="hidden lg:block flex-grow"></div>

        {/* Feed Content */}
        <section className="bg-white rounded-[10px] p-4 sm:p-6 shadow-lg relative overflow-hidden mx-auto mt-2 w-full max-w-[729px] min-h-[1000px]">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <FaCamera
                onClick={handleProfileImageUpload}
                disabled={isUploading}
                className="w-3 h-3 absolute text-blue-600 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                style={{
                  width: "20px",
                  height: "20px",
                  top: "5px",
                  left: "70px",
                }}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
              Aman Gupta
            </h1>
            <p className="text-gray-500 text-sm">@amangupta09</p>
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div
              className={`text-center text-sm mb-4 ${
                uploadStatus.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {uploadStatus.message}
            </div>
          )}

          {/* Static Information Sections like UniversityView */}
          <div className="space-y-6">
            {/* About */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">About</h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => console.log("Edit About")}
                >
                  View/Edit
                </button>
              </div>
              <p className="text-gray-700 text-sm">
                Hi, I am Aman working as a designer from 3 years...
              </p>
            </div>

            {/* Career Objective */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">
                  Career Objective
                </h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => console.log("Edit Career Objective")}
                >
                  View/Edit
                </button>
              </div>
              <p className="text-gray-700 text-sm">lorem ipsum</p>
            </div>

            {/* Resume */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Resume</h3>
                {resumeUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                      View Resume
                    </a>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={handleUploadResume}
                      disabled={isUploading}
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={handleUploadResume}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Resume"}
                  </button>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Skills</h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => handleEditSection("Skills")}
                >
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Digital Marketing
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Sales
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  UI Design
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  SEO
                </span>
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">
                  Work Experience
                </h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => handleEditSection("Work Experience")}
                >
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Microsoft
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Startup
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Google
                </span>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Education</h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => handleEditSection("Education")}
                >
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  abc
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  abc
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  abc
                </span>
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">
                  Languages you know
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  English
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Hindi
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Spanish
                </span>
              </div>
            </div>

            {/* Authentication */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">
                  Authentication
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => console.log("Get Verified clicked")}
                  >
                    Get Verified
                  </button>
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-bold">i</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span>Email ID</span>
                <span>Phone no.</span>
                <span>Aadhaar</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightProfile />
        </aside>

        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FeedView;

