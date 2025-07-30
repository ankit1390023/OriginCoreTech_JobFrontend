import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../../components/ui';
import {  FaEllipsisH } from 'react-icons/fa';
import { FiHeart, FiMessageSquare, FiSend } from 'react-icons/fi';
import { BsBookmarkFill } from 'react-icons/bs';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';
import feedApi from '../../../api/feedApi'; 
import { userDetailsApi } from '../../../api/userDetailsApi';

const FeedMyProfile = () => {
  const [showAllWorkExperience, setShowAllWorkExperience] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);  
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  // New state for user activity
  const [userActivity, setUserActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [activityPage, setActivityPage] = useState(1);
  const [hasMoreActivity, setHasMoreActivity] = useState(true);
  
  // New state for dynamic data
  const [workExperiences, setWorkExperiences] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  
  const {user, token } = useSelector((state) => state.auth);

// Fetch user public profile using userId from redux
useEffect(() => {
  async function fetchUserProfile() {
      setLoading(true);
      setError(null);
      try {
          const userId = user?.id;
          console.log("userId",userId);
          if (!userId) {
              setError('User ID not found');
              setLoading(false);
              return;
          }
          
          const result = await userDetailsApi.getUserDetails(userId);
          console.log("result from fetchUserProfile", result);
          
          if (result.success && result.data) {
              // Set the complete profile data
              setProfile(result.data.publicProfile);
              
              // Set activity data
              if (result.data.activity && Array.isArray(result.data.activity)) {
                  const formattedActivity = result.data.activity.map((activity, index) => ({
                      id: activity._id || index + 1,
                      content: activity.caption || "",
                      image: activity.image,
                      likeCount: activity.likeCount || 0,
                      commentCount: activity.commentCount || 0,
                      createdAt: activity.createdAt,
                      user: {
                          firstName: result.data.publicProfile?.firstName || "User",
                          lastName: result.data.publicProfile?.lastName || "",
                          profileImage: result.data.publicProfile?.profileImage || "/src/assets/profile1.png",
                          userType: result.data.publicProfile?.userType || "User"
                      }
                  }));
                  setUserActivity(formattedActivity);
              }
              
              // Set experiences data
              if (result.data.experiences && Array.isArray(result.data.experiences)) {
                   const formattedExperiences = result.data.experiences.map((exp, index) => ({
                       id: index + 1,
                       logo: "/src/assets/WebsiteLogo.svg", // Default logo
                       company: exp.currentCompany || "Unknown Company",
                       position: exp.currentJobRole || "Unknown Position",
                       duration: `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`,
                       timeSpan: calculateTimeSpan(exp.startDate, exp.endDate),
                       description: `Worked as ${exp.currentJobRole || "employee"} at ${exp.currentCompany || "company"}. Status: ${exp.status || "unknown"}`,
                       status: exp.status
                   }));
                   setWorkExperiences(formattedExperiences);
               }
              
              // Set education data
              if (result.data.educations && Array.isArray(result.data.educations)) {
                  const formattedEducation = result.data.educations.map((edu, index) => ({
                      id: edu.id || index + 1,
                      logo: "/src/assets/collegelogo.png", // Default logo
                      institution: edu.schoolOrCollege || "Unknown Institution",
                      degree: `${edu.level || "Education"}${edu.course ? `, ${edu.course}` : ""}${edu.specialization ? ` - ${edu.specialization}` : ""}`,
                      duration: `${edu.startYear || "N/A"} - ${edu.endYear || "N/A"}`,
                      description: `Studied at ${edu.schoolOrCollege || "institution"} under ${edu.boardOrUniversity || "board"}. ${edu.percentageOrCgpa ? `Achieved ${edu.percentageOrCgpa}%` : ""}`,
                      percentage: edu.percentageOrCgpa,
                      board: edu.boardOrUniversity
                  }));
                  setEducationData(formattedEducation);
              }
              
              // Set skills data
              if (result.data.skills && Array.isArray(result.data.skills)) {
                  const formattedSkills = result.data.skills.map((skill, index) => ({
                      id: index + 1,
                      logo: "/src/assets/collegelogo.png", // Default logo
                      skill: skill,
                      category: "Technical Skills",
                      description: `Proficient in ${skill} with practical experience and knowledge.`
                  }));
                  setSkillsData(formattedSkills);
              }
          } else {
              setError(result.error || 'Failed to fetch user details.');
              setProfile(null);
          }
      } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to fetch user details.');
          setProfile(null);
      } finally {
          setLoading(false);
      }
  }
  fetchUserProfile();
}, []);

