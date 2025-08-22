import { useSelector } from "react-redux";
import cover from "../../../assets/cover.png";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";
import { useEffect, useState } from "react";
import feedApi from "../../../api/feedApi";
import { userDetailsApi } from "../../../api/userDetailsApi";

export default function FeedRightSide3() {
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
        const result = await userDetailsApi.getUserDetails(user.id);
        if (result.success) {
          setProfile(result.data.publicProfile);
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
          className="w-full h-20 rounded-t bg-cover bg-center"
          style={{ backgroundImage: `url(${cover})` }}
        ></div>
        <div className="absolute left-2 top-10 w-24 h-24">
          <img
            src={dummyProfile3}
            alt="Profile"
            className="w-full h-full rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-4">
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
            <p className="text-sm text-gray-600 mt-2">{profile.about_us}</p>
          </>
        ) : null}

        <div className="flex gap-2 mt-4">
          <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
            {loading ? "Loading..." : `${followersCount} followers`}
          </button>
          <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
            {loading ? "Loading..." : `${followingCount} following`}
          </button>
        </div>
      </div>
    </div>
  );
}
