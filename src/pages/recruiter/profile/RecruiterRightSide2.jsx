import { useSelector } from 'react-redux';
import cover from '../../../assets/cover.png';
import dummyProfile3 from '../../../assets/dummyProfile3.jpg';
import { useEffect, useState } from 'react';
import feedApi from '../../../api/feedApi';
import { userDetailsApi } from '../../../api/userDetailsApi';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  

export default function RecruiterRightSide2() {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [expandedPathway, setExpandedPathway] = useState(null);

  const navigate = useNavigate();
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
          setError(result.error || 'Failed to fetch user details.');
          setProfile(null);
        }
      } catch {
        setError('Failed to fetch user details.');
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
        setError('Failed to load followers/following');
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
        width: '375px',
        height: '725px',
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
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-700 font-semibold mt-1">{profile.userType}</p>
            <p className="text-sm text-gray-600 mt-2">{profile.aboutus}</p>
          </>
        ) : null}

        <div className="flex gap-2 mt-4">
          <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
            {loading ? 'Loading...' : `${followersCount} followers`}
          </button>
          <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded">
            {loading ? 'Loading...' : `${followingCount} following`}
          </button>
        </div>
      </div>
   <br/>
      <button
                    onClick={() => navigate("/recruiter-post-job-intern-details")}
                    className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg text-lg font-medium"
                >
                    Post a Job
                </button>

       {/* Course List */}
                 <div className="flex flex-col gap-6 mt-4">
                 <h1 className="text-lg font-bold text-gray-900 mb-2">Your Like thease</h1>
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
                           className="w-12 h-12 rounded-md object-cover"
                         />
                         <div>
                           <h3 className="text-base font-semibold">{course.title}</h3>
                           <p className="text-xs text-gray-100">{course.learners}</p>
                         </div>
                         <div className="ml-auto flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
                           <FaEye className="text-gray-600 text-xs" />
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
                         <span className="bg-white text-gray-800 px-3 py-1 rounded-md text-xs">
                           {course.duration}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
    </div>
  );
}
