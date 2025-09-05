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
// console.log("education logo", displayedEducation);
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
        console.log("Fetched profile data:", profile);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [token, getUserPublicProfile, user?.id]);

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
  }, [token, profile, checkFollowStatus, user?.id]);

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block "></div>
        <section className="w-[800px] max-w-[800px] p-2 mt-2 mx-auto bg-white">
          {/* Profile Header */}
          <div className="mb-6 space-y-4 text-center">
            <div className="relative inline-block">
            
              <img
                src={
                  profile?.user_profile_pic || "/src/assets/dummyProfile1.jpg"
                }
                alt={
                  profile?.first_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : "User Profile"
                }
                className="object-cover w-24 h-24 border-4 rounded-full border-blue-50"
                onError={(e) => {
                  e.target.src = "/src/assets/dummyProfile1.jpg";
                }}
              />
            </div>

            <div>
              {loading ? (
                <div>Loading profile...</div>
              ) : error ? (
                <div className="mt-1 text-xs text-red-500">{error}</div>
              ) : profile ? (
                <>
                  <h2 className="text-lg font-bold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {profile.user_type}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {profile.about_us}
                  </p>
                </>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1 text-sm text-blue-600 bg-gray-100 rounded">
                {followersCount} followers
              </span>
              <span className="px-3 py-1 text-sm text-blue-600 bg-gray-100 rounded">
                {followingCount} following
              </span>
            </div>
          </div>

          {/* Activity Section */}
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Your Activity
          </h2>
          <hr className="border-gray-400" />
          <div className="pt-6 mb-6 text-gray-400 border-t">
            <p className="mb-4 text-sm text-gray-600">Your recent posts</p>

            {userActivity.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-gray-500">No activity found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 space-y-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          
                          profile?.user_profile_pic ||
                          activity.user?.profileImage ||
                          "/src/assets/profile1.png"
                        }
                        alt={activity.user?.first_name || "User"}
                        className="object-cover w-10 h-10 rounded-full"
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
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.user?.user_type || "User"}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">
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
                              className="object-cover w-full max-w-md rounded-lg"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        {/* Action Bar */}
                        <div className="flex items-center justify-between px-4 py-2 mt-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiHeart className="w-5 h-5" />
                            <span className="text-base font-medium">
                              {formatNumber(activity.like_count || 0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiMessageSquare className="w-5 h-5" />
                            <span className="text-base font-medium">
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

            <div className="mt-4 text-center">
              {userActivity.length > 0 && (
                <span
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  className="px-6 py-2 text-blue-500 transition-colors rounded-lg cursor-pointer hover:bg-blue-50"
                >
                  {showAllActivity ? "See less" : "See more"}
                </span>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <hr className="border-gray-400" />
          <div className="pt-6 mb-6 border-t">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Work Experience
            </h2>
            {loading ? (
              <div className="py-8 text-center">
                <div className="text-gray-500">Loading work experience...</div>
              </div>
            ) : workExperiences.length === 0 ? (
              <div className="py-8 text-center">
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
                      className="p-4 space-y-2 bg-white border rounded-lg shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={experience.logo || "/src/assets/WebsiteLogo.svg"}
                          alt={experience.company}
                          className="object-contain w-12 h-12"
                          onError={(e) => {
                            e.target.src = "/src/assets/WebsiteLogo.svg";
                          }}
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
                            <FaEllipsisH className="mt-2 text-gray-400 cursor-pointer sm:mt-0" />
                          </div>
                          <div className="items-start gap-3">
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-gray-500">
                                {experience.duration}
                              </p>
                              <p className="text-sm text-gray-500">
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
                  <div className="mt-4 text-center">
                    <span
                      onClick={() =>
                        setShowAllWorkExperience(!showAllWorkExperience)
                      }
                      className="px-6 py-2 text-blue-500 transition-colors rounded-lg cursor-pointer hover:bg-blue-50"
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
          <div className="pt-6 mb-6 border-t">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Education</h2>
            {loading ? (
              <div className="py-8 text-center">
                <div className="text-gray-500">Loading education...</div>
              </div>
            ) : educationData.length === 0 ? (
              <div className="py-8 text-center">
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
                      className="p-4 bg-white border rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={education.logo || "/src/assets/WebsiteLogo.svg"}
                          alt={education.institution}
                          className="object-cover w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.src = "/src/assets/WebsiteLogo.svg";
                          }}
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
                              <p className="text-sm text-gray-500">
                                {education.duration}
                              </p>
                            </div>
                            <FaEllipsisH className="mt-2 text-gray-400 cursor-pointer sm:mt-0" />
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-gray-700 line-clamp-2">
                            {education.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {educationData.length > 1 && (
                  <div className="mt-4 text-center">
                    <span
                      onClick={() => setShowAllEducation(!showAllEducation)}
                      className="px-6 py-2 text-blue-500 transition-colors rounded-lg cursor-pointer hover:bg-blue-50"
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
          <div className="pt-6 mb-6 border-t">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Skills</h2>
            {loading ? (
              <div className="py-8 text-center">
                <div className="text-gray-500">Loading skills...</div>
              </div>
            ) : skillsData.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-gray-500">No skills added yet</div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedSkills.map((skill) => {
                    // Extract authority names safely
                    let authorityText = "";
                    if (skill.authority) {
                      if (Array.isArray(skill.authority)) {
                        // Handle array of authority objects
                        authorityText = skill.authority
                          .map((auth) => {
                            if (typeof auth === "object" && auth !== null) {
                              return auth.name || "Unknown Authority";
                            }
                            return String(auth);
                          })
                          .join(", ");
                      } else if (
                        typeof skill.authority === "object" &&
                        skill.authority !== null
                      ) {
                        // Handle single authority object
                        authorityText =
                          skill.authority.name || String(skill.authority);
                      } else {
                        // Handle string or other types
                        authorityText = String(skill.authority);
                      }
                    }

                    return (
                      <div
                        key={skill.id}
                        className="p-4 bg-white border rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={skill.authority.logo_url || "/src/assets/WebsiteLogo.svg"}
                            alt={skill.skill || skill.domain || "Skill"}
                            className="object-cover w-10 h-10 rounded-full"
                            onError={(e) => {
                              e.target.src = "/src/assets/WebsiteLogo.svg";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {skill.skill ||
                                    skill.domain ||
                                    "Unknown Skill"}
                                </h3>
                                <p className="text-gray-600">
                                  {skill.category || "Technical Skills"}
                                </p>
                                {authorityText && (
                                  <p className="text-xs text-gray-500">
                                    Authority: {authorityText}
                                  </p>
                                )}
                              </div>
                              <FaEllipsisH className="mt-2 text-gray-400 cursor-pointer sm:mt-0" />
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700 line-clamp-2">
                              {skill.description ||
                                `Proficient in ${
                                  skill.skill || skill.domain || "this skill"
                                }`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {skillsData.length > 1 && (
                  <div className="mt-4 text-center">
                    <span
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="px-6 py-2 text-blue-500 transition-colors rounded-lg cursor-pointer hover:bg-blue-50"
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
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default FeedMyProfile;
