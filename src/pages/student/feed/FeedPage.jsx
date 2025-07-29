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
import uploadImageApi from '../../../api/uploadImageApi';


export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // New state for feed post creation
    const [caption, setCaption] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [postingFeed, setPostingFeed] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

        
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
    const [commentInputs, setCommentInputs] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [openReplies, setOpenReplies] = useState({});
    const [replyInputs, setReplyInputs] = useState({});




    useEffect(() => {
        const userId = localStorage.getItem('userId');
    }, [])

    useEffect(() => {
        fetchFeed(1, true); // Initial load, replace posts
    }, []);

    const fetchFeed = async (pageToFetch = 1, replace = false) => {
        if (pageToFetch > totalPages && !replace) return;
        if (pageToFetch === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);
        try {
            const data = await feedApi.getFeed(pageToFetch, 10); // page, limit
            setTotalPages(data.totalPages || 1);
            setPage(data.currentPage || pageToFetch);
            if (replace) {
                setPosts(data.posts);
            } else {
                setPosts(prev => [...prev, ...data.posts]);
            }
        } catch (err) {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const feedpost = async () => {
        try {
            const response = await feedApi.postFeed(posts[0]);

        } catch (error) {
            console.log("Error while posting feed", error);
        }
    }

    // Handle image selection and preview
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    // Handle feed post creation
    const handleFeedPost = async () => {
        setPostingFeed(true);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('User not logged in');
                setPostingFeed(false);
                return;
            }
            let imageUrl = '';
            if (selectedImage) {
                setUploadingImage(true);
                imageUrl = await uploadImageApi.uploadImage(selectedImage, 'image');
                setUploadingImage(false);
            }
            const postBody = {
                userId: Number(userId),
                image: imageUrl,
                caption: caption.trim(),
            };
            await feedApi.postFeed(postBody);
            setCaption("");
            setSelectedImage(null);
            setImagePreview(null);
            fetchFeed(); // Refresh feed
        } catch (error) {
            alert('Failed to post feed');
            console.log("Error while posting feed", error);
        } finally {
            setPostingFeed(false);
            setUploadingImage(false);
        }
    };



    // Handle like/dislike toggle
    // const handleLike = async (postId) => {
    //     const userId = localStorage.getItem('userId');
    //     if (!userId) {
    //         alert('User not logged in');
    //         return;
    //     }
    //     try {
    //         await feedApi.postLike(postId, { userId: Number(userId) });
    //         // Option 1: Refetch the feed to update like state
    //         fetchFeed(page, true);
    //         // Option 2: Optimistically update UI (not implemented here for simplicity)
    //     } catch (error) {
    //         alert('Failed to update like');
    //         console.error('Error updating like:', error);
    //     }
    // };

    // Remove handleLoadMore, add handlePageChange
    const handlePageChange = (pageNum) => {
        if (pageNum !== page && pageNum >= 1 && pageNum <= totalPages) {
            fetchFeed(pageNum, true);
        }
    };



    // Handle posting a comment
    const handleComment = async (postId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('User not logged in');
            return;
        }
        const commentText = commentInputs[postId]?.trim();
        if (!commentText) return;
        try {
            // Call the API
            const response = await feedApi.postComment(postId, {
                userId: Number(userId),
                comment: commentText,
            });
            // Update the post's comments and commentCount in state
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId
                    ? { ...post, comments: response.comments, commentCount: response.commentCount }
                    : post
            ));
            // Clear the input
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        } catch (error) {
            alert('Failed to post comment');
            console.error('Error posting comment:', error);
        }
    };

    const toggleComments = (postId) => {
        setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };
    const toggleReplies = (commentId) => {
        setOpenReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };
    
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
                                type="text"
                                size="large"
                                placeholder="Share something..."
                                className="flex-1 h-12 border border-gray-400 rounded px-4 min-w-[200px]"
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                disabled={postingFeed}
                            />
                        </div>
                        <div className="flex items-center pl-14 gap-2">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <img src={addMediaIcon} alt="Add media" className="w-4 h-4" />
                                <span className="text-gray-500 text-sm">Add media</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={postingFeed}
                                />
                            </label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded object-cover ml-2" />
                            )}
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-1 rounded text-sm disabled:opacity-60"
                                onClick={handleFeedPost}
                                disabled={postingFeed || uploadingImage || (!caption.trim() && !selectedImage)}
                            >
                                {postingFeed ? 'Posting...' : uploadingImage ? 'Uploading Image...' : 'Post'}
                            </button>
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
                                <div
                                    className={`flex flex-col items-center cursor-pointer ${(post.likedBy && post.likedBy.includes(localStorage.getItem('userId'))) ? 'text-blue-600' : ''}`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    <BiLike className='text-xl' />
                                    <span className='text-sm'>Like ({post.likeCount})</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleComments(post.id)}><BiCommentDetail className='text-xl' /><span className='text-sm'>Comment ({post.commentCount})</span></div>
                                <div className="flex flex-col items-center cursor-pointer"><LiaShareSolid className='text-xl' /><span className='text-sm'>Share</span></div>
                                <div className="flex flex-col items-center cursor-pointer"><TbSend className='text-xl' /><span className='text-sm'>Send</span></div>
                            </footer>
                            {/* Comments Section */}
                            {openComments[post.id] && (
                                <div className="mt-2 border-t pt-2">
                                    {/* Comment input */}
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            type="text"
                                            size="small"
                                            placeholder="Write a comment..."
                                            className="flex-1 border rounded px-2 py-1"
                                            value={commentInputs[post.id] || ''}
                                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        />
                                        <button
                                            className="bg-blue-500 text-white px-2  py-1 rounded text-xs"
                                            onClick={() => handleComment(post.id)}
                                        >
                                            Comment
                                        </button>
                                    </div>
                                    {/* Render comments */}
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map(comment => (
                                            <div key={comment.id} className="mb-2 ml-2">
                                                <div className="flex items-center gap-2">
                                                    <img src={comment.profilePic ? (comment.profilePic.startsWith('data:') ? comment.profilePic : `data:image/jpeg;base64,${comment.profilePic}`) : profile} alt="" className="w-7 h-7 rounded-full object-cover" />
                                                    <span className="font-semibold text-xs">{comment.userName || 'User'}</span>
                                                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="ml-9">
                                                    <span className="text-sm">{comment.comment}</span>
                                                    <button className="ml-4 text-blue-500 text-xs" onClick={() => toggleReplies(comment.id)}>Reply</button>
                                                    {/* Reply input */}
                                                    {openReplies[comment.id] && (
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                type="text"
                                                                size="small"
                                                                placeholder="Write a reply..."
                                                                className="flex-1 border rounded px-2 py-1"
                                                                value={replyInputs[comment.id] || ''}
                                                                onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                            />
                                                            <button
                                                                className="bg-blue-400 text-white px-2 py-1 rounded text-xs"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    // For now, just update local state (no backend)
                                                                    const replyText = replyInputs[comment.id]?.trim();
                                                                    if (!replyText) return;
                                                                    setPosts(prevPosts => prevPosts.map(p =>
                                                                        p.id === post.id ? {
                                                                            ...p,
                                                                            comments: p.comments.map(c =>
                                                                                c.id === comment.id ? {
                                                                                    ...c,
                                                                                    replies: c.replies ? [...c.replies, { id: Date.now(), userName: 'You', comment: replyText, createdAt: new Date().toISOString() }] : [{ id: Date.now(), userName: 'You', comment: replyText, createdAt: new Date().toISOString() }]
                                                                                } : c
                                                                            )
                                                                        } : p
                                                                    ));
                                                                    setReplyInputs(prev => ({ ...prev, [comment.id]: '' }));
                                                                }}
                                                            >Reply</button>
                                                        </div>
                                                    )}
                                                    {/* Render replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="ml-6 mt-1">
                                                            {comment.replies.map(reply => (
                                                                <div key={reply.id} className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-xs">{reply.userName || 'User'}</span>
                                                                    <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                    <span className="text-sm">{reply.comment}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-400 ml-2">No comments yet.</div>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                    {/* Pagination: Page Numbers */}
                    {!loading && !error && posts.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center my-4 gap-1">
                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                                <button
                                    key={num}
                                    className={`px-3 py-1 rounded border text-sm mx-0.5 ${num === page ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-300 hover:bg-blue-100'}`}
                                    onClick={() => handlePageChange(num)}
                                    disabled={num === page}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
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



