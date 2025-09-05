import { useSelector } from "react-redux";
import cover from "../../../assets/cover.png";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";
import dummyProfile1 from "../../../assets/dummyProfile1.jpg";
import dummyProfile2 from "../../../assets/dummyProfile2.jpg";
import { FaCamera } from "react-icons/fa6";
import { useEffect, useState } from "react";
import feedApi from "../../../api/feedApi";
import { userDetailsApi } from "../../../api/userDetailsApi";

const visitors = [
  { name: "Olivia Rhye", img: dummyProfile1 },
  { name: "Phoenix Baker", img: dummyProfile2 },
  { name: "Lana Steiner", img: dummyProfile3 },
  { name: "Milo Thorne", img: dummyProfile1 },
  { name: "Olivia Rhye", img: dummyProfile1 },
  { name: "Lana Steiner", img: dummyProfile3 },
  { name: "Milo Thorne", img: dummyProfile1 },
  { name: "Phoenix Baker", img: dummyProfile2 },
];

export default function FeedRightProfile() {
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [following, setFollowing] = useState([]); // Added for following
  const [followingCount, setFollowingCount] = useState(0); // Added for following count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null); // <-- Add profile state
  const { token, user } = useSelector((state) => state.auth);

  // Fetch user public profile using user_id from Redux
  useEffect(() => {
    async function fetchUserProfile() {
      if (!token || !user) return;

      setLoading(true);
      setError(null);
      try {
        const result = await userDetailsApi.getUserDetails(user.id);
        console.log("result from fetchUserProfile", result);
        if (result.success) {
          setProfile(result.data.publicProfile); // Only set the publicProfile part
        } else {
          setError(result.error || "Failed to fetch user details.");
          setProfile(null);
        }
      } catch (err) {
        setError("Failed to fetch user details.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [token, user]);

  useEffect(() => {
    async function fetchFollowersAndFollowing() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const { count: followersCount, followers } = await feedApi.getFollowers(
          token
        );
        setFollowers(followers);
        setFollowersCount(followersCount);

        const { count: followingCount, following } = await feedApi.getFollowing(
          token
        );
        setFollowing(following);
        setFollowingCount(followingCount);
      } catch (err) {
        setError("Failed to load followers/following");
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchFollowersAndFollowing();
    }
  }, [token]);

  return (
    <div>
      <div className="p-4 bg-white border rounded shadow">
        {/* Cover + Profile */}
        <div className="relative h-20 mb-12">
          <div
            className="w-full h-20 bg-center bg-cover rounded-t"
            style={{ backgroundImage: `url(${cover})` }}
          ></div>
          {/* <div className="absolute flex items-center justify-center w-6 h-6 bg-blue-600 border rounded-full top-2 right-2">
                        <FaCamera className='w-3 h-3 text-white' />
                    </div> */}
          <div className="absolute w-24 h-24 left-2 top-10">
            <img
              src={ dummyProfile3}
              alt="Profile"
              className="object-cover w-full h-full border-4 border-white rounded-full"
            />
          </div>
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
              <p className="text-sm text-gray-500">{user?.email}</p>

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
          {/* error already shown above */}
        </div>

        {/* Dashboard */}
        <div className="mt-4">
          <h3 className="pt-4 font-semibold text-gray-800 border-t">
            Your Dashboard
          </h3>
          <div className="flex justify-between mt-2 text-lg font-bold text-yellow-500">
            <div>
              <p className="text-2xl">367</p>
              <p className="text-xs text-gray-500">Views today</p>
            </div>
            <div>
              <p className="text-2xl">15</p>
              <p className="text-xs text-gray-500">Post views</p>
            </div>
            <div>
              <p className="text-2xl">09</p>
              <p className="text-xs text-gray-500">Search appearance</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-center text-blue-600 cursor-pointer">
            See more
          </p>
        </div>
        {/* Profile Visitors */}
        <div className="mt-4">
          <h3 className="pt-4 font-semibold text-gray-800 border-t">
            Profile Visitors
          </h3>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {visitors.map((visitor, index) => (
              <div key={index} className="text-center">
                <img
                  src={visitor.img}
                  alt={visitor.name}
                  className="object-cover w-12 h-12 mx-auto rounded"
                />
                <p className="mt-1 text-xs text-gray-600">{visitor.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-center text-blue-600 cursor-pointer">
            See more
          </p>
        </div>
      </div>
    </div>
  );
}
