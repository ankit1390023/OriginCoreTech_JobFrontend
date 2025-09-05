import { useSelector } from "react-redux";
import cover from "../../../assets/cover.png";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";
import { useEffect, useState } from "react";
import feedApi from "../../../api/feedApi";
import { userDetailsApi } from "../../../api/userDetailsApi";

import { FaEye } from "react-icons/fa";

// Course Data
const courses = [
  {
    id: 1,
    title: "Graphic Design",
    learners: "122,263 learners",
    tag: "Lesson",
    duration: "8 weeks",
    bgColor: "bg-[#6EB5DD]",
    tagColor: "bg-[#4599C8]",
  },
  {
    id: 2,
    title: "Graphic Design",
    learners: "122,263 learners",
    tag: "Competition",
    duration: "4 days",
    bgColor: "bg-[#E8AC6E]",
    tagColor: "bg-[#C57829]",
  },
  {
    id: 3,
    title: "Graphic Design",
    learners: "122,263 learners",
    tag: "Project",
    duration: "2 weeks",
    bgColor: "bg-[#888CE4]",
    tagColor: "bg-[#5B60CD]",
  },
];

export default function FeedRightSide1() {


  console.log("qwertyuiwertyuisdfghjkldfghjk");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [expandedPathway, setExpandedPathway] = useState(null);

  const { token, user } = useSelector((state) => state.auth);


  // Fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      if (!token || !user) return;
      setLoading(true);
      setError(null);
      try {
        
        const result = await userDetailsApi.getMiniUserDetails(user.id, token);
        
        if (result.success) {
          setProfile(result.data.user);
        } else {
          setError(result.error || "Failed to fetch user details.");
          setProfile(null);
        }
      } catch {
        setError("Failed to fetch user details.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [token, user]);

  // Fetch followers/following
  useEffect(() => {
    async function fetchFollowersAndFollowing() {
      if (!token) return;
      try {
        const { count: followersCount } = await feedApi.getFollowers(token);
        setFollowersCount(followersCount);

        const { count: followingCount } = await feedApi.getFollowing(token);
        setFollowingCount(followingCount);
      } catch {
        setError("Failed to load followers/following");
      }
    }
    if (token) fetchFollowersAndFollowing();
  }, [token]);

  const handlePathwayClick = (id) => {
    if (id === 1) {
      setExpandedPathway(expandedPathway === id ? null : id);
    }
  };

  return (
    <div
      className="bg-white shadow border rounded-[10px] p-5"
      style={{
        width: "375px",
        height: "725px",
      }}
    >
      {/* Cover + Profile */}
      <div className="relative h-20 mb-12">
        <div
          className="w-full h-20 bg-center bg-cover rounded-t"
          style={{ backgroundImage: `url(${cover})` }}
        ></div>
        <div className="absolute w-24 h-24 left-2 top-10">
          <img
            src={profile?.user_profile_pic||  dummyProfile3}
            alt="Profile"
            className="object-cover w-full h-full border-4 border-white rounded-full"
          />
        </div>s
      </div>

      {/* Profile Info */}
      <div className="pt-4">
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
            <p className="mt-2 text-sm text-gray-600">{profile.about_us}</p>
          </>
        ) : null}

        <div className="flex gap-2 mt-4">
          <button className="px-3 py-1 text-sm text-blue-600 bg-gray-100 rounded">
            {loading ? "Loading..." : `${followersCount} followers`}
          </button>
          <button className="px-3 py-1 text-sm text-blue-600 bg-gray-100 rounded">
            {loading ? "Loading..." : `${followingCount} following`}
          </button>
        </div>
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-6 mt-4">
        <h1 className="mb-2 text-lg font-bold text-gray-900">
          Your Like thease
        </h1>
        {courses.map((course) => (
          <div
            key={course.id}
            className={`${course.bgColor} text-white rounded-lg p-4 flex flex-col gap-3`}
          >
            {/* Top Row */}
            <div className="flex items-center gap-3">
              <img
                src="https://via.placeholder.com/50"
                alt="course"
                className="object-cover w-12 h-12 rounded-md"
              />
              <div>
                <h3 className="text-base font-semibold">{course.title}</h3>
                <p className="text-xs text-gray-100">{course.learners}</p>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 ml-auto bg-gray-100 rounded-full">
                <FaEye className="text-xs text-gray-600" />
                <span className="text-[10px] text-gray-700">Skills</span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-3">
              <span
                className={`${course.tagColor} px-3 py-1 rounded-md text-xs`}
              >
                {course.tag}
              </span>
              <span className="px-3 py-1 text-xs text-gray-800 bg-white rounded-md">
                {course.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
