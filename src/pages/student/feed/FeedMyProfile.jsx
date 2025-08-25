import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../components/ui";
import { FaEllipsisH } from "react-icons/fa";
import { FiHeart, FiMessageSquare, FiSend } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightProfile from "../feed/FeedRightProfile";
import { useUserDetailsApi } from "../../../hooks/useUserDetailsApi";
import useFeedApi from "../../../hooks/useFeedApi";
import { formatTimeAgo, formatNumber } from "../../../../utils";

const FeedMyProfile = () => {
  const { user, token } = useSelector((state) => state.auth);

  const {
    loading,
    error,
    profile,
    userActivity,
    workExperiences,
    educationData,
    skillsData,
    getUserPublicProfile,
  } = useUserDetailsApi();

  const {
    followersCount,
    followingCount,
    fetchFollowersAndFollowing,
    checkFollowStatus,
  } = useFeedApi();

  // State for UI controls
  const [showAllWorkExperience, setShowAllWorkExperience] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const displayedExperiences = showAllWorkExperience
    ? workExperiences
    : workExperiences.slice(0, 1);

  const displayedEducation = showAllEducation
    ? educationData
    : educationData.slice(0, 1);

  const displayedSkills = showAllSkills ? skillsData : skillsData.slice(0, 1);

  const displayedActivity = showAllActivity
    ? userActivity
    : userActivity.slice(0, 1);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return;

      try {
        const user_id = user?.id;
        if (user_id) {
          await getUserPublicProfile(user_id, token);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [token, getUserPublicProfile]);

  // Fetch followers and following data on component mount
  useEffect(() => {
    if (token) {
      fetchFollowersAndFollowing();
    }
  }, [token, fetchFollowersAndFollowing]);

  // Check follow status when profile changes
  useEffect(() => {
    if (token && profile && profile._id) {
      if (user?.id && user?.id !== profile._id) {
        checkFollowStatus(profile._id);
      }
    }
  }, [token, profile, checkFollowStatus]);

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow "></div>
        <section className="w-[800px] max-w-[800px] p-2 mt-2 mx-auto bg-white">
          {/* Profile Header */}
          <div className="text-center space-y-4 mb-6">
            <div className="relative inline-block">
              <img
                src={profile?.profileImage || "/src/assets/dummyProfile1.jpg"}
                alt={
                  profile?.first_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : "User Profile"
                }
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
                onError={(e) => {
                  e.target.src = "/src/assets/dummyProfile1.jpg";
                }}
              />
            </div>

            <div>
              {loading ? (
                <div>Loading profile...</div>
              ) : error ? (
                <div className="text-red-500 text-xs mt-1">{error}</div>
              ) : profile ? (
                <>
                  <h2 className="text-lg font-bold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <p className="text-sm text-gray-700 font-semibold mt-1">
                    {profile.user_type}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {profile.about_us}
                  </p>
                </>
              ) : null}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
              <span className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
                {followersCount} followers
              </span>
              <span className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
                {followingCount} following
              </span>
            </div>
          </div>

          {/* Activity Section */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your Activity
          </h2>
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6 text-gray-400">
            <p className="text-gray-600 text-sm mb-4">Your recent posts</p>

            {userActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No activity found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          activity.user?.profileImage ||
                          "/src/assets/profile1.png"
                        }
                        alt={activity.user?.first_name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "/src/assets/profile1.png";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {activity.user?.first_name}{" "}
                            {activity.user?.last_name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {activity.user?.user_type || "User"}
                        </p>
                        <p className="text-gray-700 text-sm mt-2">
                          {activity.content}{" "}
                          {activity.content &&
                            activity.content.length > 100 && (
                              <span className="text-blue-500 cursor-pointer">
                                see more...
                              </span>
                            )}
                        </p>
                        {activity.image && (
                          <div className="mt-3">
                            <img
                              src={activity.image}
                              alt="Post content"
                              className="w-full max-w-md rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        {/* Action Bar */}
                        <div className="flex justify-between items-center py-2 px-4 mt-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiHeart className="w-5 h-5" />
                            <span className="font-medium text-base">
                              {formatNumber(activity.like_count || 0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiMessageSquare className="w-5 h-5" />
                            <span className="font-medium text-base">
                              {formatNumber(activity.comment_count || 0)}
                            </span>
                          </div>
                          <FiSend className="w-5 h-5 text-gray-500" />
                          <BsBookmarkFill
                            className="w-5 h-5"
                            style={{ color: "#A259FF" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-4">
              {userActivity.length > 0 && (
                <span
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  {showAllActivity ? "See less" : "See more"}
                </span>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Work Experience
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading work experience...</div>
              </div>
            ) : workExperiences.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No work experience added yet
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedExperiences.map((experience) => (
                    <div
                      key={experience.id}
                      className="bg-white border rounded-lg shadow-sm p-4 space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={experience.logo}
                          alt={experience.company}
                          className="w-12 h-12 object-contain"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {experience.position}
                              </h3>
                              <p className="text-gray-600">
                                {experience.company}
                              </p>
                            </div>
                            <FaEllipsisH className="text-gray-400 mt-2 sm:mt-0 cursor-pointer" />
                          </div>
                          <div className="items-start gap-3">
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-gray-500 text-sm">
                                {experience.duration}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {experience.timeSpan}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {workExperiences.length > 1 && (
                  <div className="text-center mt-4">
                    <span
                      onClick={() =>
                        setShowAllWorkExperience(!showAllWorkExperience)
                      }
                      className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {showAllWorkExperience ? "See less" : "See more"}
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
                <div className="text-gray-500">
                  No education details added yet
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedEducation.map((education) => (
                    <div
                      key={education.id}
                      className="bg-white border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={education.logo}
                          alt={education.institution}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {education.institution}
                              </h3>
                              <p className="text-gray-600">
                                {education.degree}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {education.duration}
                              </p>
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
                      {showAllEducation ? "See less" : "See more"}
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
                  {displayedSkills.map((skill, index) => {
                    // Handle both formatted skill objects and raw API response objects
                    const skillName =
                      skill.skill ||
                      skill.domain ||
                      skill.name ||
                      "Unknown Skill";
                    const skillCategory = skill.category || "Technical Skills";
                    const skillDescription =
                      skill.description ||
                      (skill.subSkills && Array.isArray(skill.subSkills)
                        ? `Sub-skills: ${skill.subSkills.join(", ")}`
                        : `Proficient in ${skillName}`);
                    const skillLogo =
                      skill.logo ||
                      skill.certificate_image ||
                      "/src/assets/WebsiteLogo.svg";
                    const skillId = skill.id || skill._id || index;

                    return (
                      <div
                        key={skillId}
                        className="bg-white border rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={skillLogo}
                            alt={skillName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "/src/assets/WebsiteLogo.svg";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {skillName}
                                </h3>
                                <p className="text-gray-600">{skillCategory}</p>
                                {skill.authority && (
                                  <p className="text-gray-500 text-xs">
                                    Authority: {skill.authority}
                                  </p>
                                )}
                              </div>
                              <FaEllipsisH className="text-gray-400 mt-2 sm:mt-0 cursor-pointer" />
                            </div>
                            <p className="text-gray-700 text-sm mt-2 leading-relaxed line-clamp-2">
                              {skillDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {skillsData.length > 1 && (
                  <div className="text-center mt-4">
                    <span
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {showAllSkills ? "See less" : "See more"}
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
