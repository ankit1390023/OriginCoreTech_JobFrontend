import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout.jsx';
import profile from '../../../assets/profile.png';
import addMediaIcon from '../../../assets/add-media.png';
import profile1 from '../../../assets/profile1.png';
import uberLogo from '../../../assets/uber-logo.png';
import carDashboard from '../../../assets/car-dashboard.png';
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { FaEllipsisH } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import cover from '../../../assets/cover.png';
import dummyProfile3 from '../../../assets/dummyProfile3.jpg';
import dummyProfile1 from '../../../assets/dummyProfile1.jpg';
import dummyProfile2 from '../../../assets/dummyProfile2.jpg';
import { FaCamera } from 'react-icons/fa6';
import { LiaShareSolid } from "react-icons/lia";
import Input from '../../../components/ui/Input';
import FeedRightProfile from './FeedRightProfile.jsx';
import feedApi from '../../../api/feedApi';




export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seeMoreUber, setSeeMoreUber] = useState(false);
    const [seeMoreRohan, setSeeMoreRohan] = useState(false);
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

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await feedApi.getFeed(1, 10); // page 1, limit 10
                console.log('Feed API data:', data);
                setPosts(data.posts);
            } catch (err) {
                setError('Failed to load feed');
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    return (
        <MainLayout>
            <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
                {/* Left Spacer */}
                <div className="hidden lg:block flex-grow"></div>
                {/* Feed Content */}
                <section className="w-full max-w-[600px] p-2 mx-auto">
                    {/* Share Box */}
                    <div className="bg-white rounded flex flex-col gap-2 shadow-sm p-4 mb-4">
                        <div className="flex items-center gap-2 w-full">
                            <img src={profile} alt="Profile" className="w-12 h-12 rounded-full " />
                            <Input
                                type="search"
                                size="large"
                                placeholder="Share something..."
                                className="flex-1 h-12 border border-gray-400 rounded px-4 min-w-[500px]"
                            />
                        </div>
                        <div className="flex items-center pl-14 gap-2">
                            <img src={addMediaIcon} alt="Add media" className="w-4 h-4" />
                            <span className="text-gray-500 text-sm">Add media</span>
                        </div>
                    </div>
                    {/* Feed Posts */}
                    {loading && <div className="text-center py-8">Loading...</div>}
                    {error && <div className="text-center text-red-500 py-8">{error}</div>}
                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-8">No posts found.</div>
                    )}
                    {!loading && !error && posts.map((post) => (
                        <article key={post.id} className="bg-white rounded border shadow-sm p-4 mb-4">
                            <header className="flex items-center gap-3 mb-2">
                                <img src={
                                    post.profilePic
                                        ? (post.profilePic.startsWith('data:') ? post.profilePic : `data:image/jpeg;base64,${post.profilePic}`)
                                        : post.User?.profilePic
                                            ? (post.User.profilePic.startsWith('data:') ? post.User.profilePic : `data:image/jpeg;base64,${post.User.profilePic}`)
                                            : profile
                                } alt={post.User?.firstName || 'User'} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <span className="font-semibold text-sm">{post.User?.firstName} {post.User?.lastName}</span>
                                    <span className="text-xs text-gray-400 ml-2">• {new Date(post.createdAt).toLocaleDateString()}</span>
                                    <div className="text-xs text-gray-500">{post.userRole}</div>
                                </div>
                                <span className="text-gray-500 text-xs cursor-pointer"><FaEllipsisH /></span>
                            </header>
                            {post.image && <img src={post.image} alt="Post" className="rounded-lg object-cover w-3/4 h-64 mb-2" />}
                            <p className="text-sm text-gray-700 mb-2">{post.caption}</p>
                            <footer className="flex flex-row justify-between text-sm text-gray-500 items-center py-2">
                                <div className="flex flex-col items-center cursor-pointer"><BiLike className='text-xl' /><span className='text-sm'>Like ({post.likeCount})</span></div>
                                <div className="flex flex-col items-center cursor-pointer"><BiCommentDetail className='text-xl' /><span className='text-sm'>Comment ({post.commentCount})</span></div>
                                <div className="flex flex-col items-center cursor-pointer"><LiaShareSolid className='text-xl' /><span className='text-sm'>Share</span></div>
                                <div className="flex flex-col items-center cursor-pointer"><TbSend className='text-xl' /><span className='text-sm'>Send</span></div>
                            </footer>
                            {/* Comments */}
                            {post.comments && post.comments.length > 0 && (
                                <div className="mt-2">
                                    <div className="font-semibold text-xs mb-1">Comments:</div>
                                    {post.comments.map((comment, idx) => (
                                        <div key={idx} className="text-xs text-gray-700 border-b py-1">
                                            <span className="font-medium">User {comment.userId}:</span> {comment.comment}
                                            <span className="ml-2 text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </section>
                {/* Profile Card */}
                <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                    <FeedRightProfile />
                </aside>
                {/* Right Spacer */}
                <div className="hidden lg:block flex-grow "></div>
            </div>
        </MainLayout>
    );
}