useEffect(() => {
  async function checkStatus() {
    if (!token) return;
    try {
      const userId = localStorage.getItem('userId');
      if (userId && profile && profile._id && userId !== profile._id) {
        const res = await feedApi.checkFollowStatus(profile._id, token);
        setIsFollowing(res.isFollowing); // Adjust if API response shape differs
      }
    } catch (err) {
      setIsFollowing(false);
    }
  }
  if (profile && token) checkStatus();
}, [profile, token]);


  useEffect(() => {
      async function fetchFollowersAndFollowing() {
          if (!token) return;
          setLoading(true);
          setError(null);
          try {
              const { count: followersCount, followers } = await feedApi.getFollowers(token);
              setFollowers(followers);
              setFollowersCount(followersCount);

              const { count: followingCount, following } = await feedApi.getFollowing(token);
              setFollowing(following);
              setFollowingCount(followingCount);
          } catch (err) {
              setError('Failed to load followers/following');
          } finally {
              setLoading(false);
          }
      }
      if (token) {
          fetchFollowersAndFollowing();
      }
  }, [token]);


  const handleFollowToggle = async (profile,profile_id) => {
    if (!token || !profile || !profile_id) {
      console.log("profile",profile);
      console.log("profile_id",profile_id);
      console.error('Token, profile or profile ID not available');
      return;
    }
    
    setFollowLoading(true);
    try {
      await feedApi.followUnfollowUser(profile._id, token);
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => isFollowing ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Error toggling follow status:', err);
      // Optionally show error
    } finally {
      setFollowLoading(false);
    }
  };

  // Load more activity
  const loadMoreActivity = () => {
    if (!activityLoading && hasMoreActivity) {
      setActivityPage(prev => prev + 1);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days`;
    return `${Math.floor(diffInSeconds / 2592000)} months`;
  };

  // Format number with k/m suffix
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };


  const displayedExperiences = showAllWorkExperience ? workExperiences : workExperiences.slice(0, 1);

  const displayedEducation = showAllEducation ? educationData : educationData.slice(0, 1);

  const displayedSkills = showAllSkills ? skillsData : skillsData.slice(0, 1);

  // Utility function to format dates
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") return "Present";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Utility function to calculate time span
  const calculateTimeSpan = (startDate, endDate) => {
    if (!startDate || startDate === "0000-00-00") return "Duration not specified";
    
    try {
      const start = new Date(startDate);
      const end = endDate && endDate !== "0000-00-00" ? new Date(endDate) : new Date();
      
      const diffTime = Math.abs(end - start);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      
      if (diffYears > 0) {
        return `${diffYears} year${diffYears > 1 ? 's' : ''}${diffMonths > 0 ? ` ${diffMonths} month${diffMonths > 1 ? 's' : ''}` : ''}`;
      } else {
        return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
      }
    } catch (error) {
      return "Duration not specified";
    }
  };

  const displayedActivity = showAllActivity ? userActivity : userActivity.slice(0, 1);



  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow "></div>
        <section
          className="className=w-[729px] max-w-[800px] p-2 mt-2 mx-auto bg-white"
        >
          {/* Profile Header */}
          <div className="text-center space-y-4 mb-6">
            <div className="relative inline-block">
              <img
                src="/src/assets/dummyProfile1.jpg"
                alt="Aman Gupta"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
              />
            </div>

            <div>
            {loading ? (
                        <div>Loading profile...</div>
                    ) : error ? (
                        <div className="text-red-500 text-xs mt-1">{error}</div>
                    ) : profile ? (
                        <>
                            <h2 className="text-lg font-bold text-gray-800">{profile.firstName} {profile.lastName}</h2>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                            <p className="text-sm text-gray-700 font-semibold mt-1">{profile.userType}</p>
                            <p className="text-sm text-gray-600 mt-2">{profile.aboutus}</p>
                        </>
                    ) : null}
            </div>
            
            {/* Follow/Unfollow Button - hidden if viewing own profile */}
            {profile && localStorage.getItem('userId') !== profile._id && (
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                size="default"
                className={`px-8 ${isFollowing ? "bg-gray-500 text-black" : "bg-blue-500 text-white"} border-radius-md`}
                onClick={() => handleFollowToggle(profile,profile._id)}
                disabled={followLoading}
              >
                {followLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
            <p className="text-gray-400 font-medium text-sm leading-[140%] tracking-[-0.02em] max-w-md mx-auto">
              Hi, I am Aman working as a designer from 3 years. My skills include Adobe Photoshop,
              Illustrator, Premiere pro, After effects. I have worked..
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
            <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
                            {loading ? 'Loading...' : `${followersCount} followers`}
                        </button>
                        <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
                            {loading ? 'Loading...' : `${followingCount} following`}
                        </button>
            </div>
          </div>

          

          {/* Activity Section */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Activity</h2>
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6 text-gray-400">
            <p className="text-gray-600 text-sm mb-4">Your recent posts</p>
            
            {activityLoading && activityPage === 1 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading your activity...</div>
              </div>
            ) : activityError ? (
              <div className="text-center py-8">
                <div className="text-red-500">{activityError}</div>
              </div>
            ) : userActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No activity found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedActivity.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={activity.user?.profileImage || "/src/assets/profile1.png"} 
                        alt={activity.user?.firstName || "User"} 
                        className="w-10 h-10 rounded-full object-cover" 
                        onError={(e) => {
                          e.target.src = "/src/assets/profile1.png";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {activity.user?.firstName} {activity.user?.lastName}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(activity.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {activity.user?.userType || "User"}
                        </p>
                        <p className="text-gray-700 text-sm mt-2">
                          {activity.content}{' '}
                          {activity.content && activity.content.length > 100 && (
                            <span className="text-blue-500 cursor-pointer">see more...</span>
                          )}
                        </p>
                        {activity.image && (
                          <div className="mt-3">
                            <img 
                              src={activity.image} 
                              alt="Post content" 
                              className="w-full max-w-md rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {/* Action Bar */}
                        <div className="flex justify-between items-center py-2 px-4 mt-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiHeart className="w-5 h-5" />
                            <span className="font-medium text-base">
                              {formatNumber(activity.likeCount || 0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiMessageSquare className="w-5 h-5" />
                            <span className="font-medium text-base">
                              {formatNumber(activity.commentCount || 0)}
                            </span>
                          </div>
                          <FiSend className="w-5 h-5 text-gray-500" />
                          <BsBookmarkFill className="w-5 h-5" style={{ color: '#A259FF' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-4">
              {userActivity.length > 0 && (
                <>
                  <span
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {showAllActivity ? 'See less' : 'See more'}
                  </span>
                  
                  {showAllActivity && hasMoreActivity && (
                    <div className="mt-4">
                      <button
                        onClick={loadMoreActivity}
                        disabled={activityLoading}
                        className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {activityLoading ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading work experience...</div>
              </div>
            ) : workExperiences.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No work experience added yet</div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedExperiences.map((experience) => (
                    <div key={experience.id} className="bg-white border rounded-lg shadow-sm p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <img src={experience.logo} alt={experience.company} className="w-12 h-12 object-contain" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{experience.position}</h3>
                              <p className="text-gray-600">{experience.company}</p>
                            </div>
                            <FaEllipsisH className="text-gray-400 mt-2 sm:mt-0 cursor-pointer" />
                          </div>
                          <div className='items-start gap-3'>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-gray-500 text-sm">{experience.duration}</p>
                              <p className="text-gray-500 text-sm">{experience.timeSpan}</p>
                            </div>
                            <p className="text-gray-700 text-sm mt-2 leading-relaxed line-clamp-2">
                              {experience.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {workExperiences.length > 1 && (
                  <div className="text-center mt-4">
                    <span
                      onClick={() => setShowAllWorkExperience(!showAllWorkExperience)}
                      className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {showAllWorkExperience ? 'See less' : 'See more'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Education */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading education...</div>
              </div>
            ) : educationData.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No education details added yet</div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedEducation.map((education) => (
                    <div key={education.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <img src={education.logo} alt={education.institution} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{education.institution}</h3>
                              <p className="text-gray-600">{education.degree}</p>
                              <p className="text-gray-500 text-sm">{education.duration}</p>
                            </div>
                            <FaEllipsisH className="text-gray-400 mt-2 sm:mt-0 cursor-pointer" />
                          </div>
                          <p className="text-gray-700 text-sm mt-2 leading-relaxed line-clamp-2">
                            {education.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {educationData.length > 1 && (
                  <div className="text-center mt-4">
                    <span
                      onClick={() => setShowAllEducation(!showAllEducation)}
                      className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {showAllEducation ? 'See less' : 'See more'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Skills */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading skills...</div>
              </div>
            ) : skillsData.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No skills added yet</div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedSkills.map((skill) => (
                    <div key={skill.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <img src={skill.logo} alt={skill.skill} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
                              <p className="text-gray-600">{skill.category}</p>
                            </div>
                            <FaEllipsisH className="text-gray-400 mt-2 sm:mt-0 cursor-pointer" />
                          </div>
                          <p className="text-gray-700 text-sm mt-2 leading-relaxed line-clamp-2">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {skillsData.length > 1 && (
                  <div className="text-center mt-4">
                    <span
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {showAllSkills ? 'See less' : 'See more'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          
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

export default FeedMyProfile;
