import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaEllipsisH } from "react-icons/fa";
import { FiHeart, FiMessageSquare, FiSend } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import MainLayout from "../../components/layout/MainLayout";
import FeedRightProfile from "../student/feed/FeedRightProfile";
import { formatTimeAgo, formatNumber, getImageUrl } from "../../../utils";
import dummyProfile3 from "../../assets/dummyProfile3.jpg";
import { universityApi } from "../../api/university/universityApi";
import useFeedApi from "../../hooks/useFeedApi";


const UniversityPublicProfile = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [showAllActivity, setShowAllActivity] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    const {
        followersCount,
        followingCount,
        fetchFollowersAndFollowing,
        checkFollowStatus,
    } = useFeedApi();


    // Fetch followers and following data on component mount
    useEffect(() => {
        if (token) {
            fetchFollowersAndFollowing();
        }
    }, [token, fetchFollowersAndFollowing]);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await universityApi.getUniversityPublicProfileById(user?.id, token);
                console.log("response received from getUniversityPublicProfileById is", response);
                setProfile(response);
                setLoading(false);

            } catch (error) {
                console.log("Error while fetchinhg getUniversityPublicProfileById", error);
                setError(error.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        getProfile();
    }, [token]);


    const activity = profile?.activity || [];
    const courses = profile?.publicProfile?.courses?.map(c => c?.name).filter(Boolean) ?? [];
    const about = profile?.publicProfile?.about;
    const college_name = profile?.publicProfile?.college_name;
    const pincode = profile?.publicProfile?.pincode;
    const website_link = profile?.publicProfile?.website_link;
    const address = profile?.publicProfile?.address;
    const full_name = profile?.publicProfile?.User?.first_name + "" + profile?.publicProfile?.User?.last_name;
    const phone = profile?.publicProfile?.User?.phone;
    const email = profile?.publicProfile?.User?.email;
    const user_role = profile?.publicProfile?.User?.user_role;
    const social_media_link = profile?.publicProfile?.social_media_link;
    const profile_pic = getImageUrl(profile?.publicProfile?.profile_pic) || dummyProfile3;
    const university_logo_url = getImageUrl(profile?.publicProfile?.university_logo_url) || dummyProfile3;


    const displayedActivity = showAllActivity
        ? activity
        : activity?.length > 0 ? activity.slice(0, 1) : [];

    console.log("activity is", activity);
    console.log("courses is", courses);
    console.log("about is", about);
    console.log("college_name is", college_name);
    console.log("pincode is", pincode);
    console.log("website_link is", website_link);
    console.log("address is", address);
    console.log("full_name is", full_name);
    console.log("phone is", phone);
    console.log("email is", email);
    console.log("user_role is", user_role);
    console.log("social_media_link is", social_media_link);
    console.log("profile_pic is", profile_pic);
    console.log("university_logo_url is", university_logo_url);

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
                           src={profile_pic}
                           alt={
                             full_name
                               ? `${full_name}`
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
                               {full_name}
                             </h2>
                             <p className="text-sm text-gray-500">{email}</p>
                             <p className="mt-1 text-sm font-semibold text-gray-700">
                               {user_role}
                             </p>
                             <p className="mt-2 text-sm text-gray-600">
                               {about}
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
           
                       {activity.length === 0 ? (
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
                                   src={profile_pic}
                                   alt={full_name || "User"}
                                   className="object-cover w-10 h-10 rounded-full"
                                   onError={(e) => {
                                     e.target.src = "/src/assets/profile1.png";
                                   }}
                                 />
                                 <div className="flex-1">
                                   <div className="flex flex-wrap items-center gap-2">
                                     <span className="font-semibold text-gray-900">
                                       {full_name}
                                     </span>
                                     <span className="text-sm text-gray-500">
                                       {formatTimeAgo(activity.created_at)}
                                     </span>
                                   </div>
                                   <p className="text-sm text-gray-600">
                                     {user_role}
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
                                         src={getImageUrl(activity.image)}
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
                         {activity.length > 0 && (
                           <span
                             onClick={() => setShowAllActivity(!showAllActivity)}
                             className="px-6 py-2 text-blue-500 transition-colors rounded-lg cursor-pointer hover:bg-blue-50"
                           >
                             {showAllActivity ? "See less" : "See more"}
                           </span>
                         )}
                       </div>
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

export default UniversityPublicProfile;
