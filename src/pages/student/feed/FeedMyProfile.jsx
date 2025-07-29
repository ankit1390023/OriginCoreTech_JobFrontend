import React, { useState, useEffect } from 'react';
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


// Fetch user public profile using userId from localStorage
useEffect(() => {
  async function fetchUserProfile() {
      setLoading(true);
      setError(null);
      try {
          const userId = localStorage.getItem('userId');
          const result = await userDetailsApi.getUserDetails(userId);
          console.log("result from fetchUserProfile",result);
          if (result.success) {
              setProfile(result.data.publicProfile); // Only set the publicProfile part
          } else {
              setError(result.error || 'Failed to fetch user details.');
              setProfile(null);
          }
      } catch (err) {
          setError('Failed to fetch user details.');
          setProfile(null);
      }
  }
  fetchUserProfile();
}, []);

useEffect(() => {
  async function checkStatus() {
    try {
      const userId = localStorage.getItem('userId');
      if (userId && profile && profile._id && userId !== profile._id) {
        const res = await feedApi.checkFollowStatus(profile._id);
        setIsFollowing(res.isFollowing); // Adjust if API response shape differs
      }
    } catch (err) {
      setIsFollowing(false);
    }
  }
  if (profile) checkStatus();
}, [profile]);


  useEffect(() => {
      async function fetchFollowersAndFollowing() {
          setLoading(true);
          setError(null);
          try {
              const { count: followersCount, followers } = await feedApi.getFollowers();
              setFollowers(followers);
              setFollowersCount(followersCount);

              const { count: followingCount, following } = await feedApi.getFollowing();
              setFollowing(following);
              setFollowingCount(followingCount);
          } catch (err) {
              setError('Failed to load followers/following');
          } finally {
              setLoading(false);
          }
      }
      fetchFollowersAndFollowing();
  }, []);

  const handleFollowToggle = async (profile,profile_id) => {
    if (!profile || !profile_id) {
      console.log("profile",profile);
      console.log("profile_id",profile_id);
      console.error('Profile or profile ID not available');
      return;
    }
    
    setFollowLoading(true);
    try {
      await feedApi.followUnfollowUser(profile._id);
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => isFollowing ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Error toggling follow status:', err);
      // Optionally show error
    } finally {
      setFollowLoading(false);
    }
  };


  const workExperiences = [
    {
      id: 1,
      logo: "/src/assets/uber-logo.png",
      company: "Uber",
      position: "Graphic Designer",
      duration: "June 23 - Present",
      timeSpan: "1 year 11 months",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus eros eu vehicula interdum. Cras nec ultricies massa. Curabitur rutrum..."
    },
    {
      id: 2,
      logo: "/src/assets/WebsiteLogo.svg",
      company: "Google",
      position: "UI/UX Designer",
      duration: "Jan 22 - May 23",
      timeSpan: "1 year 4 months",
      description: "Designed user interfaces for mobile and web applications. Collaborated with cross-functional teams to create intuitive user experiences."
    },
    {
      id: 3,
      logo: "/src/assets/WebsiteLogo.svg",
      company: "Microsoft",
      position: "Visual Designer",
      duration: "Mar 21 - Dec 21",
      timeSpan: "9 months",
      description: "Created visual assets for marketing campaigns and product launches. Worked on brand identity and design systems."
    },
    {
      id: 4,
      logo: "/src/assets/WebsiteLogo.svg",
      company: "Apple",
      position: "Junior Designer",
      duration: "Jun 20 - Feb 21",
      timeSpan: "8 months",
      description: "Assisted senior designers in creating marketing materials and product mockups. Learned design principles and tools."
    }
  ];

  const displayedExperiences = showAllWorkExperience ? workExperiences : workExperiences.slice(0, 1);

  const educationData = [
    {
      id: 1,
      logo: "/src/assets/collegelogo.png",
      institution: "Delhi Technological University",
      degree: "Bachelor's degree, Design",
      duration: "2018 - 2022",
       description: "Studied design principles, user experience, and visual communication. Graduated with honors."
    },
    {
      id: 2,
      logo: "/src/assets/collegelogo.png",
      institution: "National Institute of Design",
      degree: "Master's degree, Interaction Design",
      duration: "2022 - 2024",
      description: "Specialized in digital product design and user interface development. Completed thesis on mobile app design."
    },
    {
      id: 3,
      logo: "/src/assets/collegelogo.png",
      institution: "Design Academy",
      degree: "Certificate, UI/UX Design",
      duration: "2021 - 2022",
      description: "Intensive course on modern design tools and methodologies. Learned Figma, Sketch, and prototyping."
    },
    {
      id: 4,
      logo: "/src/assets/collegelogo.png",
      institution: "Creative Institute",
      degree: "Diploma, Graphic Design",
      duration: "2017 - 2018",
      description: "Foundation course in graphic design fundamentals, typography, and color theory."
    }
  ];

  const displayedEducation = showAllEducation ? educationData : educationData.slice(0, 1);

  const skillsData = [
    {
      id: 1,
      logo: "/src/assets/collegelogo.png",
      skill: "Visual Identity",
      category: "Delhi Technological University",
      //description: "Creating cohesive brand identities and visual systems for companies and products."
    },
    {
      id: 2,
      logo: "/src/assets/collegelogo.png",
      skill: "UI/UX Design",
      category: "Digital Design",
      description: "Designing intuitive user interfaces and seamless user experiences for web and mobile applications."
    },
    {
      id: 3,
      logo: "/src/assets/collegelogo.png",
      skill: "Adobe Creative Suite",
      category: "Software",
      description: "Proficient in Photoshop, Illustrator, InDesign, and other Adobe design tools."
    },
    {
      id: 4,
      logo: "/src/assets/collegelogo.png",
      skill: "Prototyping",
      category: "Design Process",
      description: "Creating interactive prototypes using Figma, Sketch, and other prototyping tools."
    },
    {
      id: 5,
      logo: "/src/assets/collegelogo.png",
      skill: "Typography",
      category: "Design Fundamentals",
      description: "Expert knowledge of type selection, hierarchy, and layout principles."
    }
  ];

  const displayedSkills = showAllSkills ? skillsData : skillsData.slice(0, 1);

  const activityData = [
    {
      id: 1,
      profileImage: "/src/assets/profile1.png",
      name: "Rohan",
      time: "10 min",
      role: "Digital Marketer @Uber",
      content: "Hey! Just started a new project and IT WAS MY DREAM! Check the link in my profile and comment your suggestions, It has been a rollercoaster journey. Also, I have been",
      likes: "1.6 k",
      comments: "200"
    },
    {
      id: 2,
      profileImage: "/src/assets/dummyProfile2.jpg",
      name: "Sarah Chen",
      time: "2 hours",
      role: "Product Designer @Google",
      content: "Just launched my portfolio website! After months of hard work, finally ready to showcase my design journey. Would love feedback from the community.",
      likes: "2.1 k",
      comments: "156"
    },
    {
      id: 3,
      profileImage: "/src/assets/dummyProfile3.jpg",
      name: "Alex Johnson",
      time: "5 hours",
      role: "UX Researcher @Microsoft",
      content: "Excited to share my latest research findings on user behavior patterns. The insights we discovered are game-changing for product development.",
      likes: "890",
      comments: "67"
    },
    {
      id: 4,
      profileImage: "/src/assets/profile1.png",
      name: "Maria Garcia",
      time: "1 day",
      role: "Creative Director @Apple",
      content: "Design is not just what it looks like and feels like. Design is how it works. Here's my latest project that embodies this philosophy.",
      likes: "3.2 k",
      comments: "234"
    }
  ];

  const displayedActivity = showAllActivity ? activityData : activityData.slice(0, 1);



  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow "></div>
        <section
          className="className=w-full max-w-[800px] p-2 mt-2 mx-auto bg-white"
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
            <p className="text-gray-600 text-sm mb-4">You liked</p>
            <div className="space-y-4">
              {displayedActivity.map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={activity.profileImage} alt={activity.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900">{activity.name}</span>
                        <span className="text-gray-500 text-sm">{activity.time}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{activity.role}</p>
                      <p className="text-gray-700 text-sm mt-2">
                        {activity.content}{' '}
                        <span className="text-blue-500 cursor-pointer">see more...</span>
                      </p>
                      {/* Action Bar */}
                      <div className="flex justify-between items-center py-2 px-4 mt-6">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiHeart className="w-5 h-5" />
                          <span className="font-medium text-base">{activity.likes}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiMessageSquare className="w-5 h-5" />
                          <span className="font-medium text-base">{activity.comments}</span>
                        </div>
                        <FiSend className="w-5 h-5 text-gray-500" />
                        <BsBookmarkFill className="w-5 h-5" style={{ color: '#A259FF' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <span
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {showAllActivity ? 'See less' : 'See more'}
              </span>
            </div>
          </div>

          {/* Work Experience */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
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
            <div className="text-center mt-4">
              <span
                onClick={() => setShowAllWorkExperience(!showAllWorkExperience)}
                className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {showAllWorkExperience ? 'See less' : 'See more'}
              </span>
            </div>
          </div>

          {/* Education */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
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
            <div className="text-center mt-4">
              <span
                onClick={() => setShowAllEducation(!showAllEducation)}
                className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {showAllEducation ? 'See less' : 'See more'}
              </span>
            </div>
          </div>

          {/* Skills */}
          <hr className="border-gray-400" />
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
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
            <div className="text-center mt-4">
              <span
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {showAllSkills ? 'See less' : 'See more'}
              </span>
            </div>
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
