import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightProfile from "../feed/FeedRightProfile";
import { useSelector } from "react-redux";
import uploadImageApi from "../../../api/uploadImageApi";
import { userDetailsApi } from "../../../api/userDetailsApi";
import { updateProfileLocally } from '../../../redux/feature/profileSlice';
import { useDispatch } from 'react-redux';
import { getImageUrl } from "../../../../utils.js";


const FeedView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("/src/assets/dummyProfile1.jpg");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!token || !user) return;
      setLoading(true);
      setError(null);
      try {
        const result = await userDetailsApi.getUserPublicProfile(user.id);
        if (result.success) {
          setUserData(result.data);
          // Set profile image if available
          if (result.data.publicProfile.user_profile_pic) {
            setProfileImage(result.data.publicProfile.user_profile_pic);
          }
          // Set resume if available
          if (result.data.publicProfile.resume) {
            setResumeUrl(result.data.publicProfile.resume);
          }
          console.log("User profile data:", result.data);
        } else {
          setError(result.error || "Failed to fetch user details.");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [token, user]);

  // Function to start editing a field
  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  // Function to save edited field
  const saveEdit = async (field) => {
    if (!editValue.trim()) return;
    
    // Authentication check
    if (!isAuthenticated || !token) {
      setUploadStatus({
        type: 'error',
        message: "User not authenticated. Please login to continue."
      });
      return;
    }

    // Ensure user ID exists
    if (!user?.id) {
      setUploadStatus({
        type: 'error',
        message: "User ID not found."
      });
      return;
    }

    setIsSaving(true);
    try {
      let userDataPayload = {};
      
      // Map field names to backend field names
      switch (field) {
        case 'name':
          const nameParts = editValue.split(' ');
          userDataPayload = {
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || ''
          };
          break;
        case 'about_us':
          userDataPayload = { about_us: editValue };
          break;
        case 'career_objective':
          userDataPayload = { career_objective: editValue };
          break;
        case 'language':
          userDataPayload = { language: editValue };
          break;
        default:
          userDataPayload = { [field]: editValue };
      }

      console.log("Saving user data:", userDataPayload);

      // Call the API to update user details
      const result = await userDetailsApi.updateUserDetails(user.id, userDataPayload, token);

      console.log("Update response:", result);
      
      if (result.success || result.message) {
        // Update local state with new data
        if (field === "name") {
          const nameParts = editValue.split(" ");
          setUserData((prev) => ({
            ...prev,
            publicProfile: {
              ...prev.publicProfile,
              first_name: nameParts[0] || "",
              last_name: nameParts.slice(1).join(" ") || "",
            },
          }));
        } else {
          setUserData((prev) => ({
            ...prev,
            publicProfile: {
              ...prev.publicProfile,
              [field]: editValue,
            },
          }));
        }

        //  UPDATE REDUX PROFILE SLICE → Sidebar will auto-update!
        dispatch(
          updateProfileLocally({
            ...userDataPayload,
          })
        );

        setEditingField(null);
        setEditValue("");
        setUploadStatus({
          type: "success",
          message: "Information updated successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to update information");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      setUploadStatus({
        type: 'error',
        message: error.message || "Failed to update information. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  //  Upload Profile Image - Fixed to properly handle URLs
const handleProfileImageUpload = async () => {
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
        // First upload the image file to get URL
        const uploadedUrl = await uploadImageApi.uploadImage(
          file,
          "profile",
          token
        );

        console.log("Uploaded image URL:", uploadedUrl);

        if (uploadedUrl) {
          // Then update user profile with the returned URL
          if (user?.id && token) {
            const userDataPayload = { user_profile_pic: uploadedUrl };
            const result = await userDetailsApi.updateUserDetails(user.id, userDataPayload, token);
            
            console.log("Profile update API response:", result);
            
            if (result.message == "User details updated successfully.") {
              // Update both local state and profileImage state
              //for re render
              const imageUrlWithCacheBust = `${uploadedUrl}?t=${Date.now()}`;
              setProfileImage(imageUrlWithCacheBust);
              setUserData(prev => ({
                ...prev,
                publicProfile: {
                  ...prev.publicProfile,
                  user_profile_pic: uploadedUrl
                }
              }));
              dispatch(updateProfileLocally({ user_profile_pic: uploadedUrl }));
              setUploadStatus({
                type: "success",
                message: "Profile picture updated successfully!",
              });
            } else {
              throw new Error(result.message || "Failed to save profile picture URL");
            }
          }
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
          message: error.message || "Upload failed. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  fileInput.click();
};

//  Upload Resume - Fixed to properly handle URLs
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
        // First upload the resume file to get URL
        const uploadedUrl = await uploadImageApi.uploadImage(
          file,
          "resume",
          token
        );

        console.log("Uploaded resume URL:", uploadedUrl);

        if (uploadedUrl) {
          // Then update user data with the returned URL
          if (user?.id && token) {
            const userDataPayload = { resume: uploadedUrl };
            const result = await userDetailsApi.updateUserDetails(user.id, userDataPayload, token);
            
            console.log("Resume update API response:", result);
            
            if (result.message == "User details fetched successfully") {
              // Update both local state and resumeUrl state
              const resumeUrlWithCacheBust = `${uploadedUrl}?t=${Date.now()}`;
              setResumeUrl(resumeUrlWithCacheBust);
        
              setUserData(prev => ({
                ...prev,
                publicProfile: {
                  ...prev.publicProfile,
                  resume: uploadedUrl
                }
              }));
              setUploadStatus({
                type: "success",
                message: "Resume uploaded successfully!",
              });
            } else {
              throw new Error(result.message || "Failed to save resume URL");
            }
          }
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
          message: error.message || "Failed to upload resume. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  fileInput.click();
};

// Add this helper function inside your FeedView component
const getFileNameFromUrl = (url) => {
  if (!url) return 'resume.pdf';
  
  try {
    // Handle full URLs
    if (url.includes('://')) {
      const urlObj = new URL(url);
      let fileName = urlObj.pathname.split('/').pop();
      fileName = fileName.split('?')[0]; // Remove query params
      fileName = fileName.split('#')[0]; // Remove fragments
      return decodeURIComponent(fileName) || 'resume.pdf';
    }
    
    // Handle relative URLs
    let fileName = url.split('/').pop();
    fileName = fileName.split('?')[0];
    fileName = fileName.split('#')[0];
    return decodeURIComponent(fileName) || 'resume.pdf';
  } catch (error) {
    // Fallback for any parsing errors
    const lastSegment = url.split('/').pop().split('?')[0];
    return lastSegment || 'resume.pdf';
  }
};




  // Navigation for sections
  const handleEditSection = (section) => {
    if (section === "Skills") navigate("/feed-your-skills");
    if (section === "Work Experience") navigate("/feed-your-experience");
    if (section === "Education") {
      navigate("/feed-your-education", { state: { profile: userData } });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <p>Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        <div className="flex-grow hidden lg:block"></div>

        {/* Feed Content */}
        <section className="bg-white rounded-[10px] p-4 sm:p-6 shadow-lg relative overflow-hidden mx-auto mt-2 w-full max-w-[729px] min-h-[1000px]">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 overflow-hidden border-4 border-gray-200 rounded-full sm:w-24 sm:h-24">
                <img
                  src={getImageUrl(profileImage)}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <FaCamera
                onClick={handleProfileImageUpload}
                disabled={isUploading}
                className="absolute flex items-center justify-center w-3 h-3 text-blue-600 rounded-full shadow-md cursor-pointer"
                style={{
                  width: "20px",
                  height: "20px",
                  top: "5px",
                  left: "70px",
                }}
              />
            </div>
            
            {userData && (
              <>
                {editingField === 'name' ? (
                  <div className="flex flex-col items-center mt-4">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="text-xl font-bold text-center text-gray-900 border-b border-gray-300 sm:text-2xl"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-sm text-green-600"
                        onClick={() => saveEdit('name')}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="text-sm text-gray-600"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <h1 
                      className="mt-4 text-xl font-bold text-gray-900 cursor-pointer sm:text-2xl hover:text-blue-600"
                      onClick={() => startEditing('name', `${userData.publicProfile.first_name} ${userData.publicProfile.last_name}`)}
                    >
                      {userData.publicProfile.first_name} {userData.publicProfile.last_name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      @{userData.publicProfile.email?.split('@')[0] || 'user'}
                    </p>
                  </div>
                )}
              </>
            )}
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">About</h3>
                {editingField === 'about_us' ? (
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-green-600 transition-colors hover:text-green-800"
                      onClick={() => saveEdit('about_us')}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="text-sm text-gray-600 transition-colors hover:text-gray-800"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                    onClick={() => startEditing('about_us', userData?.publicProfile.about_us)}
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {editingField === 'about_us' ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {userData?.publicProfile.about_us || "No information provided"}
                </p>
              )}
            </div>

            {/* Career Objective */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Career Objective</h3>
                {editingField === 'career_objective' ? (
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-green-600 transition-colors hover:text-green-800"
                      onClick={() => saveEdit('career_objective')}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="text-sm text-gray-600 transition-colors hover:text-gray-800"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                    onClick={() => startEditing('career_objective', userData?.publicProfile.career_objective)}
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {editingField === 'career_objective' ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                  rows="2"
                  placeholder="Your career objective..."
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {userData?.publicProfile.career_objective || "No objective provided"}
                </p>
              )}
            </div>

            {/* Resume */}
            {/* Resume */}
<div>
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-semibold text-gray-900">Resume</h3>
    {resumeUrl ? (
      <div className="flex items-center gap-3">
        {/* Display resume file name */}
        <div className="flex items-center gap-1 text-sm">
          <svg className="flex-shrink-0 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-gray-600 truncate max-w-[120px]" title={getFileNameFromUrl(resumeUrl)}>
            {getFileNameFromUrl(resumeUrl)}
          </span>
        </div>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-600 transition-colors hover:text-green-800"
          onClick={(e) => e.stopPropagation()}
        >
          View
        </a>
        <button
          className="text-sm text-blue-600 transition-colors hover:text-blue-800"
          onClick={handleUploadResume}
          disabled={isUploading}
        >
          Replace
        </button>
      </div>
    ) : (
      <button
        className="text-sm text-blue-600 transition-colors hover:text-blue-800"
        onClick={handleUploadResume}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Resume"}
      </button>
    )}
  </div>
  
  {/* Show resume status */}
  {resumeUrl && (
    <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Resume ready to view
    </div>
  )}
</div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Skills</h3>
                <button
                  className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                  onClick={() => handleEditSection("Skills")}
                >
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                {userData?.skills && userData.skills.length > 0 ? (
                  userData.skills.flatMap((skillDomain, domainIndex) => 
                    skillDomain.subSkills?.map((skill, skillIndex) => (
                      <span key={`${domainIndex}-${skillIndex}`} className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {skill}
                      </span>
                    )) || []
                  )
                ) : (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Work Experience</h3>
                <button
                  className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                  onClick={() => handleEditSection("Work Experience")}
                >
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                {userData?.experiences && userData.experiences.length > 0 ? (
                  userData.experiences.map((exp, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {exp.company_name || exp.companyRecruiterProfile?.name || "Experience " + (index + 1)}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No work experience added yet</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Education</h3>
                <button
                  className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                  onClick={() => handleEditSection("Education")}
                >
                  View/Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                {userData?.educations && userData.educations.length > 0 ? (
                  userData.educations.map((edu, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <span className={`w-2 h-2 ${edu.education_certificate ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></span>
                      {edu.schoolCollegeEducations?.name || edu.educationCourse?.name || "Education " + (index + 1)}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No education details added yet</p>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Languages you know</h3>
                {editingField === 'language' ? (
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-green-600 transition-colors hover:text-green-800"
                      onClick={() => saveEdit('language')}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="text-sm text-gray-600 transition-colors hover:text-gray-800"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                    onClick={() => startEditing('language', userData?.publicProfile.language)}
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {editingField === 'language' ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded"
                  placeholder="English, Hindi, Spanish"
                />
              ) : (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  {userData?.publicProfile.language ? (
                    userData.publicProfile.language.split(',').map((lang, index) => (
                      <span key={index} className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {lang.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No languages specified</p>
                  )}
                </div>
              )}
            </div>

            {/* Authentication */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Authentication</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                    onClick={() => console.log("Get Verified clicked")}
                  >
                    Get Verified
                  </button>
                  <div className="flex items-center justify-center w-4 h-4 bg-gray-300 rounded-full">
                    <span className="text-xs font-bold text-gray-600">i</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className={userData?.publicProfile.is_email_verified ? "text-green-600" : "text-gray-500"}>
                  Email ID {userData?.publicProfile.is_email_verified ? "(Verified)" : "(Not Verified)"}
                </span>
                <span className={userData?.publicProfile.is_phone_verified ? "text-green-600" : "text-gray-500"}>
                  Phone no. {userData?.publicProfile.is_phone_verified ? "(Verified)" : "(Not Verified)"}
                </span>
                <span className={userData?.publicProfile.is_aadhaar_verified ? "text-green-600" : "text-gray-500"}>
                  Aadhaar {userData?.publicProfile.is_aadhaar_verified ? "(Verified)" : "(Not Verified)"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightProfile />
        </aside>

        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default FeedView;