    
import cover from '../../../assets/cover.png';
import dummyProfile3 from '../../../assets/dummyProfile3.jpg';
import dummyProfile1 from '../../../assets/dummyProfile1.jpg';
import dummyProfile2 from '../../../assets/dummyProfile2.jpg';
import { FaCamera } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import feedApi from '../../../api/feedApi';
import { userDetailsApi } from '../../../api/userDetailsApi';


const visitors = [
    { name: 'Olivia Rhye', img: dummyProfile1 },
    { name: 'Phoenix Baker', img: dummyProfile2 },
    { name: 'Lana Steiner', img: dummyProfile3 },
    { name: 'Milo Thorne', img: dummyProfile1 },
    { name: 'Olivia Rhye', img: dummyProfile1 },
    { name: 'Lana Steiner', img: dummyProfile3 },
    { name: 'Milo Thorne', img: dummyProfile1 },
    { name: 'Phoenix Baker', img: dummyProfile2 },
];

export default function FeedRightProfile() {
    const [followers, setFollowers] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [following, setFollowing] = useState([]); // Added for following
    const [followingCount, setFollowingCount] = useState(0); // Added for following count
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null); // <-- Add profile state

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

    
    

    return (
        <div>
            <div className="bg-white shadow border rounded p-4">
                {/* Cover + Profile */}
                <div className="relative h-20 mb-12">
                    <div className="w-full h-20 rounded-t bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }}></div>
                    {/* <div className="absolute bg-blue-600 border rounded-full flex items-center justify-center w-6 h-6 top-2 right-2">
                        <FaCamera className='text-white w-3 h-3' />
                    </div> */}
                    <div className="absolute left-2 top-10 w-24 h-24">
                        <img src={dummyProfile3} alt="Profile" className="w-full h-full rounded-full border-4 border-white object-cover" />
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
                            <h2 className="text-lg font-bold text-gray-800">{profile.firstName} {profile.lastName}</h2>
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
                    {/* error already shown above */}
                </div>
                 {/* Dashboard */}
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 border-t pt-4">Your Dashboard</h3>
                    <div className="flex justify-between text-yellow-500 font-bold text-lg mt-2">
                        <div>
                            <p className='text-2xl'>367</p>
                            <p className="text-xs text-gray-500">Views today</p>
                        </div>
                        <div>
                            <p className='text-2xl'>15</p>
                            <p className="text-xs text-gray-500">Post views</p>
                        </div>
                        <div>
                            <p className='text-2xl'>09</p>
                            <p className="text-xs text-gray-500">Search appearance</p>
                        </div>
                    </div>
                    <p className="text-sm text-blue-600 text-center cursor-pointer mt-2">See more</p>
                </div>
                {/* Profile Visitors */}
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 border-t pt-4">Profile Visitors</h3>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {visitors.map((visitor, index) => (
                            <div key={index} className="text-center">
                                <img src={visitor.img} alt={visitor.name} className="mx-auto object-cover w-12 h-12 rounded" />
                                <p className="text-xs text-gray-600 mt-1">{visitor.name}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-blue-600 text-center cursor-pointer mt-2">See more</p>
                </div>
            </div>
        </div>
    )
}